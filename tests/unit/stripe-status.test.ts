import { describe, expect, it } from 'vitest'
import { mapStripeStatus } from '@/features/billing/service'

describe('mapStripeStatus', () => {
  it('mapea los estados de Stripe a los del dominio', () => {
    expect(mapStripeStatus('active')).toBe('ACTIVE')
    expect(mapStripeStatus('trialing')).toBe('TRIALING')
    expect(mapStripeStatus('past_due')).toBe('PAST_DUE')
    expect(mapStripeStatus('canceled')).toBe('CANCELED')
    expect(mapStripeStatus('incomplete')).toBe('INCOMPLETE')
    expect(mapStripeStatus('incomplete_expired')).toBe('INCOMPLETE')
    expect(mapStripeStatus('unpaid')).toBe('EXPIRED')
    expect(mapStripeStatus('paused')).toBe('EXPIRED')
  })
})
