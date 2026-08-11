import { describe, expect, it } from 'vitest'
import { resolveFavorites } from '@/features/favorites/resolve'

const d = (iso: string) => new Date(iso)

describe('resolveFavorites', () => {
  it('mantiene el orden de guardado de las filas', () => {
    const rows = [
      { contentId: '2', createdAt: d('2026-08-11T10:00:00Z') },
      { contentId: '1', createdAt: d('2026-08-10T10:00:00Z') },
    ]
    const contents = [{ id: 1 }, { id: 2 }]
    const out = resolveFavorites(rows, contents)
    expect(out.map((f) => f.content.id)).toEqual([2, 1])
  })

  it('descarta favoritos cuyo contenido ya no está publicado', () => {
    const rows = [
      { contentId: '9', createdAt: d('2026-08-11T10:00:00Z') },
      { contentId: '1', createdAt: d('2026-08-10T10:00:00Z') },
    ]
    const out = resolveFavorites(rows, [{ id: 1 }])
    expect(out).toHaveLength(1)
    expect(out[0]?.content.id).toBe(1)
  })

  it('lista vacía → resultado vacío', () => {
    expect(resolveFavorites([], [])).toEqual([])
  })

  it('casa ids numéricos del CMS con contentId string de la BD', () => {
    const rows = [{ contentId: '42', createdAt: d('2026-08-11T10:00:00Z') }]
    const out = resolveFavorites(rows, [{ id: 42 }])
    expect(out).toHaveLength(1)
    expect(out[0]?.savedAt.toISOString()).toBe('2026-08-11T10:00:00.000Z')
  })
})
