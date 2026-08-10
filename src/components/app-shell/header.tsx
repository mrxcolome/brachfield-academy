import Link from 'next/link'
import { UserMenu } from './user-menu'

export function Header({ userName, unreadCount }: { userName: string; unreadCount: number }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border-soft bg-surface px-4 py-3 sm:px-7">
      <Link href="/app" className="text-sm font-bold text-ink no-underline lg:hidden">
        B<span className="text-brand-link">A</span>
      </Link>
      <form action="/app/search" className="max-w-lg flex-1">
        <label htmlFor="global-search" className="sr-only">
          Buscar en la Academia
        </label>
        <input
          id="global-search"
          name="q"
          type="search"
          placeholder="¿Qué necesitas resolver hoy?"
          className="w-full rounded-full border border-border-chip bg-surface px-4.5 py-2.5 text-[13.5px] placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </form>
      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/app/notifications"
          aria-label={
            unreadCount > 0 ? `Notificaciones: ${unreadCount} sin leer` : 'Notificaciones'
          }
          className="relative rounded-full p-1.5 text-lg text-ink-2 no-underline hover:bg-bg"
        >
          <span aria-hidden>🔔</span>
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-bold text-accent-ink"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <UserMenu userName={userName} />
      </div>
    </header>
  )
}
