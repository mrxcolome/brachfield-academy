import { describe, expect, it } from 'vitest'
import { isWelcomeActive } from '@/features/welcome/rules'

const now = new Date('2026-09-09T12:00:00Z')
const pending = [{ done: true }, { done: false }]
const complete = [{ done: true }, { done: true }]

describe('isWelcomeActive', () => {
  it('activa para un alumno recién llegado con pasos pendientes', () => {
    expect(isWelcomeActive(new Date('2026-09-08T12:00:00Z'), pending, now)).toBe(true)
  })
  it('se retira al completar la checklist', () => {
    expect(isWelcomeActive(new Date('2026-09-08T12:00:00Z'), complete, now)).toBe(false)
  })
  it('se retira a los 14 días aunque queden pasos', () => {
    expect(isWelcomeActive(new Date('2026-08-20T12:00:00Z'), pending, now)).toBe(false)
  })
  it('con checklist vacía (sin vídeo aún) manda solo la ventana de días', () => {
    expect(isWelcomeActive(new Date('2026-09-01T12:00:00Z'), [], now)).toBe(true)
  })
})
