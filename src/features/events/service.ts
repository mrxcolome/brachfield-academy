// Lecturas de eventos desde el CMS (Payload). Las reservas viven en
// reservations.ts (solo Prisma, testeable sin cargar Payload).
import { cms } from '@/lib/cms'
import type { Event } from '@/payload/payload-types'

export type CmsEvent = Event

export const EVENT_TYPE_LABEL: Record<Event['eventType'], string> = {
  WEBINAR: 'Webinar',
  QA: 'Q&A en directo',
  MASTERCLASS: 'Masterclass',
  CASE: 'Caso práctico',
  LEGAL_UPDATE: 'Actualización legal',
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'events',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { startAt: { greater_than: new Date().toISOString() } },
      ],
    },
    sort: 'startAt',
    limit: 20,
    depth: 0,
  })
  return res.docs
}

/** Eventos pasados con replay publicado (depth 1 resuelve el contenido). */
export async function getReplayEvents(): Promise<Event[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'events',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { startAt: { less_than: new Date().toISOString() } },
        { replayContent: { exists: true } },
      ],
    },
    sort: '-startAt',
    limit: 12,
    depth: 1,
  })
  return res.docs
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'events',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ?? null
}
