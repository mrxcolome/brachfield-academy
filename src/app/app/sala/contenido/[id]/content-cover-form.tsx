'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  crearPortadasIA,
  estadoPortadasIA,
  subirArchivoContenido,
  usarPortadaIA,
} from '@/features/sala/actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

type Proposal = { task: string; status: 'pending' | 'done' | 'failed'; url?: string }

/** Propuestas de portada con IA: encarga dos, consulta cada 4 s y deja elegir una. */
function AiCover({ pieceId, onUsed }: { pieceId: number; onUsed: () => void }) {
  const [indicaciones, setIndicaciones] = useState('')
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [using, setUsing] = useState<string | null>(null)
  const waiting = proposals.some((p) => p.status === 'pending')

  useEffect(() => {
    if (!waiting) return
    const timer = setInterval(async () => {
      const states = await estadoPortadasIA(proposals.map((p) => p.task))
      if (states.length) setProposals(states)
    }, 4000)
    return () => clearInterval(timer)
  }, [waiting, proposals])

  function create() {
    setError(null)
    startTransition(async () => {
      const res = await crearPortadasIA({ id: pieceId, indicaciones })
      if (res.error || !res.tasks) return setError(res.error ?? 'No se pudo encargar')
      setProposals(res.tasks.map((task) => ({ task, status: 'pending' })))
    })
  }

  function use(url: string) {
    setError(null)
    setUsing(url)
    startTransition(async () => {
      const res = await usarPortadaIA({ id: pieceId, url })
      setUsing(null)
      if (res.error) return setError(res.error)
      onUsed()
    })
  }

  const busy = pending || waiting
  const allFailed = proposals.length > 0 && proposals.every((p) => p.status === 'failed')

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-ink-3">
        La IA lee el título, el resumen y el texto de la pieza y crea dos fotos de portada en el
        estilo de la academia, sin textos ni logotipos. Tarda alrededor de un minuto.
      </p>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-semibold">Indicaciones (opcional)</span>
        <input
          value={indicaciones}
          onChange={(e) => setIndicaciones(e.target.value)}
          placeholder="ej. una reunión en un almacén, tonos más luminosos…"
          maxLength={500}
          className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-2"
        />
      </label>

      {proposals.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {proposals.map((p) => (
            <div key={p.task} className="overflow-hidden rounded-lg border border-border">
              {p.status === 'done' && p.url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt="Propuesta de portada"
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-2.5">
                    <Button type="button" size="sm" disabled={pending} onClick={() => use(p.url!)}>
                      {using === p.url ? 'Guardando…' : 'Usar esta'}
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  className={cn(
                    'flex aspect-video items-center justify-center bg-bg text-center text-[13px]',
                    p.status === 'failed' ? 'text-danger' : 'animate-pulse text-muted',
                  )}
                >
                  {p.status === 'failed' ? 'Esta propuesta ha fallado' : 'Creando la imagen…'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <Button type="button" variant="outline" disabled={busy} onClick={create}>
          {busy ? 'Creando…' : proposals.length > 0 ? 'Crear otras dos' : '✦ Crear dos propuestas'}
        </Button>
      </div>
      {allFailed && (
        <p className="text-[13px] text-danger">
          No ha salido ninguna. Vuelve a probar; si se repite, sube una imagen propia.
        </p>
      )}
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContentCoverForm({
  pieceId,
  coverUrl,
  aiAvailable,
}: {
  pieceId: number
  coverUrl: string | null
  aiAvailable: boolean
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'upload' | 'ai' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onFile(file: File | undefined) {
    if (!file) return
    setError(null)
    const fd = new FormData()
    fd.set('id', String(pieceId))
    fd.set('kind', 'cover')
    fd.set('file', file)
    startTransition(async () => {
      const res = await subirArchivoContenido(fd)
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt="Portada actual"
          className="aspect-video w-full max-w-md rounded-lg border border-border object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border-input bg-bg px-4 text-center text-[13px] text-muted">
          Sin portada propia: se usará la foto automática del tipo de pieza. Válido tal cual.
        </div>
      )}

      <div>
        <p className="mb-2 text-[15px] font-semibold">
          {coverUrl ? '¿Quieres cambiarla?' : '¿Cómo quieres la portada?'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setMode('upload')
              inputRef.current?.click()
            }}
            className={cn(
              'flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors',
              mode === 'upload'
                ? 'border-brand bg-brand-soft'
                : 'border-border-chip bg-surface hover:border-brand-link hover:bg-bg',
            )}
          >
            <span className="text-sm font-bold text-brand">
              ⬆ {pending ? 'Subiendo…' : 'Subir una imagen'}
            </span>
            <span className="text-[12px] text-muted">
              Apaisada (16:9), mínimo 800 px de ancho, máximo 4 MB.
            </span>
          </button>
          {aiAvailable && (
            <button
              type="button"
              onClick={() => setMode('ai')}
              aria-pressed={mode === 'ai'}
              className={cn(
                'flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors',
                mode === 'ai'
                  ? 'border-brand bg-brand-soft'
                  : 'border-border-chip bg-surface hover:border-brand-link hover:bg-bg',
              )}
            >
              <span className="text-sm font-bold text-brand">✦ Crearla con IA</span>
              <span className="text-[12px] text-muted">
                A partir del contenido de la pieza, en el estilo de la academia.
              </span>
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {mode === 'ai' && (
        <AiCover
          pieceId={pieceId}
          onUsed={() => {
            setMode(null)
            router.refresh()
          }}
        />
      )}

      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
      <div className="border-t border-border-soft pt-4">
        <Link
          href={`/app/sala/contenido/${pieceId}?paso=4`}
          className="rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
        >
          Revisar y publicar →
        </Link>
      </div>
    </div>
  )
}
