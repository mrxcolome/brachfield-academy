import Link from 'next/link'
import Image from 'next/image'
import { requireActiveMember } from '@/features/auth/guards'
import { getPublishedContents } from '@/features/content/service'
import { getSectorNews } from '@/features/sector-news/service'
import { getUpcomingEvents, getReplayEvents, EVENT_TYPE_LABEL } from '@/features/events/service'
import { getReservedCounts, getUserReservations } from '@/features/events/reservations'
import { formatEventDate } from '@/features/events/format'
import type { Content } from '@/payload/payload-types'
import { contentCover } from '@/features/content/covers'
import { isNew } from '@/features/content/fresh'
import { NewBadge } from '@/components/product/content-card'
import { NewsImage } from '@/components/product/news-image'
import { ReserveButton } from '@/components/product/reserve-button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import type { SectorNewsItem } from '@/features/sector-news/service'

export const metadata = { title: 'Actualidad' }

const dateFmt = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Madrid',
})
const dayKeyFmt = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'short',
  timeZone: 'Europe/Madrid',
})

// Respaldo visual cuando el medio no trae imagen (o su URL deja de servir):
// rotación estable sobre la serie de fotos de marca.
const NEWS_FALLBACKS = [
  '/landing/formato-actualizaciones.webp',
  '/landing/area-legislacion.webp',
  '/landing/area-financiera.webp',
  '/landing/area-riesgo.webp',
  '/landing/area-prevencion.webp',
]
function fallbackFor(id: string): string {
  let h = 0
  for (const ch of id) h = (h + ch.charCodeAt(0)) % NEWS_FALLBACKS.length
  return NEWS_FALLBACKS[h]!
}

/** Tarjeta de la retícula de noticias: imagen grande, titular grande, la
 *  clave didáctica y el puente al catálogo. El titular lleva a la fuente. */
function NewsCard({ item, hero = false }: { item: SectorNewsItem; hero?: boolean }) {
  const esHoy = dayKeyFmt.format(item.publishedAt) === dayKeyFmt.format(new Date())
  const relatedHref =
    item.relatedSlug && item.relatedKind
      ? item.relatedKind === 'course'
        ? `/app/courses/${item.relatedSlug}`
        : `/app/contents/${item.relatedSlug}`
      : null
  return (
    <article
      className={`overflow-hidden rounded-lg border border-border bg-surface ${hero ? 'sm:col-span-2' : ''}`}
    >
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
        <NewsImage
          src={item.imageUrl}
          fallback={fallbackFor(item.id)}
          className={`w-full object-cover ${hero ? 'h-56 sm:h-80' : 'aspect-video'}`}
        />
      </a>
      <div className={hero ? 'p-5 sm:p-6' : 'p-4'}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {esHoy && (
            <span className="rounded-[5px] bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white">
              HOY
            </span>
          )}
          {item.topic && (
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand-link">
              {item.topic}
            </span>
          )}
          <span className="font-mono text-[11px] text-muted">
            {item.source} · {dateFmt.format(item.publishedAt)}
          </span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit no-underline hover:text-brand"
        >
          <h3
            className={`leading-tight font-bold ${hero ? 'text-xl sm:text-[22px]' : 'text-[16px]'}`}
          >
            {item.title}{' '}
            <span aria-hidden className="text-brand-link">
              ↗
            </span>
          </h3>
        </a>
        {item.summary && (
          <p className={`mt-2 leading-relaxed text-ink-2 ${hero ? 'text-sm' : 'text-[13px]'}`}>
            <span className="font-semibold text-accent-ink">La clave para ti: </span>
            {item.summary}
          </p>
        )}
        {relatedHref && item.relatedTitle && (
          <Link
            href={relatedHref}
            className="mt-2.5 inline-block text-[13px] font-semibold text-brand-link no-underline hover:underline"
          >
            En la academia: {item.relatedTitle} →
          </Link>
        )}
      </div>
    </article>
  )
}

/** Actualidad (rediseño 2026-09-09): lo que cambia AHÍ FUERA — noticias del
 *  sector y las citas en directo con Pere. Absorbe la antigua página Eventos. */
