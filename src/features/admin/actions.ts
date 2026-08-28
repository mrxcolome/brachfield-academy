'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireRole } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { resolveQuestion } from './service'
import { track } from '@/features/analytics/service'

const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['MEMBER', 'EDITOR', 'ADMIN']),
})

/** Cambiar rol (solo ADMIN). Un admin no puede quitarse el rol a sí mismo. */
export async function updateUserRole(raw: unknown): Promise<{ ok?: boolean; error?: string }> {
  const { user } = await requireRole('ADMIN')
  const parsed = roleSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  if (parsed.data.userId === user.id) {
    return { error: 'No puedes cambiar tu propio rol.' }
  }
  await db.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  })
  revalidatePath('/app/admin/users')
  return { ok: true }
}

const deleteSchema = z.object({ userId: z.string().min(1) })

/**
 * Eliminar usuario (solo ADMIN). Borrado real con cascada (sesiones, progreso,
 * favoritos, reservas…). Bloqueado sobre uno mismo y sobre suscripciones
 * vigentes o con pago pendiente: primero se cancela en Stripe.
 */
export async function deleteUser(raw: unknown): Promise<{ ok?: boolean; error?: string }> {
  const { user: me } = await requireRole('ADMIN')
  const parsed = deleteSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  if (parsed.data.userId === me.id) {
    return { error: 'No puedes eliminar tu propia cuenta.' }
  }
  const target = await db.user.findUnique({
    where: { id: parsed.data.userId },
    select: {
      subscriptions: { orderBy: { createdAt: 'desc' }, take: 1, select: { status: true } },
    },
  })
  if (!target) return { error: 'Usuario no encontrado' }
  const status = target.subscriptions[0]?.status
  if (status === 'ACTIVE' || status === 'TRIALING' || status === 'PAST_DUE') {
    return { error: 'Tiene una suscripción vigente: cancélala primero en Stripe.' }
  }
  await db.user.delete({ where: { id: parsed.data.userId } })
  revalidatePath('/app/admin/users')
  return { ok: true }
}

const questionSchema = z
  .object({
    questionId: z.string().min(1),
    status: z.enum(['ANSWERED', 'SELECTED', 'DISCARDED']),
    answer: z.string().max(4000).optional(),
  })
  .refine((d) => d.status !== 'ANSWERED' || (d.answer && d.answer.trim().length > 0), {
    message: 'La respuesta no puede estar vacía',
  })

export async function answerQuestion(raw: unknown): Promise<{ ok?: boolean; error?: string }> {
  await requireRole('ADMIN', 'EDITOR')
  const parsed = questionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Solicitud no válida' }

  const ok = await resolveQuestion(parsed.data.questionId, {
    status: parsed.data.status,
    answer: parsed.data.answer?.trim(),
  })
  if (!ok) return { error: 'Pregunta no encontrada' }

  if (parsed.data.status === 'ANSWERED') {
    track('question_answered', { properties: { questionId: parsed.data.questionId } })
  }
  revalidatePath('/app/admin/questions')
  return { ok: true }
}
