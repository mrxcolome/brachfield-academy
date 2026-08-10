// Regla única de acceso de membresía (testeada en unit tests).
// PAST_DUE mantiene acceso: Stripe está reintentando el cobro (dunning).
import type { SubscriptionStatus } from '@/generated/prisma/enums'

const ACCESS_GRANTING: ReadonlySet<SubscriptionStatus> = new Set([
  'ACTIVE',
  'TRIALING',
  'PAST_DUE',
] satisfies SubscriptionStatus[])

export function hasMemberAccess(status: SubscriptionStatus | null | undefined): boolean {
  return status != null && ACCESS_GRANTING.has(status)
}
