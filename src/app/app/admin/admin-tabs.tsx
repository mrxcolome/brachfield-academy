'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const TABS = [
  { href: '/app/admin', label: 'Resumen' },
  { href: '/app/admin/users', label: 'Alumnos' },
  { href: '/app/admin/editors', label: 'Editores' },
  { href: '/app/admin/questions', label: 'Preguntas' },
  { href: '/app/admin/events', label: 'Eventos' },
] as const

export function AdminTabs() {
  const pathname = usePathname()
  return (
    <nav aria-label="Secciones de administración" className="mb-6 flex flex-wrap gap-2">
      {TABS.map((tab) => {
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
