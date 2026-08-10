import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import { courses } from '@/features/content/catalog'
import { Cover } from '@/components/art'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Buscar' }

// Búsqueda PROVISIONAL sobre el catálogo estático. La Fase 10 la sustituye
// por Postgres FTS (títulos, transcripciones, documentos…) vía SearchService.
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  await requireActiveMember()
  const { q = '' } = await searchParams
  const query = q.trim()
  const nq = normalize(query)

  const results = query
    ? courses.filter((c) =>
        [
          c.title,
          c.description,
          ...c.learn,
          ...c.modules.flatMap((m) => [m.name, ...m.lessons]),
        ].some((t) => normalize(t).includes(nq)),
      )
    : []

  return (
    <div className="mx-auto max-w-3xl">
      <form action="/app/search" className="mb-2">
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

      {query && (
        <p className="mb-5 font-mono text-xs text-muted">
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para “{query}”
        </p>
      )}

      {!query ? (
        <EmptyState
          icon="⌕"
          title="¿Qué necesitas resolver hoy?"
          description="Busca entre los cursos y su temario. Pronto también en vídeos, transcripciones, guías y plantillas."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="⌕"
          title={`Sin resultados para “${query}”`}
          description="Prueba con otra palabra: por ejemplo «impagado», «negociación» o «riesgo»."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3.5 text-inherit no-underline"
            >
              <Cover
                title={c.title}
                kind="curso"
                className="rounded-md"
                style={{ width: 96, aspectRatio: '16/10', flex: 'none' }}
                glyph={false}
              />
              <div>
                <p className="mb-1 text-sm font-semibold">{c.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  CURSO · {c.duration} · {c.level}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
