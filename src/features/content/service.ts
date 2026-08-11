import 'server-only'
import { cms } from '@/lib/cms'
import type { Course } from '@/payload/payload-types'

export type CmsCourse = Course

export interface CourseLesson {
  id: string
  title: string
  lessonType: 'video' | 'audio' | 'text' | 'document'
  duration: string | null
  moduleName: string
}

/** Lecciones de un curso aplanadas y en orden (módulo a módulo). */
export function flattenLessons(course: Course): CourseLesson[] {
  return (course.modules ?? []).flatMap((m) =>
    (m.lessons ?? []).map((l) => ({
      id: l.id ?? '',
      title: l.title,
      lessonType: l.lessonType ?? 'video',
      duration: l.duration ?? null,
      moduleName: m.name,
    })),
  )
}

export async function getPublishedCourses(): Promise<Course[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'courses',
    where: { _status: { equals: 'published' } },
    sort: 'title',
    limit: 50,
    depth: 0,
  })
  return res.docs
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'courses',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ?? null
}
