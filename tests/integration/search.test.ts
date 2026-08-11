// Integración real contra Postgres: búsqueda FTS sobre el contenido del CMS.
// Requiere DATABASE_URL con el seed editorial de Payload aplicado
// (npx tsx src/payload/seed.ts). En CI se ejecuta después del seed editorial.
import { afterAll, describe, expect, it } from 'vitest'
import { db } from '@/lib/db'
import { search, logSearch } from '@/features/search/service'

const TEST_QUERY_PREFIX = 'test-integracion-'

afterAll(async () => {
  await db.searchQuery.deleteMany({ where: { query: { startsWith: TEST_QUERY_PREFIX } } })
  await db.$disconnect()
})

describe('search (FTS spanish + unaccent)', () => {
  it('encuentra un vídeo por palabra del título', async () => {
    const results = await search('burofax')
    expect(results.some((r) => r.slug === 'cuando-enviar-un-burofax')).toBe(true)
  })

  it('encuentra sin acentos: "prescripcion" → "prescripción"', async () => {
    const results = await search('prescripcion')
    expect(results.some((r) => r.slug === 'guia-plazos-prescripcion-deuda')).toBe(true)
  })

  it('devuelve cursos y contenidos mezclados por relevancia', async () => {
    const results = await search('impagado')
    expect(results.some((r) => r.kind === 'course')).toBe(true)
    expect(results.some((r) => r.kind === 'content')).toBe(true)
  })

  it('un match de título puntúa más que uno de descripción', async () => {
    const results = await search('burofax')
    const first = results[0]
    expect(first?.title.toLowerCase()).toContain('burofax')
  })

  it('fallback subcadena para términos parciales: "buro"', async () => {
    const results = await search('buro')
    expect(results.some((r) => r.slug === 'cuando-enviar-un-burofax')).toBe(true)
  })

  it('sin resultados para un término inexistente', async () => {
    expect(await search('zxqwv987inexistente')).toEqual([])
  })

  it('consultas de menos de 2 caracteres no buscan', async () => {
    expect(await search('a')).toEqual([])
    expect(await search('  ')).toEqual([])
  })

  it('la sintaxis rara del usuario no rompe la consulta', async () => {
    // websearch_to_tsquery tolera comillas, operadores y símbolos sueltos
    await expect(search('"factura vencida" -pagada')).resolves.toBeDefined()
    await expect(search("'; drop table users; --")).resolves.toBeDefined()
    await expect(search('&|!():*')).resolves.toBeDefined()
  })
})

describe('logSearch', () => {
  it('registra la búsqueda con su número de resultados', async () => {
    const q = `${TEST_QUERY_PREFIX}burofax`
    await logSearch(null, q, 3)
    const row = await db.searchQuery.findFirst({ where: { query: q } })
    expect(row).not.toBeNull()
    expect(row?.resultsCount).toBe(3)
    expect(row?.userId).toBeNull()
  })

  it('ignora consultas demasiado cortas', async () => {
    await logSearch(null, 'a', 0)
    const row = await db.searchQuery.findFirst({ where: { query: 'a' } })
    expect(row).toBeNull()
  })
})
