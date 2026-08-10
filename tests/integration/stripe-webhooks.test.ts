// Integración real contra Postgres: procesado de webhooks + idempotencia.
// Requiere DATABASE_URL (local en sandbox, service container en CI).
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { processStripeEvent } from '@/features/billing/webhooks'

const EMAIL = 'webhook-test@integration.brachfieldacademy.test'
const CUSTOMER = 'cus_test_integration'
const SUB_ID = 'sub_test_integration'

function subscriptionEvent(
  id: string,
  type: Stripe.Event['type'],
  status: Stripe.Subscription.Status,
  overrides: Record<string, unknown> = {},
): Stripe.Event {
  return {
    id,
    type,
    data: {
      object: {
        object: 'subscription',
        id: SUB_ID,
        customer: CUSTOMER,
        status,
        cancel_at_period_end: false,
        canceled_at: null,
        items: {
          data: [
            {
              price: { id: 'price_profesional_test' },
              current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
            },
          ],
        },
        ...overrides,
      },
    },
  } as unknown as Stripe.Event
}

let userId: string

beforeAll(async () => {
  await db.user.deleteMany({ where: { email: EMAIL } })
  await db.stripeEvent.deleteMany({ where: { stripeEventId: { startsWith: 'evt_test_' } } })
  const user = await db.user.create({
    data: { name: 'Test Webhook', email: EMAIL, stripeCustomerId: CUSTOMER },
  })
  userId = user.id
})

afterAll(async () => {
  await db.user.deleteMany({ where: { email: EMAIL } })
  await db.stripeEvent.deleteMany({ where: { stripeEventId: { startsWith: 'evt_test_' } } })
  await db.$disconnect()
})

describe('processStripeEvent', () => {
  it('crea la suscripción local al recibir subscription.created', async () => {
    const result = await processStripeEvent(
      subscriptionEvent('evt_test_1', 'customer.subscription.created', 'active'),
    )
    expect(result).toBe('processed')

    const sub = await db.subscription.findUnique({ where: { stripeSubscriptionId: SUB_ID } })
    expect(sub?.status).toBe('ACTIVE')
    expect(sub?.userId).toBe(userId)
    expect(sub?.plan).toBe('price_profesional_test')
  })

  it('es idempotente: el mismo evento dos veces solo se procesa una', async () => {
    const event = subscriptionEvent('evt_test_2', 'customer.subscription.updated', 'past_due')
    expect(await processStripeEvent(event)).toBe('processed')
    expect(await processStripeEvent(event)).toBe('duplicate')

    const subs = await db.subscription.findMany({ where: { stripeSubscriptionId: SUB_ID } })
    expect(subs).toHaveLength(1)
    expect(subs[0]?.status).toBe('PAST_DUE')
  })

  it('marca CANCELED al recibir subscription.deleted', async () => {
    await processStripeEvent(
      subscriptionEvent('evt_test_3', 'customer.subscription.deleted', 'canceled', {
        canceled_at: Math.floor(Date.now() / 1000),
      }),
    )
    const sub = await db.subscription.findUnique({ where: { stripeSubscriptionId: SUB_ID } })
    expect(sub?.status).toBe('CANCELED')
    expect(sub?.canceledAt).not.toBeNull()
  })

  it('invoice.payment_failed crea una notificación para el usuario', async () => {
    const event = {
      id: 'evt_test_4',
      type: 'invoice.payment_failed',
      data: { object: { object: 'invoice', customer: CUSTOMER } },
    } as unknown as Stripe.Event
    expect(await processStripeEvent(event)).toBe('processed')

    const notif = await db.notification.findFirst({ where: { userId, type: 'SYSTEM' } })
    expect(notif?.title).toContain('pago')
  })

  it('ignora eventos no gestionados sin registrarlos', async () => {
    const event = {
      id: 'evt_test_5',
      type: 'payment_intent.created',
      data: { object: {} },
    } as unknown as Stripe.Event
    expect(await processStripeEvent(event)).toBe('ignored')
    const row = await db.stripeEvent.findUnique({ where: { stripeEventId: 'evt_test_5' } })
    expect(row).toBeNull()
  })
})
