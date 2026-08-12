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

/**
 * Progreso de VARIOS cursos con UNA sola consulta (evita el N+1 de
 * /app/learning, briefing §11). Devuelve un Map por id de curso.
 */
export async function getCoursesProgress(
  userId: string,
  courses: Course[],
): Promise<Map<string, CourseProgress>> {
  if (courses.length === 0) return new Map()
  const rows = await db.userProgress.findMany({
    where: { userId, courseId: { in: courses.map((c) => String(c.id)) } },
    select: { contentId: true, status: true, courseId: true },
  })
  type Row = (typeof rows)[number]
  const byCourse = new Map<string, Row[]>()
  for (const row of rows) {
    if (!row.courseId) continue
    const list = byCourse.get(row.courseId) ?? []
    list.push(row)
    byCourse.set(row.courseId, list)
  }
  return new Map(
    courses.map((course) => [
      String(course.id),
      computeCourseProgress(
        flattenLessons(course).map((l) => l.id),
        byCourse.get(String(course.id)) ?? [],
      ),
    ]),
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
