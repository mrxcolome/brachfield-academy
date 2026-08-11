import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import { getTools, getDownloadCounts } from '@/features/tools/service'
import { CONTENT_TYPE_META } from '@/features/content/service'
import type { Media } from '@/payload/payload-types'
import { DownloadButton } from '@/components/product/download-button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Herramientas' }

export default async function ToolsPage() {
  await requireActiveMember()
  const tools = await getTools()
  const counts = await getDownloadCounts(tools.map((t) => String(t.id)))

  // La más descargada, destacada arriba (si hay datos de uso)
  const sorted = [...tools].sort(
    (a, b) => (counts.get(String(b.id)) ?? 0) - (counts.get(String(a.id)) ?? 0),
  )
  const top = (counts.get(String(sorted[0]?.id)) ?? 0) > 0 ? sorted[0] : null

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold">Herramientas</h1>
      <p className="mb-7 text-sm text-muted">
        Plantillas, checklists y documentos listos para usar en tu trabajo de hoy.
      </p>

      {tools.length === 0 ? (
        <EmptyState
          icon="▦"
          title="Aún no hay herramientas publicadas"
          description="El equipo editorial está preparando las primeras plantillas y checklists."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {tools.map((tool) => {
            const meta = CONTENT_TYPE_META[tool.contentType]
            const hasFile = typeof tool.documentFile === 'object' && tool.documentFile !== null
            const file = hasFile ? (tool.documentFile as Media) : null
            const downloads = counts.get(String(tool.id)) ?? 0
            return (
              <article key={tool.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{meta.label}</Badge>
                  {top?.id === tool.id && <Badge variant="new">La más usada</Badge>}
                </div>
                <h2 className="mb-1 text-[15px] leading-snug font-semibold">
                  <Link
                    href={`/app/contents/${tool.slug}`}
                    className="text-inherit no-underline hover:text-brand"
                  >
                    {tool.title}
                  </Link>
                </h2>
                {tool.excerpt && (
                  <p className="mb-3 text-[13px] leading-relaxed text-ink-2">{tool.excerpt}</p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {hasFile ? (
                    <DownloadButton contentSlug={tool.slug} />
                  ) : (
                    <Link
                      href={`/app/contents/${tool.slug}`}
                      className="rounded-full border border-border-chip bg-surface px-4 py-2 text-[13px] font-semibold text-ink-2 no-underline hover:bg-bg"
                    >
                      Ver contenido
                    </Link>
                  )}
                  <span className="font-mono text-[11px] text-muted">
                    {file?.filename ? `${file.filename} · ` : ''}
                    {downloads > 0
                      ? `${downloads} ${downloads === 1 ? 'descarga' : 'descargas'}`
                      : ''}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
