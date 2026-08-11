'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireActiveMember } from '@/features/auth/guards'
import { sendEmail } from '@/lib/email'
import { eventReservedEmail } from '@/emails/templates'
import { getEventBySlug } from './service'
import { reserve, cancelReservation } from './reservations'
import { formatEventDate } from './format'

const schema = z.object({ eventSlug: z.string().min(1) })

export async function reserveEventAction(raw: unknown): Promise<{ ok?: boolean; error?: string }> {
  const { user } = await requireActiveMember()
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }

  const event = await getEventBySlug(parsed.data.eventSlug)
  if (!event) return { error: 'Evento no encontrado' }

  const result = await reserve(user.id, event)
  if (!result.ok) {
    const messages = {
      past: 'Este evento ya ha empezado o terminado.',
      full: 'No quedan plazas para este evento.',
      'already-reserved': 'Ya tienes plaza reservada.',
    } as const
    return { error: messages[result.reason] }
  }

  // La confirmación no debe romper la reserva si el proveedor falla
  try {
    await sendEmail(
      user.email,
      eventReservedEmail(user.name, event.title, formatEventDate(event.startAt)),
    )
  } catch (e) {
    console.error('[events] fallo al enviar confirmación de reserva', e)
  }

  revalidatePath('/app/events')
  return { ok: true }
}

export async function cancelEventAction(raw: unknown): Promise<{ ok?: boolean; error?: string }> {
  const { user } = await requireActiveMember()
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }

  const event = await getEventBySlug(parsed.data.eventSlug)
  if (!event) return { error: 'Evento no encontrado' }

  const canceled = await cancelReservation(user.id, String(event.id))
  if (!canceled) return { error: 'No tienes plaza reservada en este evento.' }

  revalidatePath('/app/events')
  return { ok: true }
}
