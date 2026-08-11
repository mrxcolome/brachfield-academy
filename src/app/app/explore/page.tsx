import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import {
  getFeaturedContents,
  getPublishedContents,
  getPublishedCourses,
  getCategories,
} from '@/features/content/service'
import { Cover } from '@/components/art'
import { ContentCard } from '@/components/product/content-card'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Explorar' }

export default async function ExplorePage() {
  await requireActiveMember()
  const [featured, latest, courses, categories] = await Promise.all([
    getFeaturedContents(4),
    getPublishedContents({ limit: 8 }),
    getPublishedCourses(),
    getCategories(),
  ])

  // Las novedades no repiten lo ya destacado
  const featuredIds = new Set(featured.map((c) => c.id))
  const news = latest.filter((c) => !featuredIds.has(c.id)).slice(0, 8)

  const empty = featured.length === 0 && news.length === 0 && courses.length === 0

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Explorar</h1>
      <p className="mb-7 text-sm text-muted">
        Lo más relevante del momento, seleccionado por el equipo editorial.
      </p>

      {empty ? (
        <EmptyState
          icon="◎"
          title="Aún no hay contenido publicado"
          description="El equipo editorial está preparando el contenido."
        />
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mb-9">
              <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Destacados</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((c) => (
                  <ContentCard key={c.id} content={c} />
                ))}
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className="mb-9">
              <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Explora por tema</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/app/library?categoria=${cat.slug}`}
                    className="rounded-full border border-border-chip bg-surface px-3.5 py-2 text-[13px] font-medium text-ink-2 no-underline hover:bg-bg"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {courses.length > 0 && (
            <section className="mb-9">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-[13px] font-semibold text-ink-2">Cursos</h2>
                <Link
                  href="/app/learning"
                  className="text-xs font-semibold text-brand-link no-underline hover:underline"
                >
                  Mi formación →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 6).map((course) => (
                  <Link
                    key={course.id}
                    href={`/app/courses/${course.slug}`}
                    className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
                  >
                    <Cover title={course.title} kind="curso" style={{ aspectRatio: '16/10' }} />
                    <div className="p-3.5">
                      <p className="mb-1.5 font-mono text-[10.5px] tracking-wide text-muted uppercase">
                        Curso
                      </p>
                      <p className="text-[13.5px] leading-snug font-semibold">{course.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {news.length > 0 && (
            <section className="mb-9">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-[13px] font-semibold text-ink-2">Novedades</h2>
                <Link
                  href="/app/library"
                  className="text-xs font-semibold text-brand-link no-underline hover:underline"
                >
                  Ver toda la biblioteca →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {news.map((c) => (
                  <ContentCard key={c.id} content={c} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
