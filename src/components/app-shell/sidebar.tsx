'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_NAV } from '@/features/navigation'
import { cn } from '@/lib/cn'

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-55 flex-none border-r border-border-soft bg-surface px-3.5 py-6 lg:block">
      <Link href="/app" className="block px-2.5 pb-6 text-[15px] font-bold text-ink no-underline">
        Brachfield <span className="text-brand-link">Academy</span>
      </Link>
      <nav aria-label="Navegación principal" className="flex flex-col gap-0.5">
        {SIDEBAR_NAV.map((item) => {
          const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] no-underline',
                active
                  ? 'bg-brand-soft font-semibold text-brand'
                  : 'font-medium text-ink-2 hover:bg-bg hover:text-ink',
              )}
            >
              <span aria-hidden className="w-4 text-center">
                {item.glyph}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
