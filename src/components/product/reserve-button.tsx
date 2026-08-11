'use client'

import { useState, useTransition } from 'react'
import { reserveEventAction, cancelEventAction } from '@/features/events/actions'
import { cn } from '@/lib/cn'

export function ReserveButton({
  eventSlug,
  initialReserved,
  full,
}: {
  eventSlug: string
  initialReserved: boolean
  full: boolean
}) {
  const [reserved, setReserved] = useState(initialReserved)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function toggle() {
    setError(null)
    const target = !reserved
    setReserved(target)
    startTransition(async () => {
      const res = target
        ? await reserveEventAction({ eventSlug })
        : await cancelEventAction({ eventSlug })
      if (res.error) {
        setReserved(!target)
        setError(res.error)
      }
    })
  }

  if (full && !reserved) {
    return (
      <span className="inline-flex items-center rounded-full border border-border-chip bg-bg px-4 py-2 text-[13px] font-semibold text-muted">
        Aforo completo
      </span>
    )
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={cn(
          'rounded-full px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60',
          reserved
            ? 'border border-border-chip bg-surface text-ink-2 hover:bg-bg'
            : 'bg-brand text-white hover:bg-brand-hover',
        )}
      >
        {reserved ? 'Cancelar mi plaza' : 'Reservar plaza'}
      </button>
      {reserved && !error && (
        <span className="font-mono text-[11px] text-success">✓ Plaza reservada</span>
      )}
      {error && (
        <span role="alert" className="text-[12px] text-danger">
          {error}
        </span>
      )}
    </span>
  )
}
