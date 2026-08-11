import { requireRole } from '@/features/auth/guards'
import { getUpcomingEvents, EVENT_TYPE_LABEL } from '@/features/events/service'
import { getReservedCounts } from '@/features/events/reservations'
import { formatEventDate } from '@/features/events/format'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Administración · Eventos' }

export default async function AdminEventsPage() {
  await requireRole('ADMIN', 'EDITOR')
  const upcoming = await getUpcomingEvents()
  const counts = await getReservedCounts(upcoming.map((e) => String(e.id)))

  return (
    <div>
      <p className="mb-4 text-[13px] text-muted">
        Demanda de los próximos directos. Los eventos se crean y editan en el CMS.
      </p>
      {upcoming.length === 0 ? (
        <EmptyState
          icon="▣"
          title="No hay eventos programados"
          description="Crea el próximo evento desde el CMS (colección Eventos)."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((event) => {
            const reserved = counts.get(String(event.id)) ?? 0
            const pct =
              event.capacity != null && event.capacity > 0
                ? Math.round((reserved / event.capacity) * 100)
                : null
            return (
              <article
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{EVENT_TYPE_LABEL[event.eventType]}</Badge>
                    <span className="font-mono text-[11px] text-muted">
                      {formatEventDate(event.startAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-snug font-semibold">{event.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand">
                    {reserved}
                    {event.capacity != null && (
                      <span className="text-sm font-normal text-muted"> / {event.capacity}</span>
                    )}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {pct != null ? `${pct}% del aforo` : 'sin límite de aforo'}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
