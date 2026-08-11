import { describe, expect, it } from 'vitest'
import { formatEventDate, eventDateBlock } from '@/features/events/format'

describe('formatEventDate', () => {
  it('formatea en hora peninsular (UTC+2 en verano)', () => {
    // 17:00 UTC del 21 de agosto de 2026 = 19:00 en Madrid (CEST)
    const out = formatEventDate('2026-08-21T17:00:00.000Z')
    expect(out).toContain('21 de agosto')
    expect(out).toContain('19:00')
    expect(out).toContain('hora peninsular')
  })

  it('formatea en hora peninsular (UTC+1 en invierno)', () => {
    const out = formatEventDate('2026-12-10T17:00:00.000Z')
    expect(out).toContain('10 de diciembre')
    expect(out).toContain('18:00')
  })
})

describe('eventDateBlock', () => {
  it('devuelve día y mes abreviado en mayúsculas', () => {
    const block = eventDateBlock('2026-08-21T17:00:00.000Z')
    expect(block.day).toBe('21')
    expect(block.month).toBe('AGO')
  })

  it('respeta el cambio de día por zona horaria', () => {
    // 23:30 UTC del 21 = 01:30 del 22 en Madrid (verano)
    const block = eventDateBlock('2026-08-21T23:30:00.000Z')
    expect(block.day).toBe('22')
  })
})
