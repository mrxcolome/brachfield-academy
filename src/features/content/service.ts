import 'server-only'
import { cache } from 'react'
import { cms } from '@/lib/cms'
import type { Where } from 'payload'
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

// cache(): dedupe por petición — generateMetadata y la página comparten la consulta
export const getCourseBySlug = cache(async (slug: string): Promise<Course | null> => {
  const payload = await cms()
  const res = await payload.find({
    collection: 'courses',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
  })
  return res.docs[0] ?? null
})

// ───────────────────── Contenidos (no-curso) ─────────────────────
import type { Content, Category } from '@/payload/payload-types'

export type CmsContent = Content

export interface ContentFilters {
  type?: Content['contentType']
  categorySlug?: string
  level?: Content['level']
  limit?: number
}

export async function getPublishedContents(filters: ContentFilters = {}): Promise<Content[]> {
  const payload = await cms()
  const and: Where[] = [{ _status: { equals: 'published' } }]
  if (filters.type) and.push({ contentType: { equals: filters.type } })
  if (filters.level) and.push({ level: { equals: filters.level } })
  if (filters.categorySlug) {
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: filters.categorySlug } },
      limit: 1,
    })
    const id = cat.docs[0]?.id
    if (id == null) return []
    and.push({ categories: { contains: id } })
  }
  const res = await payload.find({
    collection: 'contents',
    where: { and },
    sort: '-publishedAt',
    limit: filters.limit ?? 60,
    depth: 0,
  })
  return res.docs
}

export const getContentBySlug = cache(async (slug: string): Promise<Content | null> => {
  const payload = await cms()
  const res = await payload.find({
    collection: 'contents',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1, // resuelve relatedContent y categorías
  })
  return res.docs[0] ?? null
})

export async function getFeaturedContents(limit = 4): Promise<Content[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'contents',
    where: { and: [{ _status: { equals: 'published' } }, { featured: { equals: true } }] },
    sort: '-publishedAt',
    limit,
    depth: 0,
  })
  return res.docs
}

/** Contenidos publicados por id (para Favoritos: los ids vienen de la BD, no del cliente). */
export async function getContentsByIds(ids: number[]): Promise<Content[]> {
  if (ids.length === 0) return []
  const payload = await cms()
  const res = await payload.find({
    collection: 'contents',
    where: { and: [{ _status: { equals: 'published' } }, { id: { in: ids } }] },
    limit: ids.length,
    depth: 0,
  })
  return res.docs
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await cms()
  const res = await payload.find({ collection: 'categories', sort: 'name', limit: 50 })
  return res.docs
})

// ───────────── Presentación compartida de formatos ─────────────

export const CONTENT_TYPE_META: Record<
  Content['contentType'],
  {
    label: string
    glyph: string
    kind: 'video' | 'podcast' | 'articulo' | 'guia' | 'checklist' | 'plantilla' | 'webinar' | 'caso'
  }
> = {
  VIDEO: { label: 'Vídeo', glyph: '▶', kind: 'video' },
  AUDIO: { label: 'Podcast', glyph: '◑', kind: 'podcast' },
  ARTICLE: { label: 'Artículo', glyph: '▤', kind: 'articulo' },
  PDF: { label: 'PDF', glyph: '↓', kind: 'guia' },
  GUIDE: { label: 'Guía', glyph: '▤', kind: 'guia' },
  CHECKLIST: { label: 'Checklist', glyph: '✓', kind: 'checklist' },
  TEMPLATE: { label: 'Plantilla', glyph: '▦', kind: 'plantilla' },
  WEBINAR: { label: 'Webinar', glyph: '◉', kind: 'webinar' },
  CASE_STUDY: { label: 'Caso práctico', glyph: '▣', kind: 'caso' },
  NEWS: { label: 'Actualidad', glyph: '◈', kind: 'articulo' },
  TOOL: { label: 'Herramienta', glyph: '▦', kind: 'plantilla' },
}

export const LEVEL_META: Record<NonNullable<Content['level']>, string> = {
  BEGINNER: 'Inicial',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
}
