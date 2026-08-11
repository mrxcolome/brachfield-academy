// Cron diario (vercel.json): recordatorio por email a las reservas RESERVED
// de eventos que empiezan en las próximas 24h. reminderSentAt evita duplicados
// si el cron se ejecuta más de una vez.
import { NextResponse } from 'next/server'
import { cms } from '@/lib/cms'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { eventReminderEmail } from '@/emails/templates'
import { formatEventDate } from '@/features/events/format'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<NextResponse> {
  // Vercel Cron manda Authorization: Bearer <CRON_SECRET> si el env var existe
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const payload = await cms()
  const events = await payload.find({
    collection: 'events',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { startAt: { greater_than: now.toISOString() } },
        { startAt: { less_than: in24h.toISOString() } },
      ],
    },
    limit: 20,
    depth: 0,
  })

  let sent = 0
  let failed = 0

  for (const event of events.docs) {
    const pending = await db.eventRegistration.findMany({
      where: { eventId: String(event.id), status: 'RESERVED', reminderSentAt: null },
      include: { user: { select: { name: true, email: true } } },
    })

    for (const reg of pending) {
      try {
        await sendEmail(
          reg.user.email,
          eventReminderEmail(
            reg.user.name,
            event.title,
            formatEventDate(event.startAt),
            event.streamUrl ?? null,
          ),
        )
        await db.eventRegistration.update({
          where: { id: reg.id },
          data: { reminderSentAt: new Date() },
        })
        sent++
      } catch (e) {
        // Se reintentará en la próxima ejecución (reminderSentAt sigue null)
        console.error(`[cron:event-reminders] fallo con ${reg.user.email}`, e)
        failed++
      }
    }
  }

  return NextResponse.json({ events: events.docs.length, sent, failed })
}
