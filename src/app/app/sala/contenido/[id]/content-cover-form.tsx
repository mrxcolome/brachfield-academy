'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { subirArchivoContenido } from '@/features/sala/actions'
import { Button } from '@/components/ui/button'

export function ContentCoverForm({
  pieceId,
  coverUrl,
}: {
  pieceId: number
  coverUrl: string | null
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
    fd.set('kind', 'cover')
    fd.set('file', file)
    startTransition(async () => {
      const res = await subirArchivoContenido(fd)
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt="Portada actual"
          className="aspect-video w-full max-w-md rounded-lg border border-border object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border-input bg-bg text-center text-[13px] text-muted">
          Sin portada propia: se usará la foto
          <br />
          automática del concepto elegido. Válido tal cual.
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? 'Subiendo…' : coverUrl ? 'Cambiar la portada' : 'Subir una portada'}
        </Button>
        <Link
          href={`/app/sala/contenido/${pieceId}?paso=4`}
          className="rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
        >
          Revisar y publicar →
        </Link>
      </div>
      <p className="text-[12.5px] text-muted">
        Ideal 16:9 (apaisada), mínimo 800 px de ancho, máximo 4 MB.
      </p>
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
