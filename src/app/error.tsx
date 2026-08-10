'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center">
        <div aria-hidden className="mb-3 text-3xl">
          ⚠️
        </div>
        <h1 className="mb-2 text-xl font-bold">Algo no ha ido bien</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">
          Ha ocurrido un error inesperado. Puedes intentarlo de nuevo; si persiste, vuelve en unos
          minutos.
        </p>
        <Button onClick={reset} block>
          Reintentar
        </Button>
      </div>
    </main>
  )
}
