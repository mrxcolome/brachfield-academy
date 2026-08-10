import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { processStripeEvent } from '@/features/billing/webhooks'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get('stripe-signature')
  if (!secret || !signature) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 400 })
  }

  let event
  try {
    const body = await req.text()
    event = await stripe().webhooks.constructEventAsync(body, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  try {
    const result = await processStripeEvent(event)
    return NextResponse.json({ received: true, result })
  } catch (e) {
    // 500 → Stripe reintenta; el registro en stripe_event guarda el error.
    console.error(`[stripe-webhook] ${event.type} ${event.id}:`, e)
    return NextResponse.json({ error: 'Error procesando el evento' }, { status: 500 })
  }
}
