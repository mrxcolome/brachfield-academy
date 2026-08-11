import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { requireActiveMember } from '@/features/auth/guards'
import { getContentBySlug, CONTENT_TYPE_META, LEVEL_META } from '@/features/content/service'
import { isFavorited } from '@/features/favorites/service'
import type { Content, Category } from '@/payload/payload-types'
import { FavoriteButton } from '@/components/product/favorite-button'
import { ContentCard } from '@/components/product/content-card'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const content = await getContentBySlug(slug)
  if (!content) return { title: 'Contenido' }
  return {
    title: content.seo?.title ?? content.title,
    description: content.seo?.description ?? content.excerpt ?? undefined,
  }
}

const PLAYER_TYPES: Content['contentType'][] = ['VIDEO', 'WEBINAR']
const AUDIO_TYPES: Content['contentType'][] = ['AUDIO']
const DOWNLOAD_TYPES: Content['contentType'][] = ['PDF', 'GUIDE', 'CHECKLIST', 'TEMPLATE', 'TOOL']

/** Texto del primer párrafo del body (para no repetir el excerpt si son iguales). */
function firstParagraphText(body: Content['body']): string {
  const first = body?.root.children?.[0]
  if (!first || first.type !== 'paragraph') return ''
  const children = first.children
  if (!Array.isArray(children)) return ''
  return children
    .map((c) => (typeof c === 'object' && c !== null && 'text' in c ? String(c.text) : ''))
    .join('')
    .trim()
}

export default async function ContentPage({ params }: Props) {
  const { user } = await requireActiveMember()
  const { slug } = await params
  const content = await getContentBySlug(slug)
  if (!content) notFound()

  const meta = CONTENT_TYPE_META[content.contentType]
  const favorited = await isFavorited(user.id, String(content.id))

  // depth:1 resuelve las relaciones a objetos; los ids sueltos se descartan
  const categories = (content.categories ?? []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  const related = (content.relatedContent ?? []).filter(
    (c): c is Content => typeof c === 'object' && c !== null && c._status === 'published',
  )

  const isPlayer = PLAYER_TYPES.includes(content.contentType)
  const isAudio = AUDIO_TYPES.includes(content.contentType)
  const isDownload = DOWNLOAD_TYPES.includes(content.contentType)

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-3 text-[13px]">
        <Link href="/app/library" className="text-brand-link no-underline hover:underline">
          ← Biblioteca
        </Link>
      </p>

      {/* Player / cabecera según formato */}
      {(isPlayer || isAudio) && (
        <div
          className={
            isPlayer
              ? 'mb-5 flex aspect-video items-center justify-center rounded-xl bg-player text-center'
              : 'mb-5 flex items-center justify-center rounded-xl bg-player px-6 py-10 text-center'
          }
        >
          <div>
            <p aria-hidden className="mb-2 text-3xl text-on-dark-muted">
              {isPlayer ? '▶' : '◑'}
            </p>
            <p className="font-mono text-xs text-on-dark-muted">
              {isPlayer ? 'REPRODUCTOR DE VÍDEO' : 'REPRODUCTOR DE AUDIO'}
            </p>
            <p className="mt-1 px-6 text-[11.5px] text-on-dark-muted">
              Se activará al conectar Cloudflare Stream
            </p>
          </div>
        </div>
      )}

      <p className="mb-1.5 font-mono text-[11px] tracking-wide text-muted uppercase">
        {meta.label}
        {content.duration ? ` · ${content.duration}` : ''}
        {content.level ? ` · ${LEVEL_META[content.level]}` : ''}
      </p>
      <h1 className="mb-1 text-2xl leading-tight font-bold">{content.title}</h1>
      {content.subtitle && <p className="mb-3 text-[15px] text-ink-2">{content.subtitle}</p>}

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <FavoriteButton contentSlug={content.slug} initialFavorited={favorited} />
        {isDownload && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-border-chip bg-bg px-3.5 py-2 text-[13px] font-semibold text-muted"
            title="Disponible muy pronto"
          >
            <span aria-hidden>↓</span> Descarga — se activará muy pronto
          </span>
        )}
        {categories.map((cat) => (
          <Badge key={cat.id} variant="outline">
            <Link href={`/app/library?categoria=${cat.slug}`} className="text-inherit no-underline">
              {cat.name}
            </Link>
          </Badge>
        ))}
      </div>

      {content.excerpt && content.excerpt.trim() !== firstParagraphText(content.body) && (
        <p className="mb-6 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-2">
          {content.excerpt}
        </p>
      )}

      {content.body && (
        <div className="prose-sm mb-8 max-w-2xl text-sm leading-relaxed text-ink-2 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-ink [&_li]:mb-1 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
          <RichText data={content.body} />
        </div>
      )}

      {(content.transcript?.length ?? 0) > 0 && (
        <section className="mb-8 max-w-2xl">
          <h2 className="mb-2 text-[13px] font-semibold text-ink-2">En este contenido</h2>
          <div className="flex flex-col">
            {content.transcript!.map((t) => (
              <p key={t.id} className="flex gap-3 py-1.5 text-[13px]">
                <span className="font-mono text-brand-link">
                  {Math.floor(t.ts / 60)}:{String(Math.floor(t.ts % 60)).padStart(2, '0')}
                </span>
                <span className="text-ink-2">{t.text}</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-border-soft pt-6">
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Relacionado</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 3).map((c) => (
              <ContentCard key={c.id} content={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
