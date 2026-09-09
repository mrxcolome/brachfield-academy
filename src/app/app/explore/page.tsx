import Link from 'next/link'
import Image from 'next/image'
import { requireActiveMember } from '@/features/auth/guards'
import { getFeaturedContents, getPublishedCourses, getCategories } from '@/features/content/service'
import { ContentCard } from '@/components/product/content-card'
import { EmptyState } from '@/components/ui/empty-state'
import { COURSES_TILE, MEDIUM_TILES, COMPACT_TILES } from '@/features/content/tiles'

export const metadata = { title: 'Explorar' }

export default async function ExplorePage() {
  await requireActiveMember()
  const [featured, courses, categories] = await Promise.all([
    getFeaturedContents(3),
    getPublishedCourses(),
    getCategories(),
  ])

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Explorar</h1>
      <p className="mb-7 text-sm text-muted">
        Todo el catálogo, organizado por lo que necesitas conseguir — no por formatos.
      </p>

      <section aria-label="Tipologías de contenido" className="mb-3.5">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={COURSES_TILE.href}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline sm:col-span-2 lg:row-span-2"
          >
            <div className="relative aspect-video w-full lg:aspect-auto lg:min-h-0 lg:flex-1">
              <Image
                src={COURSES_TILE.img}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5 p-5">
              <p className="text-lg font-bold text-brand">Cursos</p>
              <p className="text-[13.5px] font-semibold text-ink-2">
                «Aprende un tema completo» — con lecciones y tu progreso guardado
              </p>
              <p className="text-[12.5px] leading-relaxed text-muted">
                La formación de fondo de la academia: del marco legal de la morosidad al recobro
                paso a paso.
              </p>
              <p className="mt-0.5 text-[13px] font-semibold text-brand-link">
                Ver los {courses.length} cursos →
              </p>
            </div>
          </Link>

          {MEDIUM_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={tile.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 250px"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="mb-0.5 text-[13px] font-bold text-brand">{tile.label}</p>
                <p className="text-[11.5px] leading-snug text-muted">«{tile.promise}»</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Contenido de consulta" className="mb-9">
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {COMPACT_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="rounded-lg border border-border bg-surface p-4 text-inherit no-underline"
            >
              <span
                aria-hidden
                className="mb-2 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-brand-soft text-[15px] text-brand-link"
              >
                {tile.glyph}
              </span>
              <p className="mb-0.5 text-[13px] font-bold text-brand">{tile.label}</p>
              <p className="text-[11.5px] leading-snug text-muted">«{tile.promise}»</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mb-9">
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Destacados esta semana</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        </section>
      ) : (
        courses.length === 0 && (
          <EmptyState
            icon="◎"
            title="Aún no hay contenido publicado"
            description="El equipo editorial está preparando el contenido."
          />
        )
      )}

      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">O por área de conocimiento</h2>
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
    </div>
  )
}
