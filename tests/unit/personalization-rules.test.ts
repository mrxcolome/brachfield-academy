import { describe, expect, it } from 'vitest'
import { scoreItem, rankItems, type ProfileInput } from '@/features/personalization/rules'

const collections: ProfileInput = {
  professionalProfile: 'COLLECTIONS',
  level: 'INTERMEDIATE',
  interests: ['Mejorar el recobro', 'Mejorar las negociaciones de cobro'],
}

const item = (
  categories: string[],
  level: string | null = null,
  publishedAt: string | null = null,
) => ({
  categories,
  tags: [],
  level,
  publishedAt,
})

describe('scoreItem', () => {
  it('suma perfil (+3), interés (+2) y nivel (+1)', () => {
    // Recobro: categoría afín a COLLECTIONS (+3) y cubre "Mejorar el recobro" (+2)
    const s = scoreItem(item(['Recobro de impagados'], 'INTERMEDIATE'), collections)
    expect(s).toBe(3 + 2 + 1)
  })

  it('un item sin relación puntúa 0', () => {
    expect(scoreItem(item(['Gestión financiera']), collections)).toBe(0)
  })

  it('perfil null usa el mapa OTHER', () => {
    const anon: ProfileInput = { professionalProfile: null, level: null, interests: [] }
    expect(scoreItem(item(['Credit Management']), anon)).toBe(3)
  })

  it('intereses desconocidos no rompen ni puntúan', () => {
    const p: ProfileInput = { ...collections, interests: ['algo inventado'] }
    expect(scoreItem(item(['Recobro de impagados']), p)).toBe(3)
  })
})

describe('rankItems', () => {
  it('ordena por puntuación y desempata por fecha reciente', () => {
    const items = [
      { id: 'viejo-affin', ...item(['Negociación'], null, '2026-01-01') },
      { id: 'nuevo-affin', ...item(['Negociación'], null, '2026-08-01') },
      { id: 'irrelevante', ...item(['Gestión financiera'], null, '2026-08-10') },
    ]
    const ranked = rankItems(items, collections)
    expect(ranked.map((r) => r.id)).toEqual(['nuevo-affin', 'viejo-affin', 'irrelevante'])
  })
})
