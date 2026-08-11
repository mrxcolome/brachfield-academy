import { describe, expect, it } from 'vitest'
import { computeCourseProgress } from '@/features/learning/progress'

const LESSONS = ['l1', 'l2', 'l3', 'l4']

describe('computeCourseProgress', () => {
  it('curso sin empezar', () => {
    const p = computeCourseProgress(LESSONS, [])
    expect(p).toEqual({ total: 4, completed: 0, pct: 0, nextLessonId: 'l1' })
  })

  it('progreso parcial apunta a la primera lección pendiente', () => {
    const p = computeCourseProgress(LESSONS, [
      { contentId: 'l1', status: 'COMPLETED' },
      { contentId: 'l3', status: 'COMPLETED' },
    ])
    expect(p.completed).toBe(2)
    expect(p.pct).toBe(50)
    expect(p.nextLessonId).toBe('l2')
  })

  it('curso completado no tiene siguiente', () => {
    const p = computeCourseProgress(
      LESSONS,
      LESSONS.map((id) => ({ contentId: id, status: 'COMPLETED' as const })),
    )
    expect(p.pct).toBe(100)
    expect(p.nextLessonId).toBeNull()
  })

  it('ignora filas IN_PROGRESS y de otros cursos', () => {
    const p = computeCourseProgress(LESSONS, [
      { contentId: 'l1', status: 'IN_PROGRESS' },
      { contentId: 'otra-leccion', status: 'COMPLETED' },
    ])
    expect(p.completed).toBe(0)
  })

  it('curso vacío no divide por cero', () => {
    expect(computeCourseProgress([], []).pct).toBe(0)
  })
})
