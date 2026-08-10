import { describe, expect, it } from 'vitest'
import { recommendedCourses } from '@/features/onboarding/recommendations'

describe('recommendedCourses', () => {
  it('recomienda cursos legales a un abogado', () => {
    const recs = recommendedCourses('LAWYER')
    expect(recs[0]?.slug).toBe('marco-legal-de-la-morosidad-comercial')
    expect(recs).toHaveLength(3)
  })
  it('recomienda recobro a cobros', () => {
    expect(recommendedCourses('COLLECTIONS')[0]?.slug).toBe(
      'como-recuperar-un-impagado-paso-a-paso',
    )
  })
  it('tiene fallback sin perfil', () => {
    expect(recommendedCourses(null)).toHaveLength(3)
  })
})
