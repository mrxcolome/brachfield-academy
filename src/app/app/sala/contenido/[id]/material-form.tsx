'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { elegirFormato, guardarMaterial, subirArchivoContenido } from '@/features/sala/actions'
import { FORMAT_OPTIONS, type ContentFormat } from '@/features/content/format'
import type { SalaContent } from '@/features/sala/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VideoUpload } from '../../video-upload'

function FileBlock({
  pieceId,
  kind,
  label,
  hint,
  current,
  accept,
}: {
  pieceId: number
  kind: 'audio' | 'document'
  label: string
  hint: string
  current: string | null
  accept: string
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onFile(file: File | undefined) {
    if (!file) return
    setError(null)
    const fd = new FormData()
    fd.set('id', String(pieceId))
    fd.set('kind', kind)
    fd.set('file', file)
    startTransition(async () => {
      const res = await subirArchivoContenido(fd)
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[12.5px] font-semibold">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="rounded-sm border border-border-input px-4 py-2 text-[13px] font-semibold text-ink-2 hover:border-brand-link hover:text-ink disabled:opacity-60"
        >
          {pending ? 'Subiendo…' : current ? 'Cambiar archivo' : '⬆ Subir archivo'}
        </button>
        {current && <span className="font-mono text-[11.5px] text-success">✓ {current}</span>}
      </div>
      <p className="text-[12px] text-muted">{hint}</p>
      {error && (
        <p role="alert" className="text-[12.5px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function MaterialForm({
  piece,
  conceptLabel,
}: {
  piece: SalaContent
  conceptLabel: string
}) {
  const router = useRouter()
  const [format, setFormat] = useState<ContentFormat | null>(piece.format)
  const [choosing, setChoosing] = useState(piece.format === null)
  const [streamId, setStreamId] = useState(piece.streamId ?? '')
  const [duration, setDuration] = useState(piece.duration ?? '')
  const [text, setText] = useState(piece.text)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const chosen = FORMAT_OPTIONS.find((f) => f.value === format)

  function pick(next: ContentFormat) {
    setError(null)
    setFormat(next)
    setChoosing(false)
    startTransition(async () => {
      const res = await elegirFormato({ id: piece.id, format: next })
      if (res.error) setError(res.error)
    })
  }

  function save() {
    if (!format) return
    setError(null)
    startTransition(async () => {
      const res = await guardarMaterial({ id: piece.id, format, streamId, duration, text })
      if (res.error) return setError(res.error)
      router.push(`/app/sala/contenido/${piece.id}?paso=3`)
    })
  }

  if (choosing || !chosen) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[15px] font-semibold">
          ¿En qué formato es este {conceptLabel.toLowerCase()}?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => pick(f.value)}
              aria-pressed={format === f.value}
              className={cn(
                'flex flex-col items-start gap-1.5 rounded-lg border p-4 text-left transition-colors',
                format === f.value
                  ? 'border-brand bg-brand-soft'
                  : 'border-border-chip bg-surface hover:border-brand-link hover:bg-bg',
              )}
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-lg text-brand"
              >
                {f.glyph}
              </span>
              <span className="text-sm font-bold text-brand">{f.label}</span>
              <span className="text-[12px] leading-snug text-muted">{f.hint}</span>
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className="text-[13px] text-danger">
            {error}
          </p>
        )}
        <Link
          href={`/app/sala/contenido/${piece.id}?paso=1`}
          className="text-[13px] text-brand-link"
        >
          ← Volver a la pieza
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 rounded-md bg-bg px-4 py-3">
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand"
        >
          {chosen.glyph}
        </span>
        <p className="text-sm">
          Formato: <strong>{chosen.label}</strong>
        </p>
        <button
          type="button"
          onClick={() => setChoosing(true)}
          className="ml-auto text-[13px] font-semibold text-brand-link underline"
        >
          Cambiar formato
        </button>
      </div>

      {format === 'VIDEO' && (
        <div className="flex flex-col gap-2">
          <p className="text-[12.5px] font-semibold">Sube el vídeo</p>
          {streamId ? (
            <p className="text-[13px]">
              Vídeo conectado ✓{' '}
              <span className="font-mono text-[11.5px] text-muted">{streamId}</span>{' '}
              <button
                type="button"
                className="font-semibold text-brand-link underline"
                onClick={() => setStreamId('')}
              >
                cambiar
              </button>
            </p>
          ) : (
            <>
              <VideoUpload
                onReady={(uid, dur) => {
                  setStreamId(uid)
                  if (dur) setDuration(dur)
                }}
              />
              <details className="text-[12.5px] text-muted">
                <summary className="cursor-pointer">¿El vídeo ya está en Cloudflare?</summary>
                <div className="mt-2 max-w-sm">
                  <Input
                    label="Pega su código (UID)"
                    value={streamId}
                    onChange={(e) => setStreamId(e.target.value.trim())}
                  />
                </div>
              </details>
            </>
          )}
          <div className="max-w-45">
            <Input
              label="Duración"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ej. 12 min"
            />
          </div>
        </div>
      )}

      {format === 'TEXT' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="m-text" className="text-[12.5px] font-semibold">
            Escribe el texto
          </label>
          <textarea
            id="m-text"
            rows={14}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Párrafos normales: deja una línea en blanco entre párrafo y párrafo."
            className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
          />
          <div className="mt-2 max-w-45">
            <Input
              label="Tiempo de lectura"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ej. 5 min"
            />
          </div>
        </div>
      )}

      {format === 'AUDIO' && (
        <>
          <FileBlock
            pieceId={piece.id}
            kind="audio"
            label="Sube el audio"
            hint="MP3 o M4A, máximo 4 MB. Para audios más largos, mejor grabarlo en vídeo."
            current={piece.audioName}
            accept="audio/*"
          />
          <div className="max-w-45">
            <Input
              label="Duración"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ej. 8 min"
            />
          </div>
        </>
      )}

      {format === 'DOCUMENT' && (
        <FileBlock
          pieceId={piece.id}
          kind="document"
          label="Sube el documento"
          hint="PDF, Word o Excel, máximo 4 MB. Es lo que el alumno descargará."
          current={piece.documentName}
          accept=".pdf,.doc,.docx,.xls,.xlsx"
        />
      )}

      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3 border-t border-border-soft pt-4">
        <Button type="button" disabled={pending} onClick={save}>
          {pending ? 'Guardando…' : 'Guardar y seguir →'}
        </Button>
        <Link
          href={`/app/sala/contenido/${piece.id}?paso=1`}
          className="text-[13px] text-brand-link"
        >
          ← Volver a la pieza
        </Link>
      </div>
    </div>
  )
}
