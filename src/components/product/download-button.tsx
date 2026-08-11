'use client'

import { useState, useTransition } from 'react'
import { requestDownload } from '@/features/tools/actions'

export function DownloadButton({
  contentSlug,
  label = 'Descargar',
}: {
  contentSlug: string
  label?: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function download() {
    setError(null)
    startTransition(async () => {
      const res = await requestDownload({ contentSlug })
      if (res.url) {
        // El enlace firmado caduca en minutos: se usa al momento
        window.location.assign(res.url)
      } else {
        setError(res.error ?? 'No se ha podido preparar la descarga.')
      }
    })
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={download}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        <span aria-hidden>↓</span> {pending ? 'Preparando…' : label}
      </button>
      {error && (
        <span role="alert" className="text-[12px] text-danger">
          {error}
        </span>
      )}
    </span>
  )
}
