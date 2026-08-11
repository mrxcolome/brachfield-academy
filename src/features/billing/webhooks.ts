// Procesado idempotente de webhooks de Stripe (briefing §37).
// 1) La firma se verifica en la route (necesita el body crudo).
// 2) Aquí: registrar evento (unique stripeEventId) → si ya existía, saltar.
// 3) Procesar y marcar processedAt; si falla, guardar error para reproceso.
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { paymentFailedEmail } from '@/emails/templates'
import { linkCustomer, syncSubscription } from './service'
import { track } from '@/features/analytics/service'
import { Prisma } from '@/generated/prisma/client'

export const HANDLED_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
] as const

export type ProcessResult = 'processed' | 'duplicate' | 'ignored'

export async function processStripeEvent(event: Stripe.Event): Promise<ProcessResult> {
  if (!(HANDLED_EVENTS as readonly string[]).includes(event.type)) return 'ignored'

  // Idempotencia: reclamar el eventId; si ya existe, es un reenvío.
  try {
    await db.stripeEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        payload: event as unknown as Prisma.InputJsonValue,
      },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return 'duplicate'
    }
    throw e
  }

  try {
    await handle(event)
    await db.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processedAt: new Date(), error: null },
    })
    return 'processed'
  } catch (e) {
    await db.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { error: e instanceof Error ? e.message : String(e) },
    })
    throw e
  }
}

async function handle(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.client_reference_id
      const customerId = typeof session.customer === 'string' ? session.customer : null
      if (userId && customerId) await linkCustomer(userId, customerId)
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      await syncSubscription(event.data.object)
      break
    }
    case 'invoice.paid':
      // La fila de subscription la actualiza customer.subscription.updated;
      // el evento queda registrado en stripe_event como auditoría.
      break
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null
      if (!customerId) break
      const user = await db.user.findUnique({ where: { stripeCustomerId: customerId } })
      if (!user) break
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM',
          title: 'Problema con tu pago',
          message:
            'No hemos podido procesar el último cobro. Revisa tu tarjeta en "Mi suscripción" para no perder el acceso.',
          url: '/app/account/billing',
        },
      })
      await sendEmail(
        user.email,
        paymentFailedEmail(user.name, 'entra en la Academia → Mi suscripción'),
      )
      track('payment_failed', { userId: user.id })
      break
    }
  }
}
