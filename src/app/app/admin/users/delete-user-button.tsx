'use client'

import { useState, useTransition } from 'react'
import { deleteUser } from '@/features/admin/actions'

export function DeleteUserButton({ userId, label }: { userId: string; label: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onClick() {
    setError(null)
    const ok = window.confirm(
      `¿Eliminar a ${label}?\n\nSe borrará su cuenta con todo su progreso, favoritos y reservas. Esta acción no se puede deshacer.`,
    )
    if (!ok) return
    startTransition(async () => {
      const res = await deleteUser({ userId })
      if (res.error) setError(res.error)
    })
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-sm border border-border-input px-2 py-1 font-mono text-[11.5px] text-danger hover:border-danger disabled:opacity-60"
      >
        {pending ? 'Eliminando…' : 'Eliminar'}
      </button>
      {error && (
        <span role="alert" className="max-w-40 text-[11px] text-danger">
          {error}
        </span>
      )}
    </span>
  )
}
