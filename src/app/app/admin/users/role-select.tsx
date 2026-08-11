'use client'

import { useState, useTransition } from 'react'
import { updateUserRole } from '@/features/admin/actions'

const ROLES = ['MEMBER', 'EDITOR', 'ADMIN'] as const

export function RoleSelect({ userId, initialRole }: { userId: string; initialRole: string }) {
  const [role, setRole] = useState(initialRole)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function change(next: string) {
    setError(null)
    const prev = role
    setRole(next)
    startTransition(async () => {
      const res = await updateUserRole({ userId, role: next })
      if (res.error) {
        setRole(prev)
        setError(res.error)
      }
    })
  }

  // COMPANY_ADMIN está reservado (sin lógica): se muestra pero no se ofrece
  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return <span className="font-mono text-[11.5px] text-muted">{role}</span>
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <label className="sr-only" htmlFor={`role-${userId}`}>
        Rol del usuario
      </label>
      <select
        id={`role-${userId}`}
        value={role}
        disabled={pending}
        onChange={(e) => change(e.target.value)}
        className="rounded-sm border border-border-input bg-surface px-2 py-1 font-mono text-[11.5px] disabled:opacity-60"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="text-[11px] text-danger">
          {error}
        </span>
      )}
    </span>
  )
}
