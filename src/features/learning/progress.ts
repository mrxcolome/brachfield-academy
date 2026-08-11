// Cálculo de progreso de curso (briefing §16): completadas / total.
// Puro: no toca BD — testeable sin infraestructura.

export interface ProgressRow {
  contentId: string
  status: 'IN_PROGRESS' | 'COMPLETED'
}

export interface CourseProgress {
  total: number
  completed: number
  pct: number
  /** Primera lección no completada (para "Empezar/Continuar") */
  nextLessonId: string | null
}

export function computeCourseProgress(lessonIds: string[], rows: ProgressRow[]): CourseProgress {
  const completedIds = new Set(rows.filter((r) => r.status === 'COMPLETED').map((r) => r.contentId))
  const completed = lessonIds.filter((id) => completedIds.has(id)).length
  const total = lessonIds.length
  const nextLessonId = lessonIds.find((id) => !completedIds.has(id)) ?? null
  return {
    total,
    completed,
    pct: total === 0 ? 0 : Math.round((completed / total) * 100),
    nextLessonId,
  }
}
