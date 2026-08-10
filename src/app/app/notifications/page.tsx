import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { markAllNotificationsRead } from '@/features/notifications/actions'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/cn'

export const metadata = { title: 'Notificaciones' }

export default async function NotificationsPage() {
  const user = await requireUser()
  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  const hasUnread = notifications.some((n) => !n.read)
  const dateFmt = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  })

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        {hasUnread && (
          <form action={markAllNotificationsRead}>
            <Button type="submit" variant="ghost" size="sm">
              Marcar todo como leído
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="Nada por aquí todavía"
          description="Te avisaremos cuando haya contenido nuevo, eventos o novedades de tu suscripción."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {notifications.map((n) => (
            <article
              key={n.id}
              className={cn(
                'rounded-lg border bg-surface p-4',
                n.read ? 'border-border-faint' : 'border-brand-soft bg-brand-soft/40',
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{n.title}</p>
                <time className="font-mono text-[11px] whitespace-nowrap text-muted">
                  {dateFmt.format(n.createdAt)}
                </time>
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-3">{n.message}</p>
              {n.url && (
                <Link href={n.url} className="mt-2 inline-block text-[13px] font-semibold">
                  Ver →
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
