import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import { getUpcomingEvents, getReplayEvents, EVENT_TYPE_LABEL } from '@/features/events/service'
import { getReservedCounts, getUserReservations } from '@/features/events/reservations'
import { formatEventDate, eventDateBlock } from '@/features/events/format'
import type { Content } from '@/payload/payload-types'
import { ReserveButton } from '@/components/product/reserve-button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Eventos' }

export default async function EventsPage() {
  const { user } = await requireActiveMember()
  const [upcoming, replays] = await Promise.all([getUpcomingEvents(), getReplayEvents()])
  const [counts, reservations] = await Promise.all([
    getReservedCounts(upcoming.map((e) => String(e.id))),
    getUserReservations(user.id),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold">Eventos</h1>
      <p className="mb-7 text-sm text-muted">
        Masterclass y sesiones en directo con Pere. Reserva tu plaza y te recordaremos la cita por
        email el día antes.
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Próximos</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            icon="▣"
            title="No hay eventos programados ahora mismo"
            description="Publicaremos aquí la próxima masterclass o Q&A — y te avisaremos."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((event) => {
              const { day, month } = eventDateBlock(event.startAt)
              const reserved = reservations.has(String(event.id))
              const taken = counts.get(String(event.id)) ?? 0
              const remaining = event.capacity != null ? Math.max(0, event.capacity - taken) : null
              return (
                <article
                  key={event.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-start"
                >
                  <div
                    aria-hidden
                    className="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-lg bg-brand-soft text-brand"
                  >
                    <span className="text-xl leading-none font-bold">{day}</span>
                    <span className="font-mono text-[10.5px] tracking-wide">{month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{EVENT_TYPE_LABEL[event.eventType]}</Badge>
                      {remaining != null && remaining <= 20 && remaining > 0 && (
                        <span className="font-mono text-[11px] text-accent-ink">
                          Últimas {remaining} plazas
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1 text-[15px] leading-snug font-semibold">{event.title}</h3>
                    <p className="mb-1.5 text-[13px] leading-relaxed text-ink-2">
                      {event.description}
                    </p>
                    <p className="mb-3 font-mono text-[11.5px] text-muted">
                      {formatEventDate(event.startAt)}
                      {event.speaker ? ` · ${event.speaker}` : ''}
                    </p>
                    <ReserveButton
                      eventSlug={event.slug}
                      initialReserved={reserved}
                      full={remaining === 0}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {replays.length > 0 && (
        <section>
          <h2 className="mb-1 text-[13px] font-semibold text-ink-2">Replays</h2>
          <p className="mb-3 text-[13px] text-muted">
            ¿Te perdiste un directo? Las grabaciones quedan disponibles aquí.
          </p>
          <div className="flex flex-col gap-3">
            {replays.map((event) => {
              const replay =
                typeof event.replayContent === 'object' && event.replayContent !== null
                  ? (event.replayContent as Content)
                  : null
              if (!replay) return null
              return (
                <Link
                  key={event.id}
                  href={`/app/contents/${replay.slug}`}
                  className="flex items-center gap-3.5 rounded-lg border border-border bg-surface p-3.5 text-inherit no-underline"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-player text-sm text-white"
                  >
                    ▶
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm leading-snug font-semibold">{event.title}</span>
                    <span className="block font-mono text-[11px] text-muted">
                      {EVENT_TYPE_LABEL[event.eventType]} ·{' '}
                      {new Intl.DateTimeFormat('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'Europe/Madrid',
                      }).format(new Date(event.startAt))}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
