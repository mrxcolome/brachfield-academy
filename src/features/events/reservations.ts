// Reservas de eventos (solo dominio de aplicación / Prisma).
// Separado de service.ts (que lee del CMS) para que los tests de integración
// no necesiten cargar Payload.
import { db } from '@/lib/db'
import type { Event } from '@/payload/payload-types'

/** Plazas reservadas por evento (para pintar aforo restante). */
export async function getReservedCounts(eventIds: string[]): Promise<Map<string, number>> {
  if (eventIds.length === 0) return new Map()
  const rows = await db.eventRegistration.groupBy({
    by: ['eventId'],
    where: { eventId: { in: eventIds }, status: 'RESERVED' },
    _count: { _all: true },
  })
  return new Map(rows.map((r) => [r.eventId, r._count._all]))
}

/** Eventos en los que el usuario tiene plaza RESERVED. */
export async function getUserReservations(userId: string): Promise<Set<string>> {
  const rows = await db.eventRegistration.findMany({
    where: { userId, status: 'RESERVED' },
    select: { eventId: true },
  })
  return new Set(rows.map((r) => r.eventId))
}

export type ReserveResult =
  { ok: true } | { ok: false; reason: 'past' | 'full' | 'already-reserved' }

/**
 * Reserva de plaza con control de aforo. El conteo y el upsert no son
 * atómicos: con aforos de cientos de plazas una carrera puntual que deje
 * entrar a una persona de más es aceptable (no es venta de entradas).
 */
export async function reserve(userId: string, event: Event): Promise<ReserveResult> {
  if (new Date(event.startAt) <= new Date()) return { ok: false, reason: 'past' }
  const eventId = String(event.id)

  const existing = await db.eventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId } },
  })
  if (existing?.status === 'RESERVED') return { ok: false, reason: 'already-reserved' }

  if (event.capacity != null) {
    const reserved = await db.eventRegistration.count({
      where: { eventId, status: 'RESERVED' },
    })
    if (reserved >= event.capacity) return { ok: false, reason: 'full' }
  }

  await db.eventRegistration.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId, status: 'RESERVED' },
    // Re-reserva tras cancelar: se reactiva la misma fila y el recordatorio
    update: { status: 'RESERVED', reminderSentAt: null },
  })
  return { ok: true }
}

export async function cancelReservation(userId: string, eventId: string): Promise<boolean> {
  const existing = await db.eventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId } },
  })
  if (!existing || existing.status !== 'RESERVED') return false
  await db.eventRegistration.update({
    where: { id: existing.id },
    data: { status: 'CANCELED' },
  })
  return true
}
