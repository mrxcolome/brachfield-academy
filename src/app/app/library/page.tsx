import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import {
  getPublishedContents,
  getCategories,
  CONTENT_TYPE_META,
  LEVEL_META,
} from '@/features/content/service'
import type { Content } from '@/payload/payload-types'
import { ContentCard } from '@/components/product/content-card'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/cn'

export const metadata = { title: 'Biblioteca' }

interface Props {
  searchParams: Promise<{ tipo?: string; categoria?: string; nivel?: string }>
}

type ContentType = Content['contentType']
type Level = NonNullable<Content['level']>

function isContentType(v: string | undefined): v is ContentType {
  return v !== undefined && v in CONTENT_TYPE_META
}
function isLevel(v: string | undefined): v is Level {
  return v !== undefined && v in LEVEL_META
}

/** Chip-enlace que añade/quita un filtro conservando el resto de la query. */
function FilterChip({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-semibold no-underline transition-colors',
        active
          ? 'border-brand bg-brand text-white'
          : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
      )}
    >
      {label}
    </Link>
  )
}

export default async function LibraryPage({ searchParams }: Props) {
  await requireActiveMember()
  const params = await searchParams

  const type = isContentType(params.tipo) ? params.tipo : undefined
  const level = isLevel(params.nivel) ? params.nivel : undefined
  const categorySlug = params.categoria || undefined

  const [contents, categories] = await Promise.all([
    getPublishedContents({ type, level, categorySlug }),
    getCategories(),
  ])

  const activeCategory = categories.find((c) => c.slug === categorySlug)
  const hasFilters = Boolean(type ?? level ?? categorySlug)

  // href de una combinación de filtros (omitiendo los vacíos)
  function href(next: { tipo?: string; categoria?: string; nivel?: string }): string {
    const merged = {
      tipo: 'tipo' in next ? next.tipo : type,
      categoria: 'categoria' in next ? next.categoria : categorySlug,
      nivel: 'nivel' in next ? next.nivel : level,
    }
    const qs = new URLSearchParams()
    if (merged.tipo) qs.set('tipo', merged.tipo)
    if (merged.categoria) qs.set('categoria', merged.categoria)
    if (merged.nivel) qs.set('nivel', merged.nivel)
    const s = qs.toString()
    return s ? `/app/library?${s}` : '/app/library'
  }

  // Solo se ofrecen los tipos con presencia editorial real (evita chips muertas)
  const typeOptions = (Object.keys(CONTENT_TYPE_META) as ContentType[]).filter(
    (t) => t === type || contents.some((c) => c.contentType === t) || !hasFilters,
  )

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Biblioteca</h1>
      <p className="mb-6 text-sm text-muted">
        Todo el contenido de la Academy, organizado para consultar cuando lo necesitas.
      </p>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por formato"
        >
          <span className="mr-1 font-mono text-[10.5px] tracking-wide text-muted uppercase">
            Formato
          </span>
          <FilterChip label="Todos" active={!type} href={href({ tipo: undefined })} />
          {typeOptions.map((t) => (
            <FilterChip
              key={t}
              label={CONTENT_TYPE_META[t].label}
              active={type === t}
              href={href({ tipo: type === t ? undefined : t })}
            />
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por tema"
        >
          <span className="mr-1 font-mono text-[10.5px] tracking-wide text-muted uppercase">
            Tema
          </span>
          <FilterChip label="Todos" active={!categorySlug} href={href({ categoria: undefined })} />
          {categories.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.name}
              active={categorySlug === cat.slug}
              href={href({ categoria: categorySlug === cat.slug ? undefined : cat.slug })}
            />
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por nivel"
        >
          <span className="mr-1 font-mono text-[10.5px] tracking-wide text-muted uppercase">
            Nivel
          </span>
          <FilterChip label="Todos" active={!level} href={href({ nivel: undefined })} />
          {(Object.keys(LEVEL_META) as Level[]).map((l) => (
            <FilterChip
              key={l}
              label={LEVEL_META[l]}
              active={level === l}
              href={href({ nivel: level === l ? undefined : l })}
            />
          ))}
        </div>
      </div>

      <p className="mb-4 font-mono text-xs text-muted" aria-live="polite">
        {contents.length} {contents.length === 1 ? 'resultado' : 'resultados'}
        {activeCategory ? ` en ${activeCategory.name}` : ''}
      </p>

      {contents.length === 0 ? (
        <EmptyState
          icon="▥"
          title="Sin resultados con estos filtros"
          description="Prueba a quitar algún filtro o explora otro tema."
          action={
            hasFilters ? (
              <Link
                href="/app/library"
                className="rounded-sm bg-brand px-4 py-2 text-[13px] font-semibold text-white no-underline hover:bg-brand-hover"
              >
                Quitar filtros
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((c) => (
            <ContentCard key={c.id} content={c} />
          ))}
        </div>
      )}
    </div>
  )
}
