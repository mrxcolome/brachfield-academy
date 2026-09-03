import { describe, expect, it } from 'vitest'
import { contentCover, courseCover, DEFAULT_COVER_BY_TYPE } from '@/features/content/covers'
import type { Content, Course, Media } from '@/payload/payload-types'

const media = { id: 1, url: '/api/media/file/portada.jpg' } as Media

describe('contentCover', () => {
  it('prioriza la portada subida por el editor', () => {
    expect(contentCover({ id: 1, coverImage: media, contentType: 'TUTORIAL' })).toBe(
      '/api/media/file/portada.jpg',
    )
  })
  it('cae a la foto del formato si no hay portada ni categoría', () => {
    expect(contentCover({ id: 2, coverImage: null, contentType: 'TEMPLATE' })).toBe(
      '/landing/formato-plantillas.webp',
    )
  })
  it('ignora la relación sin resolver (depth 0: id numérico)', () => {
    expect(contentCover({ id: 3, coverImage: 7 as unknown as Media, contentType: 'AUDIO' })).toBe(
      '/landing/formato-podcasts.webp',
    )
  })
  it('cubre los 11 tipos de contenido', () => {
    const types: Content['contentType'][] = [
      'TUTORIAL',
      'PILL',
      'AUDIO',
      'GUIDE',
      'CHECKLIST',
      'TEMPLATE',
      'WEBINAR',
      'CASE_STUDY',
      'NEWS',
    ]
    for (const t of types) expect(DEFAULT_COVER_BY_TYPE[t]).toMatch(/^\/landing\//)
  })
})

describe('courseCover', () => {
  const cat = (name: string) =>
    ({ id: 1, name }) as Course['categories'] extends (infer U)[] | null | undefined ? U : never

  it('prioriza la portada subida', () => {
    expect(courseCover({ id: 1, coverImage: media, categories: [cat('Negociación')] })).toBe(
      '/api/media/file/portada.jpg',
    )
  })
  it('usa la foto del área de su primera categoría conocida', () => {
    expect(
      courseCover({ id: 2, coverImage: null, categories: [cat('Recobro de impagados')] }),
    ).toBe('/landing/area-recobro.webp')
  })
  it('salta categorías sin foto y usa la siguiente', () => {
    expect(
      courseCover({
        id: 2,
        coverImage: null,
        categories: [cat('Clientes morosos'), cat('Legislación')],
      }),
    ).toBe('/landing/area-legislacion.webp')
  })
  it('cae a la genérica de cursos sin categorías resueltas', () => {
    expect(courseCover({ id: 5, coverImage: null, categories: [3, 4] as never })).toBe(
      '/landing/formato-cursos.webp',
    )
  })
})
