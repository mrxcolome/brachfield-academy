import type { Metadata } from 'next'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { Sidebar } from '@/components/app-shell/sidebar'
import { MobileNav } from '@/components/app-shell/mobile-nav'
import { Header } from '@/components/app-shell/header'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const [unreadCount, dbUser] = await Promise.all([
    db.notification.count({ where: { userId: user.id, read: false } }),
    db.user.findUnique({ where: { id: user.id }, select: { role: true } }),
  ])
  const showAdmin = dbUser?.role === 'ADMIN' || dbUser?.role === 'EDITOR'

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar showAdmin={showAdmin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header userName={user.name} unreadCount={unreadCount} />
        <main className="flex-1 px-4 py-6 pb-24 sm:px-7 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
