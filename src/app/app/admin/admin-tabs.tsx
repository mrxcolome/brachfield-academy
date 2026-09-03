'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const TABS = [
  { href: '/app/admin', label: 'Resumen' },
  { href: '/app/admin/users', label: 'Alumnos', adminOnly: true },
  { href: '/app/admin/editors', label: 'Editores', adminOnly: true },
  { href: '/app/admin/questions', label: 'Preguntas' },
  { href: '/app/admin/events', label: 'Eventos' },
] as const

export function AdminTabs({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const tabs = TABS.filter((tab) => isAdmin || !('adminOnly' in tab))
  return (
    <nav aria-label="Secciones de administración" className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold no-underline',
              active
                ? 'border-brand bg-brand text-white'
                : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
