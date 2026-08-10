import { describe, expect, it } from 'vitest'
import { hasMemberAccess } from '@/features/billing/access'

describe('hasMemberAccess', () => {
  it('concede acceso con suscripción vigente', () => {
    expect(hasMemberAccess('ACTIVE')).toBe(true)
    expect(hasMemberAccess('TRIALING')).toBe(true)
  })
  it('mantiene acceso durante el dunning (PAST_DUE)', () => {
    expect(hasMemberAccess('PAST_DUE')).toBe(true)
  })
  it('deniega acceso sin suscripción o con estados terminales', () => {
    expect(hasMemberAccess(null)).toBe(false)
    expect(hasMemberAccess(undefined)).toBe(false)
    expect(hasMemberAccess('CANCELED')).toBe(false)
    expect(hasMemberAccess('INCOMPLETE')).toBe(false)
    expect(hasMemberAccess('EXPIRED')).toBe(false)
  })
})
