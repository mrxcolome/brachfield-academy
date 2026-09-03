'use client'

// Subida directa a Cloudflare Stream (tus): el archivo viaja del navegador
// a Cloudflare por trozos reanudables; nuestra API solo firma la creación.
import { useRef, useState } from 'react'
import * as tus from 'tus-js-client'
import { estadoVideo } from '@/features/sala/actions'

export function VideoUpload({
  onReady,
}: {
  onReady: (streamId: string, duration: string | null) => void
}) {
  const [state, setState] = useState<'idle' | 'uploading' | 'processing' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function pollUntilReady(uid: string, attempt = 0) {
    void estadoVideo(uid).then((res) => {
      if (res.ready) {
        onReady(uid, res.duration ?? null)
        setState('idle')
        setProgress(0)
        return
      }
      if (attempt > 60) {
        // ~5 min: el vídeo sigue procesándose — dejamos el ID puesto igualmente
        onReady(uid, null)
        setState('idle')
        return
      }
      setTimeout(() => pollUntilReady(uid, attempt + 1), 5000)
    })
  }

  function onFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setState('uploading')
    setProgress(0)
    let uid: string | null = null
    const upload = new tus.Upload(file, {
      endpoint: '/api/sala/stream-upload',
      chunkSize: 50 * 1024 * 1024,
      retryDelays: [0, 3000, 8000, 15000],
      metadata: { name: file.name },
      onAfterResponse(_req, res) {
        const id = res.getHeader('stream-media-id')
        if (id) uid = id
      },
      onProgress(sent, total) {
        setProgress(Math.round((sent / total) * 100))
      },
      onError(err) {
        console.error('[sala] subida de vídeo falló', err)
        setError(
          'La subida ha fallado. Revisa la conexión y vuelve a intentarlo — se reanuda sola.',
        )
        setState('error')
      },
      onSuccess() {
        if (!uid) {
          setError('El vídeo subió pero no recibimos su código. Prueba de nuevo.')
          setState('error')
          return
        }
        setState('processing')
        pollUntilReady(uid)
      },
    })
    upload.start()
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {state === 'idle' && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-sm border border-dashed border-border-input px-4 py-3 text-[13px] font-semibold text-ink-2 hover:border-brand-link hover:text-ink"
        >
          ⬆ Subir vídeo (se encarga la Sala de llevarlo a Cloudflare)
        </button>
      )}
      {state === 'uploading' && (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-border-soft">
            <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-[12.5px] text-muted">Subiendo… {progress}%</p>
        </div>
      )}
      {state === 'processing' && (
        <p className="text-[12.5px] text-muted">
          Vídeo subido ✓ — Cloudflare lo está procesando (uno o dos minutos)…
        </p>
      )}
      {state === 'error' && (
        <p role="alert" className="text-[12.5px] text-danger">
          {error}{' '}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => {
              setState('idle')
              setError(null)
            }}
          >
            Reintentar
          </button>
        </p>
      )}
    </div>
  )
}
