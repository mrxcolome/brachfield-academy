import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { openCustomerPortal } from '@/features/billing/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = { title: 'Mi suscripción' }

const STATUS_LABEL: Record<string, { label: string; variant: 'success' | 'new' | 'outline' }> = {
  ACTIVE: { label: 'ACTIVA', variant: 'success' },
  TRIALING: { label: 'PRUEBA', variant: 'success' },
  PAST_DUE: { label: 'PAGO PENDIENTE', variant: 'new' },
  CANCELED: { label: 'CANCELADA', variant: 'outline' },
  INCOMPLETE: { label: 'INCOMPLETA', variant: 'outline' },
  EXPIRED: { label: 'CADUCADA', variant: 'outline' },
}

export default async function BillingPage() {
  const user = await requireUser()
  const subscription = await db.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  const dateFmt = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'Europe/Madrid' })

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">Mi suscripción</h1>

      {!subscription ? (
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="mb-4 text-sm text-muted">Aún no tienes una suscripción activa.</p>
          <Link href="/checkout" className="text-sm font-semibold">
            Suscribirse →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-6">
            <div>
              <p className="text-[13px] font-semibold text-brand-link">Plan Profesional</p>
              <p className="mt-1 text-xl font-bold">39 €/mes</p>
              <p className="mt-1.5 font-mono text-xs text-muted">
                {subscription.status === 'CANCELED'
                  ? `Finalizó el ${dateFmt.format(subscription.currentPeriodEnd)}`
                  : subscription.cancelAtPeriodEnd
                    ? `Se cancelará el ${dateFmt.format(subscription.currentPeriodEnd)}`
                    : `Próxima renovación: ${dateFmt.format(subscription.currentPeriodEnd)}`}
              </p>
            </div>
            <Badge variant={STATUS_LABEL[subscription.status]?.variant ?? 'outline'}>
              {STATUS_LABEL[subscription.status]?.label ?? subscription.status}
            </Badge>
          </div>

          {subscription.status === 'PAST_DUE' && (
            <div className="rounded-lg border border-accent bg-surface p-4 text-[13.5px] leading-relaxed">
              No hemos podido procesar tu último pago. Actualiza tu tarjeta para no perder el acceso
              — lo reintentamos automáticamente.
            </div>
          )}

          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="mb-1 text-sm font-semibold">Tarjeta, facturas y cancelación</p>
            <p className="mb-4 text-[13px] leading-relaxed text-muted">
              La gestión de pagos se hace en el portal seguro de Stripe: cambiar tarjeta, descargar
              facturas, cancelar o reactivar.
            </p>
            <form action={openCustomerPortal}>
              <Button type="submit" variant="outline">
                Abrir portal de pagos
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
