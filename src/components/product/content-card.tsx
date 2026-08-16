import Link from 'next/link'
import type { Content } from '@/payload/payload-types'
import { CONTENT_TYPE_META, LEVEL_META } from '@/features/content/service'
import { contentCover } from '@/features/content/covers'
import { SmartCover } from '@/components/product/smart-cover'

/** Card de contenido reutilizada en Explorar, Biblioteca, ficha (relacionados) y Favoritos. */
export function ContentCard({ content }: { content: Content }) {
  const meta = CONTENT_TYPE_META[content.contentType]
  return (
    <Link
      href={`/app/contents/${content.slug}`}
      className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
    >
      <SmartCover
        src={contentCover(content)}
        title={content.title}
        kind={meta.kind}
        style={{ aspectRatio: '16/10' }}
      />
      <div className="p-3.5">
        <p className="mb-1.5 font-mono text-[10.5px] tracking-wide text-muted uppercase">
          {meta.label}
          {content.duration ? ` · ${content.duration}` : ''}
        </p>
        <p className="mb-1 text-[13.5px] leading-snug font-semibold">{content.title}</p>
        {content.excerpt ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted">{content.excerpt}</p>
        ) : null}
        {content.level ? (
          // text-muted y no text-faint: contraste AA (hallazgo del axe de la Fase 16)
          <p className="mt-2 font-mono text-[10.5px] text-muted">{LEVEL_META[content.level]}</p>
        ) : null}
      </div>
    </Link>
  )
}
