import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/features/auth/guards'
import { getCategories } from '@/features/content/service'
import { getSalaContent, SALA_CONCEPTS } from '@/features/sala/service'
import { WizardSteps } from '../../steps'
import { ConceptForm } from '../concept-form'
import { MaterialForm } from './material-form'
import { ContentCoverForm } from './content-cover-form'
import { ContentPublishPanel } from './content-publish-panel'

export const metadata = { title: 'Sala de profesores · Pieza' }

const STEPS = ['La pieza', 'El material', 'La portada', 'Publicar'] as const

const TITLES: Record<number, { h: string; sub: string }> = {
  1: { h: 'La pieza', sub: 'El concepto, el título y las dos frases que ve el alumno.' },
  2: { h: 'El material', sub: 'Vídeo, texto, archivo descargable o audio — y pueden combinarse.' },
  3: { h: 'La portada', sub: 'Opcional: sin portada propia, entra la automática del concepto.' },
  4: { h: 'Revisar y publicar', sub: 'Un último vistazo antes de abrirla a los alumnos.' },
}

export default async function SalaContenidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ paso?: string }>
}) {
  await requireRole('ADMIN', 'EDITOR')
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)
  if (!Number.isFinite(id)) notFound()
  const piece = await getSalaContent(id)
  if (!piece) notFound()

  const { paso: rawPaso } = await searchParams
  const paso = Math.min(4, Math.max(1, Number.parseInt(rawPaso ?? '1', 10) || 1))
  const meta = TITLES[paso]!
  const concept = SALA_CONCEPTS.find((c) => c.value === piece.conceptType)
  const hasMaterial = Boolean(
    piece.streamId || piece.text.trim() || piece.audioName || piece.documentName,
  )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <Link href="/app/sala" className="text-[13px] text-brand-link">
          ← Sala de profesores
        </Link>
        <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
          {concept?.label ?? 'Pieza'} ·{' '}
          {piece.status === 'published' ? 'Publicada' : 'Borrador — invisible para los alumnos'}
        </span>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <WizardSteps
          labels={STEPS}
          current={paso}
          href={(n) => `/app/sala/contenido/${piece.id}?paso=${n}`}
        />
        <h1 className="mb-1 text-xl font-bold">{meta.h}</h1>
        <p className="mb-6 text-sm text-muted">{meta.sub}</p>

        {paso === 1 && (
          <ConceptForm
            categories={(await getCategories()).map((c) => ({ id: Number(c.id), name: c.name }))}
            piece={{
              id: piece.id,
              title: piece.title,
              excerpt: piece.excerpt,
              categoryId: piece.categoryId,
              conceptType: piece.conceptType,
              level: piece.level,
            }}
          />
        )}

        {paso === 2 && <MaterialForm piece={piece} />}

        {paso === 3 && <ContentCoverForm pieceId={piece.id} coverUrl={piece.coverUrl} />}

        {paso === 4 && (
          <>
            <ul className="mb-6 flex flex-col gap-2 text-sm">
              <li>
                <span aria-hidden className="mr-2 font-bold text-success">
                  ✓
                </span>
                <strong>{piece.title}</strong>{' '}
                <span className="text-muted">({concept?.label ?? piece.conceptType})</span>
              </li>
              <li>
                <span
                  aria-hidden
                  className={`mr-2 font-bold ${piece.excerpt.trim() ? 'text-success' : 'text-danger'}`}
                >
                  {piece.excerpt.trim() ? '✓' : '✕'}
                </span>
                {piece.excerpt.trim()
                  ? 'Resumen para la tarjeta'
                  : 'Faltan las dos frases (paso 1)'}
              </li>
              <li>
                <span
                  aria-hidden
                  className={`mr-2 font-bold ${piece.categoryId ? 'text-success' : 'text-danger'}`}
                >
                  {piece.categoryId ? '✓' : '✕'}
                </span>
                Área de conocimiento {piece.categoryId ? 'asignada' : 'pendiente (paso 1)'}
              </li>
              <li>
                <span
                  aria-hidden
                  className={`mr-2 font-bold ${hasMaterial ? 'text-success' : 'text-danger'}`}
                >
                  {hasMaterial ? '✓' : '✕'}
                </span>
                Material:{' '}
                {[
                  piece.streamId && 'vídeo',
                  piece.text.trim() && 'texto',
                  piece.documentName && 'archivo',
                  piece.audioName && 'audio',
                ]
                  .filter(Boolean)
                  .join(' + ') || 'pendiente (paso 2)'}
              </li>
              <li>
                <span aria-hidden className="mr-2 font-bold text-success">
                  ✓
                </span>
                Portada {piece.coverUrl ? 'propia' : 'automática del concepto'}
              </li>
            </ul>
            <ContentPublishPanel pieceId={piece.id} status={piece.status} slug={piece.slug} />
          </>
        )}
      </div>
    </div>
  )
}
