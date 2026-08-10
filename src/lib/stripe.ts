import 'server-only'
import Stripe from 'stripe'

let client: Stripe | null = null

/** Cliente Stripe lazy: no explota en build si la clave aún no existe. */
export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY no configurada')
  client ??= new Stripe(key)
  return client
}
