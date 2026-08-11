// Integración real contra Postgres: resolución de preguntas del admin.
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { resolveQuestion } from '@/features/admin/service'

const EMAIL = 'pregunta-test@integration.brachfieldacademy.test'
let userId: string
let questionId: string

beforeAll(async () => {
  await db.user.deleteMany({ where: { email: EMAIL } })
  const user = await db.user.create({ data: { name: 'Test Pregunta', email: EMAIL } })
  userId = user.id
  const q = await db.question.create({
    data: {
      userId,
      question: '¿Puedo reclamar intereses de demora sin pactarlos en el contrato?',
      category: 'legal',
    },
  })
  questionId = q.id
})

afterAll(async () => {
  await db.user.deleteMany({ where: { email: EMAIL } })
  await db.$disconnect()
})

describe('resolveQuestion', () => {
  it('responder marca ANSWERED, guarda respuesta y notifica al autor', async () => {
    const ok = await resolveQuestion(questionId, {
      status: 'ANSWERED',
      answer: 'Sí: la Ley 3/2004 los devenga automáticamente sin necesidad de pacto.',
    })
    expect(ok).toBe(true)

    const q = await db.question.findUniqueOrThrow({ where: { id: questionId } })
    expect(q.status).toBe('ANSWERED')
    expect(q.answer).toContain('Ley 3/2004')
    expect(q.answeredAt).not.toBeNull()

    const notif = await db.notification.findFirst({
      where: { userId, title: { contains: 'respondido' } },
    })
    expect(notif).not.toBeNull()
    expect(notif?.read).toBe(false)
  })

  it('descartar no genera notificación', async () => {
    const q2 = await db.question.create({
      data: { userId, question: 'Pregunta a descartar', category: 'otros' },
    })
    await resolveQuestion(q2.id, { status: 'DISCARDED' })
    const notif = await db.notification.findFirst({
      where: { userId, message: { contains: 'descartar' } },
    })
    expect(notif).toBeNull()
    expect((await db.question.findUniqueOrThrow({ where: { id: q2.id } })).status).toBe('DISCARDED')
  })

  it('id inexistente devuelve false', async () => {
    expect(await resolveQuestion('no-existe', { status: 'DISCARDED' })).toBe(false)
  })
})