export default async function UpdatesPage() {
  const { user } = await requireActiveMember()
  const [news, board, upcoming, replays] = await Promise.all([
    getPublishedContents({ type: 'NEWS', limit: 12 }),
    getSectorNews(30),
    getUpcomingEvents(),
    getReplayEvents(),
  ])
  const [counts, reservations] = await Promise.all([
    getReservedCounts(upcoming.map((e) => String(e.id))),
    getUserReservations(user.id),
  ])

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Actualidad</h1>
      <p className="mb-7 text-sm text-muted">
        Lo que cambia en morosidad y crédito — y las citas en directo con Pere.
      </p>

      <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="sector-title" className="min-w-0">
          <h2 id="sector-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            El sector, al día
          </h2>
          {news.length === 0 && board.length === 0 ? (
            <EmptyState
              icon="◈"
              title="Aún no hay noticias publicadas"
              description="Cuando algo cambie en morosidad y crédito, lo encontrarás aquí."
            />
          ) : (
            <>
              <p className="-mt-1 mb-4 text-[12.5px] text-muted">
                Cada día, la noticia (o dos) que de verdad importa en morosidad y crédito — con la
                clave de por qué te afecta. El titular lleva a la fuente original.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {board.map((item, i) => (
                  <NewsCard key={item.id} item={item} hero={i === 0} />
                ))}
              </div>

              {news.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-[13px] font-semibold text-ink-2">
                    El análisis de la academia
                  </h3>
                  <div className="flex flex-col gap-3">
                    {news.map((item) => (
                      <Link
                        key={item.id}
                        href={`/app/contents/${item.slug}`}
                        className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3.5 text-inherit no-underline"
                      >
                        <span className="relative w-28 flex-none overflow-hidden rounded-md sm:w-33">
                          <Image
                            src={contentCover(item)}
                            alt=""
                            width={264}
                            height={149}
                            className="aspect-video w-full object-cover"
                          />
                          {isNew(item.publishedAt) && <NewBadge />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="mb-0.5 block font-mono text-[10.5px] tracking-wide text-muted uppercase">
                            Actualidad
                            {item.publishedAt
                              ? ` · ${dateFmt.format(new Date(item.publishedAt))}`
                              : ''}
                          </span>
                          <span className="block text-sm leading-snug font-semibold">
                            {item.title}
                          </span>
                          {item.excerpt ? (
                            <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-relaxed text-muted">
                              {item.excerpt}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="directos-title" className="min-w-0">
          <h2 id="directos-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            Próximas sesiones en directo
          </h2>
          {upcoming.length === 0 ? (
            <p className="rounded-lg border border-border bg-surface p-4 text-[13px] leading-relaxed text-ink-3">
              No hay directos programados ahora mismo. Publicaremos aquí la próxima sesión con Pere
              — y te avisaremos.
            </p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {upcoming.map((event) => {
                const reserved = reservations.has(String(event.id))
                const taken = counts.get(String(event.id)) ?? 0
                const remaining =
                  event.capacity != null ? Math.max(0, event.capacity - taken) : null
                return (
                  <article
                    key={event.id}
                    className="rounded-lg border border-border bg-surface p-4"
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{EVENT_TYPE_LABEL[event.eventType]}</Badge>
                      {remaining != null && remaining <= 20 && remaining > 0 && (
                        <span className="font-mono text-[11px] text-accent-ink">
                          Últimas {remaining} plazas
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1 text-[15px] leading-snug font-semibold">{event.title}</h3>
                    <p className="mb-2.5 font-mono text-[11.5px] text-muted">
                      {formatEventDate(event.startAt)}
                      {event.speaker ? ` · ${event.speaker}` : ''}
                    </p>
                    <ReserveButton
                      eventSlug={event.slug}
                      initialReserved={reserved}
                      full={remaining === 0}
                    />
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {replays.length > 0 && (
        <section aria-labelledby="replays-title" className="mt-10">
          <h2 id="replays-title" className="mb-1 text-[13px] font-semibold text-ink-2">
            Replays de sesiones en directo
          </h2>
          <p className="mb-3 text-[13px] text-muted">
            ¿Te perdiste un directo? Las grabaciones quedan disponibles aquí.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
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
