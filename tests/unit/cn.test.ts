import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('une clases y descarta valores falsy', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })
  it('devuelve cadena vacía sin argumentos', () => {
    expect(cn()).toBe('')
  })
})
