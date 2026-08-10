'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOBILE_NAV } from '@/features/navigation'
import { cn } from '@/lib/cn'

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-soft bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {MOBILE_NAV.map((item) => {
        const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] no-underline',
              active ? 'font-bold text-brand' : 'font-medium text-muted-2',
            )}
          >
            <span aria-hidden className="text-base leading-none">
              {item.glyph}
            </span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
