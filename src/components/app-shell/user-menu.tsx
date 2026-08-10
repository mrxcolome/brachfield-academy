'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function UserMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function logout() {
    await authClient.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menú de usuario"
        className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
      >
        {initials}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-surface py-1.5 shadow-lg"
        >
          <p className="border-b border-border-faint px-4 py-2 text-[13px] font-semibold">
            {userName}
          </p>
          <Link
            role="menuitem"
            href="/app/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13.5px] text-ink-2 no-underline hover:bg-bg"
          >
            Mi perfil
          </Link>
          <Link
            role="menuitem"
            href="/app/account/billing"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[13.5px] text-ink-2 no-underline hover:bg-bg"
          >
            Mi suscripción
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={logout}
            className="block w-full px-4 py-2.5 text-left text-[13.5px] text-danger hover:bg-bg"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
