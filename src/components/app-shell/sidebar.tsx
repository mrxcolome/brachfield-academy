'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_NAV, NEW_NAV_ITEM } from '@/features/navigation'
import { BrandLogo } from '@/components/brand/logo'
import { cn } from '@/lib/cn'

export function Sidebar({ showAdmin = false }: { showAdmin?: boolean }) {
  const pathname = usePathname()
  // Modo concentración (petición del propietario 10/09): dentro de la Sala
  // de profesores el menú lateral desaparece para centrarse en el contenido.
  // La vuelta es el «← Volver a la academia» de la cabecera de la Sala.
  if (pathname.startsWith('/app/sala')) return null
  return (
    <aside className="sticky top-0 hidden h-screen w-55 flex-none flex-col overflow-y-auto border-r border-border-soft bg-surface px-3.5 py-6 lg:flex">
      <Link
        href="/app"
        className="block px-2.5 pb-6 no-underline"
        aria-label="Brachfield Academy — inicio"
      >
        <BrandLogo height={23} />
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
        <Link
          href={NEW_NAV_ITEM.href}
          aria-current={pathname.startsWith(NEW_NAV_ITEM.href) ? 'page' : undefined}
          className={cn(
            'mt-4 flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] font-semibold no-underline',
            pathname.startsWith(NEW_NAV_ITEM.href)
              ? 'bg-accent-soft text-accent'
              : 'text-accent hover:bg-accent-soft/60',
          )}
        >
          <span aria-hidden className="w-4 text-center text-accent">
            {NEW_NAV_ITEM.glyph}
          </span>
          {NEW_NAV_ITEM.label}
        </Link>
      </nav>
      {/* La Sala vive abajo del todo, separada de la navegación del alumno
          (petición del propietario 10/09) */}
      {showAdmin && (
        <nav aria-label="Zona de editores" className="mt-auto pt-8">
          <Link
            href="/app/sala"
            aria-current={pathname.startsWith('/app/admin') ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] no-underline',
              // Administración cuelga de la Sala: la entrada queda marcada también allí
              pathname.startsWith('/app/admin')
                ? 'font-semibold text-brand'
                : 'font-medium text-ink-2 hover:text-ink',
            )}
          >
            <span aria-hidden className="w-4 text-center">
              ✎
            </span>
            Sala de profesores
          </Link>
        </nav>
      )}
    </aside>
  )
}
