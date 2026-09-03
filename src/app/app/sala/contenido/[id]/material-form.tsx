'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { guardarMaterial, subirArchivoContenido } from '@/features/sala/actions'
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

export function MaterialForm({ piece }: { piece: SalaContent }) {
  const router = useRouter()
  const [streamId, setStreamId] = useState(piece.streamId ?? '')
  const [duration, setDuration] = useState(piece.duration ?? '')
  const [text, setText] = useState(piece.text)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function save(goNext: boolean) {
    setError(null)
    startTransition(async () => {
      const res = await guardarMaterial({ id: piece.id, streamId, duration, text })
      if (res.error) return setError(res.error)
      if (goNext) router.push(`/app/sala/contenido/${piece.id}?paso=3`)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-[12.5px] font-semibold">Vídeo</p>
        {streamId ? (
          <p className="text-[13px]">
            Vídeo conectado ✓ <span className="font-mono text-[11.5px] text-muted">{streamId}</span>{' '}
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="m-text" className="text-[12.5px] font-semibold">
          Texto de la pieza
        </label>
        <textarea
          id="m-text"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="El cuerpo de la guía, el caso o la noticia — o el texto de apoyo si la pieza es un vídeo. Párrafos normales."
          className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </div>

      <FileBlock
        pieceId={piece.id}
        kind="document"
        label="Archivo descargable"
        hint="La plantilla Word/Excel, el PDF de la guía o la checklist imprimible. Máximo 4 MB."
        current={piece.documentName}
        accept=".pdf,.doc,.docx,.xls,.xlsx"
      />
      <FileBlock
        pieceId={piece.id}
        kind="audio"
        label="Audio"
        hint="Para piezas en audio (entrevistas, píldoras). Máximo 4 MB por aquí; audios largos, mejor la entrevista en vídeo o subirlo desde el modo experto."
        current={piece.audioName}
        accept="audio/*"
      />

      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3 border-t border-border-soft pt-4">
        <Button type="button" disabled={pending} onClick={() => save(true)}>
          {pending ? 'Guardando…' : 'Guardar y seguir →'}
        </Button>
        <Link
          href={`/app/sala/contenido/${piece.id}?paso=1`}
          className="text-[13px] text-brand-link"
        >
          ← Volver a la pieza
        </Link>
      </div>
      <p className="text-[12.5px] text-muted">
        Una pieza necesita al menos un material (vídeo, texto, audio o archivo) para publicarse —
        pero pueden combinarse: una guía con su PDF, un tutorial con texto de apoyo…
      </p>
    </div>
  )
}
