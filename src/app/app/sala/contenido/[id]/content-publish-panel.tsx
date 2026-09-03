'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { despublicarContenido, publicarContenido } from '@/features/sala/actions'
import { Button } from '@/components/ui/button'

export function ContentPublishPanel({
  pieceId,
  status,
  slug,
}: {
  pieceId: number
  status: 'draft' | 'published'
  slug: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function run(fn: () => Promise<{ error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {status === 'published' ? (
        <>
          <p className="text-sm text-success">
            ✓ Esta pieza está <strong>publicada</strong>: los alumnos ya la ven en la Biblioteca.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/app/contents/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-border-input px-4 py-2.5 text-[13px] font-semibold text-ink no-underline hover:bg-bg"
            >
              Verla como alumno ↗
            </a>
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => run(() => despublicarContenido(pieceId))}
            >
              {pending ? 'Un momento…' : 'Retirar a borrador'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-ink-2">
            Al publicar, la pieza aparece al instante en la Biblioteca (y en Herramientas si lleva
            descarga). Podrás seguir editándola cuando quieras.
          </p>
          <Button
            type="button"
            size="lg"
            disabled={pending}
            onClick={() => run(() => publicarContenido(pieceId))}
          >
            {pending ? 'Publicando…' : 'Publicar'}
          </Button>
        </>
      )}
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
