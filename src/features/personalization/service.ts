// Personalización (Fase 13): recomendaciones del dashboard y "nuevo esta
// semana", leyendo de Payload y aplicando las reglas puras de rules.ts.
import { cms } from '@/lib/cms'
import { db } from '@/lib/db'
import { flattenLessons } from '@/features/content/service'
import { rankItems, type ProfileInput } from './rules'
import type { Content, Course, Category, Tag } from '@/payload/payload-types'

function names(rel: (number | Category)[] | (number | Tag)[] | null | undefined): string[] {
  return (rel ?? [])
    .map((r) => (typeof r === 'object' && r !== null ? r.name : null))
    .filter((n): n is string => n !== null)
}

export interface RecommendedCourse {
  kind: 'course'
  course: Course
}
export interface RecommendedContent {
  kind: 'content'
  content: Content
}
export type Recommendation = RecommendedCourse | RecommendedContent

/**
 * Recomendaciones del dashboard: 1 curso afín sin terminar + los contenidos
 * mejor puntuados. Los cursos completados y el curso "en curso" (que ya tiene
 * su propio bloque) no se recomiendan.
 */
export async function getRecommendations(
  userId: string,
  profile: ProfileInput,
  opts: { excludeCourseSlug?: string; limit?: number } = {},
): Promise<Recommendation[]> {
  const limit = opts.limit ?? 3
  const payload = await cms()

  const [coursesRes, contentsRes, completedRows] = await Promise.all([
    // depth 1: las categorías tienen que llegar como objetos con nombre
    // (con depth 0 serían ids y todo puntuaría 0)
    payload.find({
      collection: 'courses',
      where: { _status: { equals: 'published' } },
      limit: 50,
      depth: 1,
    }),
    payload.find({
      collection: 'contents',
      where: { _status: { equals: 'published' } },
      limit: 60,
      depth: 1,
      sort: '-publishedAt',
    }),
    db.userProgress.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { courseId: true, contentId: true },
    }),
  ])

  const completedByCourse = new Map<string, number>()
  for (const row of completedRows) {
    if (row.courseId) {
      completedByCourse.set(row.courseId, (completedByCourse.get(row.courseId) ?? 0) + 1)
    }
  }

  // Cursos candidatos: publicados, no completados, no el que está en curso
  const candidateCourses = coursesRes.docs.filter((course) => {
    if (course.slug === opts.excludeCourseSlug) return false
    const total = flattenLessons(course).length
    const done = completedByCourse.get(String(course.id)) ?? 0
    return total === 0 || done < total
  })

  const rankedCourses = rankItems(
    candidateCourses.map((course) => ({
      course,
      categories: names(course.categories),
      tags: names(course.tags),
      level: course.level ?? null,
      publishedAt: course.publishedAt ?? null,
    })),
    profile,
  )

  const rankedContents = rankItems(
    contentsRes.docs.map((content) => ({
      content,
      categories: names(content.categories),
      tags: names(content.tags),
      level: content.level ?? null,
      publishedAt: content.publishedAt ?? null,
    })),
    profile,
  )

  const out: Recommendation[] = []
  const topCourse = rankedCourses[0]
  if (topCourse) out.push({ kind: 'course', course: topCourse.course })
  for (const rc of rankedContents) {
    if (out.length >= limit) break
    out.push({ kind: 'content', content: rc.content })
  }
  return out.slice(0, limit)
}

/** Contenidos publicados en los últimos 7 días (briefing: "nuevo esta semana"). */
export async function getNewThisWeek(limit = 4): Promise<Content[]> {
  const payload = await cms()
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const res = await payload.find({
    collection: 'contents',
    where: {
      and: [{ _status: { equals: 'published' } }, { publishedAt: { greater_than: weekAgo } }],
    },
    sort: '-publishedAt',
    limit,
    depth: 0,
  })
  return res.docs
}
