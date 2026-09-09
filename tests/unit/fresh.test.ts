import { describe, expect, it } from 'vitest'
import { isNew } from '@/features/content/fresh'

const now = new Date('2026-09-09T12:00:00Z')

describe('isNew', () => {
  it('marca como nueva una pieza publicada hace días', () => {
    expect(isNew('2026-09-07T10:00:00Z', now)).toBe(true)
  })
  it('marca como nueva justo dentro de la ventana de 30 días', () => {
    expect(isNew('2026-08-11T12:00:00Z', now)).toBe(true)
  })
  it('no marca una pieza de hace más de 30 días', () => {
    expect(isNew('2026-08-01T12:00:00Z', now)).toBe(false)
  })
  it('no marca fechas futuras, vacías o inválidas', () => {
    expect(isNew('2026-09-10T12:00:00Z', now)).toBe(false)
    expect(isNew(null, now)).toBe(false)
    expect(isNew(undefined, now)).toBe(false)
    expect(isNew('no-es-fecha', now)).toBe(false)
  })
})
