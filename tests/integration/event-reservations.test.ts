// Integración real contra Postgres: reservas de eventos con aforo.
// Requiere DATABASE_URL. No depende del seed editorial (los eventos se
// construyen aquí; solo la tabla event_registration es real).
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { reserve, cancelReservation } from '@/features/events/reservations'
import type { Event } from '@/payload/payload-types'

const EMAILS = [
  'evento-test-1@integration.brachfieldacademy.test',
  'evento-test-2@integration.brachfieldacademy.test',
  'evento-test-3@integration.brachfieldacademy.test',
]
const EVENT_ID = 987654

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: EVENT_ID,
    title: 'Evento de test',
    slug: 'evento-de-test',
    description: 'test',
    eventType: 'WEBINAR',
    startAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    capacity: 2,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    _status: 'published',
    ...overrides,
  }
}

let userIds: string[] = []

beforeAll(async () => {
  await db.user.deleteMany({ where: { email: { in: EMAILS } } })
  userIds = []
  for (const email of EMAILS) {
    const u = await db.user.create({ data: { name: 'Test Evento', email } })
    userIds.push(u.id)
  }
})

afterAll(async () => {
  await db.user.deleteMany({ where: { email: { in: EMAILS } } })
  await db.$disconnect()
})

describe('reserve', () => {
  it('reserva plaza en un evento futuro con aforo libre', async () => {
    const res = await reserve(userIds[0]!, makeEvent())
    expect(res).toEqual({ ok: true })
    const row = await db.eventRegistration.findUnique({
      where: { userId_eventId: { userId: userIds[0]!, eventId: String(EVENT_ID) } },
    })
    expect(row?.status).toBe('RESERVED')
  })

  it('la doble reserva del mismo usuario no crea otra fila', async () => {
    const res = await reserve(userIds[0]!, makeEvent())
    expect(res).toEqual({ ok: false, reason: 'already-reserved' })
  })

  it('respeta el aforo: la tercera persona no entra', async () => {
    expect(await reserve(userIds[1]!, makeEvent())).toEqual({ ok: true })
    expect(await reserve(userIds[2]!, makeEvent())).toEqual({ ok: false, reason: 'full' })
  })

  it('sin aforo definido no hay límite', async () => {
    const res = await reserve(userIds[2]!, makeEvent({ capacity: null }))
    // mismo evento: sigue lleno solo si capacity aplica; aquí capacity null → entra
    expect(res).toEqual({ ok: true })
    await db.eventRegistration.delete({
      where: { userId_eventId: { userId: userIds[2]!, eventId: String(EVENT_ID) } },
    })
  })

  it('no deja reservar un evento ya empezado', async () => {
    const past = makeEvent({ startAt: new Date(Date.now() - 3600000).toISOString() })
    expect(await reserve(userIds[2]!, past)).toEqual({ ok: false, reason: 'past' })
  })
})

describe('cancelReservation + re-reserva', () => {
  it('cancela y libera la plaza para otra persona', async () => {
    expect(await cancelReservation(userIds[0]!, String(EVENT_ID))).toBe(true)
    // La plaza liberada permite entrar a quien antes encontró aforo lleno
    expect(await reserve(userIds[2]!, makeEvent())).toEqual({ ok: true })
  })

  it('cancelar sin reserva activa devuelve false', async () => {
    expect(await cancelReservation(userIds[0]!, String(EVENT_ID))).toBe(false)
  })

  it('re-reservar tras cancelar reactiva la misma fila y resetea el recordatorio', async () => {
    // userIds[2] cancela y userIds[0] vuelve: upsert reactiva su fila CANCELED
    await cancelReservation(userIds[2]!, String(EVENT_ID))
    const res = await reserve(userIds[0]!, makeEvent())
    expect(res).toEqual({ ok: true })
    const rows = await db.eventRegistration.findMany({
      where: { userId: userIds[0]!, eventId: String(EVENT_ID) },
    })
    expect(rows).toHaveLength(1)
    expect(rows[0]?.status).toBe('RESERVED')
    expect(rows[0]?.reminderSentAt).toBeNull()
  })
})
