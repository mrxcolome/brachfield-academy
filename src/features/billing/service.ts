// Sincronización Stripe → BD local. El acceso premium SIEMPRE se decide
// contra la tabla subscription (briefing §36), nunca contra Stripe en vivo.
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { track } from '@/features/analytics/service'
import type { SubscriptionStatus } from '@/generated/prisma/enums'

export function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
      return 'ACTIVE'
    case 'trialing':
      return 'TRIALING'
    case 'past_due':
      return 'PAST_DUE'
    case 'canceled':
      return 'CANCELED'
    case 'incomplete':
    case 'incomplete_expired':
      return 'INCOMPLETE'
    case 'unpaid':
    case 'paused':
    default:
      return 'EXPIRED'
  }
}

/** Fin de periodo: en la API actual vive en los items; fallback al campo legacy. */
function periodEnd(sub: Stripe.Subscription): Date {
  const fromItem = sub.items?.data?.[0]?.current_period_end
  const legacy = (sub as unknown as { current_period_end?: number }).current_period_end
  const ts = fromItem ?? legacy
  return ts ? new Date(ts * 1000) : new Date()
}

/** Crea/actualiza la fila local a partir del objeto subscription de Stripe. */
export async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const user = await db.user.findUnique({ where: { stripeCustomerId: customerId } })
  if (!user) {
    throw new Error(`Suscripción ${sub.id}: ningún usuario con stripeCustomerId=${customerId}`)
  }

  const status = mapStripeStatus(sub.status)

  // Transiciones de estado → eventos de producto (antes del upsert)
  const previous = await db.subscription.findUnique({
    where: { stripeSubscriptionId: sub.id },
    select: { status: true },
  })
  if (status === 'ACTIVE' && previous?.status !== 'ACTIVE') {
    track('subscription_activated', { userId: user.id })
  }
  if (status === 'CANCELED' && previous && previous.status !== 'CANCELED') {
    track('subscription_canceled', { userId: user.id })
  }

  await db.subscription.upsert({
    where: { stripeSubscriptionId: sub.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: sub.id,
      status,
      plan: sub.items?.data?.[0]?.price?.id ?? 'profesional-mensual',
      currentPeriodEnd: periodEnd(sub),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
    update: {
      status,
      currentPeriodEnd: periodEnd(sub),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    },
  })
}

/** Vincula el customer de Stripe al usuario tras completar el checkout. */
export async function linkCustomer(userId: string, customerId: string): Promise<void> {
  await db.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } })
}
