import Link from 'next/link'
import Image from 'next/image'
import { requireActiveMember } from '@/features/auth/guards'
import {
  getPublishedContents,
  getPublishedCourses,
  CONTENT_TYPE_META,
} from '@/features/content/service'
import { contentCover, courseCover } from '@/features/content/covers'
import { isNew } from '@/features/content/fresh'
import { NewBadge } from '@/components/product/content-card'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Nuevo este mes' }

interface FeedItem {
  key: string
  href: string
  cover: string
  typeLabel: string
  title: string
  excerpt: string | null
  publishedAt: string
  duration: string | null
}

const monthFmt = new Intl.DateTimeFormat('es-ES', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Madrid',
})
const dayFmt = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Madrid',
})

/** «Nuevo este mes» (rediseño 2026-09-09): el histórico de la academia, mes a
 *  mes — todo lo publicado, sea curso o pieza, lo más reciente arriba. */
export default async function NewPage() {
  await requireActiveMember()
  const [contents, courses] = await Promise.all([
    getPublishedContents({ limit: 60 }),
    getPublishedCourses(),
  ])

  const items: FeedItem[] = [
    ...contents
      .filter((c) => c.publishedAt)
      .map((c) => ({
        key: `content-${c.id}`,
        href: `/app/contents/${c.slug}`,
        cover: contentCover(c),
        typeLabel: CONTENT_TYPE_META[c.contentType].label,
        title: c.title,
        excerpt: c.excerpt ?? null,
        publishedAt: c.publishedAt as string,
        duration: c.duration ?? null,
      })),
    ...courses
      .filter((c) => c.publishedAt)
      .map((c) => ({
        key: `course-${c.id}`,
        href: `/app/courses/${c.slug}`,
        cover: courseCover(c),
        typeLabel: 'Curso',
        title: c.title,
        excerpt: c.description ?? null,
        publishedAt: c.publishedAt as string,
        duration: c.duration ?? null,
      })),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  // Agrupar por mes natural (hora peninsular), conservando el orden
  const months: { label: string; items: FeedItem[] }[] = []
  for (const item of items) {
    const raw = monthFmt.format(new Date(item.publishedAt))
    const label = raw.charAt(0).toUpperCase() + raw.slice(1)
    const last = months[months.length - 1]
    if (last && last.label === label) last.items.push(item)
    else months.push({ label, items: [item] })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold">Nuevo este mes</h1>
      <p className="mb-7 text-sm text-muted">
        El histórico de la academia, mes a mes: lo más reciente arriba. Cada mes publicamos
        contenido nuevo — lo recién llegado lleva la etiqueta naranja.
      </p>

      {months.length === 0 ? (
        <EmptyState
          icon="✦"
          title="Aún no hay contenido publicado"
          description="El equipo editorial está preparando el contenido."
        />
      ) : (
        months.map((month) => (
          <section key={month.label} aria-label={month.label} className="mb-8">
            <h2 className="mb-3 text-[13px] font-semibold text-ink-2">{month.label}</h2>
            <div className="flex flex-col gap-3">
              {month.items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3.5 text-inherit no-underline"
                >
                  <span className="relative w-28 flex-none overflow-hidden rounded-md sm:w-33">
                    <Image
                      src={item.cover}
                      alt=""
                      width={264}
                      height={149}
                      className="aspect-video w-full object-cover"
                    />
                    {isNew(item.publishedAt) && <NewBadge />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-0.5 block font-mono text-[10.5px] tracking-wide text-muted uppercase">
                      {item.typeLabel} · {dayFmt.format(new Date(item.publishedAt))}
                      {item.duration ? ` · ${item.duration}` : ''}
                    </span>
                    <span className="block text-sm leading-snug font-semibold">{item.title}</span>
                    {item.excerpt ? (
                      <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-relaxed text-muted">
                        {item.excerpt}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
