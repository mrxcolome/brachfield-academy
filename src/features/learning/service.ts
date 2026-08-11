import 'server-only'
import { db } from '@/lib/db'
import { cms } from '@/lib/cms'
import { flattenLessons } from '@/features/content/service'
import { computeCourseProgress, type CourseProgress } from './progress'
import type { Course } from '@/payload/payload-types'

export async function getCourseProgress(userId: string, course: Course): Promise<CourseProgress> {
  const rows = await db.userProgress.findMany({
    where: { userId, courseId: String(course.id) },
    select: { contentId: true, status: true },
  })
  return computeCourseProgress(
    flattenLessons(course).map((l) => l.id),
    rows,
  )
}

export interface ContinueLearning {
  courseSlug: string
  courseTitle: string
  lessonId: string
  lessonTitle: string
  pct: number
}

/** "Continúa donde lo dejaste": última actividad con curso aún incompleto. */
export async function getContinueLearning(userId: string): Promise<ContinueLearning | null> {
  const recent = await db.userProgress.findMany({
    where: { userId, courseId: { not: null } },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: { courseId: true },
  })
  const courseIds = [...new Set(recent.map((r) => r.courseId).filter((c): c is string => !!c))]
  if (courseIds.length === 0) return null

  const payload = await cms()
  for (const courseId of courseIds) {
    const numericId = Number(courseId)
    if (!Number.isFinite(numericId)) continue
    const course = await payload
      .findByID({ collection: 'courses', id: numericId, depth: 0 })
      .catch(() => null)
    if (!course || course._status !== 'published') continue

    const progress = await getCourseProgress(userId, course)
    if (!progress.nextLessonId || progress.total === 0) continue // curso terminado

    const next = flattenLessons(course).find((l) => l.id === progress.nextLessonId)
    if (!next) continue
    return {
      courseSlug: course.slug,
      courseTitle: course.title,
      lessonId: next.id,
      lessonTitle: next.title,
      pct: progress.pct,
    }
  }
  return null
}
