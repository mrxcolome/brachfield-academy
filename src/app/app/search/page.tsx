import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import { search, logSearch } from '@/features/search/service'
import { CONTENT_TYPE_META } from '@/features/content/service'
import type { Content } from '@/payload/payload-types'
import { SmartCover } from '@/components/product/smart-cover'
import { contentCover } from '@/features/content/covers'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/cn'

export const metadata = { title: 'Buscar' }

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Inicial',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>
}) {
  const { user } = await requireActiveMember()
  const { q = '', tipo } = await searchParams
  const query = q.trim()

  const type =
    tipo === 'COURSE'
      ? ('COURSE' as const)
      : tipo && tipo in CONTENT_TYPE_META
        ? (tipo as Content['contentType'])
        : undefined

  // Una sola consulta; el filtro de las chips se aplica sobre los resultados
  const unfiltered = query ? await search(query) : []
  const results = !type
    ? unfiltered
    : type === 'COURSE'
      ? unfiltered.filter((r) => r.kind === 'course')
      : unfiltered.filter((r) => r.contentType === type)

  // Solo se registra la búsqueda "completa" (sin filtro), no cada cambio de chip
  if (query && !type) {
    await logSearch(user.id, query, unfiltered.length)
  }
  const hasCourses = unfiltered.some((r) => r.kind === 'course')
  const contentTypes = [
    ...new Set(unfiltered.filter((r) => r.contentType).map((r) => r.contentType!)),
  ]

  function chipHref(t?: string): string {
    const qs = new URLSearchParams({ q: query })
    if (t) qs.set('tipo', t)
    return `/app/search?${qs.toString()}`
  }

  function resultHref(r: (typeof results)[number]): string {
    return r.kind === 'course' ? `/app/courses/${r.slug}` : `/app/contents/${r.slug}`
  }

  function resultMeta(r: (typeof results)[number]): string {
    const parts = [
      r.kind === 'course' ? 'CURSO' : CONTENT_TYPE_META[r.contentType!].label.toUpperCase(),
    ]
    if (r.duration) parts.push(r.duration)
    if (r.level && LEVEL_LABEL[r.level]) parts.push(LEVEL_LABEL[r.level]!)
    return parts.join(' · ')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form action="/app/search" className="mb-4">
        <label htmlFor="search-q" className="sr-only">
          Buscar
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder='Busca "prescripción", "moroso", "factura vencida", "burofax"…'
          autoFocus
          className="w-full rounded-full border border-border-input bg-surface px-5 py-3.5 text-[15px] placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </form>

      {query && (hasCourses || contentTypes.length > 0) && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por formato">
          <Link
            href={chipHref()}
            aria-current={!type ? 'true' : undefined}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold no-underline',
              !type
                ? 'border-brand bg-brand text-white'
                : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
            )}
          >
            Todos
          </Link>
          {hasCourses && (
            <Link
              href={type === 'COURSE' ? chipHref() : chipHref('COURSE')}
              aria-current={type === 'COURSE' ? 'true' : undefined}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold no-underline',
                type === 'COURSE'
                  ? 'border-brand bg-brand text-white'
                  : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
              )}
            >
              Cursos
            </Link>
          )}
          {contentTypes.map((t) => (
            <Link
              key={t}
              href={type === t ? chipHref() : chipHref(t)}
              aria-current={type === t ? 'true' : undefined}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold no-underline',
                type === t
                  ? 'border-brand bg-brand text-white'
                  : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
              )}
            >
              {CONTENT_TYPE_META[t].label}
            </Link>
          ))}
        </div>
      )}

      {query && (
        <p className="mb-5 font-mono text-xs text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para “{query}”
        </p>
      )}

      {!query ? (
        <EmptyState
          icon="⌕"
          title="¿Qué necesitas resolver hoy?"
          description="Busca en cursos, tutoriales, entrevistas, guías, plantillas y transcripciones. Sin preocuparte por los acentos."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="⌕"
          title={`Sin resultados para “${query}”`}
          description="Prueba con otra palabra: por ejemplo «impagado», «negociación» o «riesgo»."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((r) => (
            <Link
              key={`${r.kind}-${r.id}`}
              href={resultHref(r)}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3.5 text-inherit no-underline"
            >
              <div className="w-24 flex-none overflow-hidden rounded-md">
                <SmartCover
                  src={
                    r.kind === 'course'
                      ? '/landing/formato-cursos.webp'
                      : contentCover({ id: r.id, coverImage: null, contentType: r.contentType! })
                  }
                  title={r.title}
                  kind={r.kind === 'course' ? 'curso' : CONTENT_TYPE_META[r.contentType!].kind}
                />
              </div>
              <div className="min-w-0">
                <p className="mb-0.5 text-sm leading-snug font-semibold">{r.title}</p>
                {r.excerpt && (
                  <p className="mb-1 line-clamp-1 text-[12.5px] text-muted">{r.excerpt}</p>
                )}
                <p className="font-mono text-[11px] text-muted">{resultMeta(r)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
