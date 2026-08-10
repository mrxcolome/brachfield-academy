'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

function appUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${base}${path}`
}

/** Crea la sesión de Stripe Checkout (suscripción) y redirige a Stripe. */
export async function startCheckout(): Promise<never> {
  const user = await requireUser()
  const priceId = process.env.STRIPE_PRICE_ID_PROFESIONAL_MONTHLY
  if (!priceId) throw new Error('STRIPE_PRICE_ID_PROFESIONAL_MONTHLY no configurado')

  const dbUser = await db.user.findUniqueOrThrow({ where: { id: user.id } })

  const session = await stripe().checkout.sessions.create({
    mode: 'subscription',
    client_reference_id: user.id,
    customer: dbUser.stripeCustomerId ?? undefined,
    customer_email: dbUser.stripeCustomerId ? undefined : user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    locale: 'es',
    allow_promotion_codes: true,
    success_url: appUrl('/checkout/success'),
    cancel_url: appUrl('/checkout'),
  })

  redirect(session.url!)
}

/** Abre el Stripe Customer Portal (tarjeta, facturas, cancelar). */
export async function openCustomerPortal(): Promise<never> {
  const user = await requireUser()
  const dbUser = await db.user.findUniqueOrThrow({ where: { id: user.id } })
  if (!dbUser.stripeCustomerId) redirect('/checkout')

  const session = await stripe().billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: appUrl('/app/account/billing'),
  })

  redirect(session.url)
}
