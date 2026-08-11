import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import { getFavoriteContents, getFavoriteTypes } from '@/features/favorites/service'
import { CONTENT_TYPE_META } from '@/features/content/service'
import type { Content } from '@/payload/payload-types'
import { ContentCard } from '@/components/product/content-card'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/cn'

export const metadata = { title: 'Favoritos' }

interface Props {
  searchParams: Promise<{ tipo?: string }>
}

export default async function FavoritesPage({ searchParams }: Props) {
  const { user } = await requireActiveMember()
  const params = await searchParams
  const type =
    params.tipo && params.tipo in CONTENT_TYPE_META
      ? (params.tipo as Content['contentType'])
      : undefined

  const [items, types] = await Promise.all([
    getFavoriteContents(user.id, type),
    getFavoriteTypes(user.id),
  ])

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Favoritos</h1>
      <p className="mb-6 text-sm text-muted">
        Lo que has guardado para volver cuando lo necesites.
      </p>

      {types.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por formato">
          <Link
            href="/app/favorites"
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
          {types.map((t) => {
            const label =
              t in CONTENT_TYPE_META ? CONTENT_TYPE_META[t as Content['contentType']].label : t
            const active = type === t
            return (
              <Link
                key={t}
                href={active ? '/app/favorites' : `/app/favorites?tipo=${t}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold no-underline',
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
                )}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon="♡"
          title={type ? 'No hay favoritos de este formato' : 'Aún no has guardado nada'}
          description={
            type
              ? 'Prueba con otro filtro o quítalo para ver todos tus favoritos.'
              : 'Cuando encuentres un contenido que quieras tener a mano, pulsa «Guardar» y aparecerá aquí.'
          }
          action={
            <Link
              href={type ? '/app/favorites' : '/app/library'}
              className="rounded-sm bg-brand px-4 py-2 text-[13px] font-semibold text-white no-underline hover:bg-brand-hover"
            >
              {type ? 'Quitar filtro' : 'Ir a la Biblioteca'}
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ content }) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </div>
  )
}
