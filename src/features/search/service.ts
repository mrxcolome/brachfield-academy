// SearchService (Fase 10): búsqueda a texto completo en Postgres sobre el
// contenido publicado del CMS (schema payload), en español y sin acentos.
// Los tsvector se construyen en tiempo de consulta: con un catálogo de decenas
// de piezas es instantáneo; cuando crezca se añadirá un índice GIN.
import { db } from '@/lib/db'
import type { Content } from '@/payload/payload-types'

export interface SearchResult {
  kind: 'course' | 'content'
  id: number
  slug: string
  title: string
  excerpt: string | null
  contentType: Content['contentType'] | null
  duration: string | null
  level: string | null
  rank: number
}

interface ContentRow {
  id: number
  slug: string
  title: string
  excerpt: string | null
  contentType: Content['contentType']
  duration: string | null
  level: string | null
  rank: number
}

interface CourseRow {
  id: number
  slug: string
  title: string
  description: string | null
  duration: string | null
  level: string | null
  rank: number
}

/**
 * Contenidos por FTS: título (peso A), subtítulo/resumen (B), transcripción (C).
 * websearch_to_tsquery entiende comillas y "-" de exclusión y es seguro ante
 * cualquier input; unaccent en ambos lados hace la búsqueda insensible a acentos.
 */
async function searchContentsFts(query: string, limit: number): Promise<ContentRow[]> {
  return db.$queryRaw<ContentRow[]>`
    WITH tsq AS (SELECT websearch_to_tsquery('spanish', unaccent(${query})) AS q)
    SELECT c.id, c.slug, c.title, c.excerpt,
           c.content_type::text AS "contentType",
           c.duration, c.level::text AS level,
           ts_rank(v.doc, tsq.q)::float8 AS rank
    FROM payload.contents c
    LEFT JOIN LATERAL (
      SELECT string_agg(t.text, ' ') AS transcript
      FROM payload.contents_transcript t
      WHERE t._parent_id = c.id
    ) tr ON true
    CROSS JOIN LATERAL (
      SELECT setweight(to_tsvector('spanish', unaccent(coalesce(c.title, ''))), 'A')
          || setweight(to_tsvector('spanish', unaccent(coalesce(c.subtitle, '') || ' ' || coalesce(c.excerpt, ''))), 'B')
          || setweight(to_tsvector('spanish', unaccent(coalesce(tr.transcript, ''))), 'C') AS doc
    ) v
    CROSS JOIN tsq
    WHERE c._status = 'published' AND v.doc @@ tsq.q
    ORDER BY rank DESC, c.published_at DESC NULLS LAST
    LIMIT ${limit}
  `
}

/** Cursos por FTS: título (A), descripción (B), títulos de lecciones (C). */
async function searchCoursesFts(query: string, limit: number): Promise<CourseRow[]> {
  return db.$queryRaw<CourseRow[]>`
    WITH tsq AS (SELECT websearch_to_tsquery('spanish', unaccent(${query})) AS q)
    SELECT c.id, c.slug, c.title, c.description,
           c.duration, c.level::text AS level,
           ts_rank(v.doc, tsq.q)::float8 AS rank
    FROM payload.courses c
    LEFT JOIN LATERAL (
      SELECT string_agg(l.title, ' ') AS lessons
      FROM payload.courses_modules m
      JOIN payload.courses_modules_lessons l ON l._parent_id = m.id
      WHERE m._parent_id = c.id
    ) ls ON true
    CROSS JOIN LATERAL (
      SELECT setweight(to_tsvector('spanish', unaccent(coalesce(c.title, ''))), 'A')
          || setweight(to_tsvector('spanish', unaccent(coalesce(c.description, ''))), 'B')
          || setweight(to_tsvector('spanish', unaccent(coalesce(ls.lessons, ''))), 'C') AS doc
    ) v
    CROSS JOIN tsq
    WHERE c._status = 'published' AND v.doc @@ tsq.q
    ORDER BY rank DESC, c.published_at DESC NULLS LAST
    LIMIT ${limit}
  `
}

/**
 * Red de seguridad para términos parciales que el FTS no matchea
 * ("buro" → "burofax"): subcadena sin acentos sobre título y resumen.
 */
async function searchContentsLike(query: string, limit: number): Promise<ContentRow[]> {
  return db.$queryRaw<ContentRow[]>`
    SELECT c.id, c.slug, c.title, c.excerpt,
           c.content_type::text AS "contentType",
           c.duration, c.level::text AS level,
           0::float8 AS rank
    FROM payload.contents c
    WHERE c._status = 'published'
      AND unaccent(lower(coalesce(c.title, '') || ' ' || coalesce(c.excerpt, '')))
          LIKE '%' || unaccent(lower(${query})) || '%'
    ORDER BY c.published_at DESC NULLS LAST
    LIMIT ${limit}
  `
}

async function searchCoursesLike(query: string, limit: number): Promise<CourseRow[]> {
  return db.$queryRaw<CourseRow[]>`
    SELECT c.id, c.slug, c.title, c.description,
           c.duration, c.level::text AS level,
           0::float8 AS rank
    FROM payload.courses c
    WHERE c._status = 'published'
      AND unaccent(lower(coalesce(c.title, '') || ' ' || coalesce(c.description, '')))
          LIKE '%' || unaccent(lower(${query})) || '%'
    ORDER BY c.published_at DESC NULLS LAST
    LIMIT ${limit}
  `
}

function toResult(row: ContentRow | CourseRow, kind: 'course' | 'content'): SearchResult {
  return {
    kind,
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: 'excerpt' in row ? row.excerpt : row.description,
    contentType: 'contentType' in row ? row.contentType : null,
    duration: row.duration,
    level: row.level,
    rank: row.rank,
  }
}

/** Búsqueda combinada cursos + contenidos, ordenada por relevancia. */
export async function search(rawQuery: string, limit = 30): Promise<SearchResult[]> {
  const query = rawQuery.trim()
  if (query.length < 2) return []

  let [contents, courses] = await Promise.all([
    searchContentsFts(query, limit),
    searchCoursesFts(query, limit),
  ])

  // Fallback subcadena solo si el FTS no encontró nada de nada
  if (contents.length === 0 && courses.length === 0) {
    ;[contents, courses] = await Promise.all([
      searchContentsLike(query, limit),
      searchCoursesLike(query, limit),
    ])
  }

  return [
    ...courses.map((r) => toResult(r, 'course')),
    ...contents.map((r) => toResult(r, 'content')),
  ]
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit)
}

/** Registro de búsquedas (briefing: saber qué busca la gente y qué no encuentra). */
export async function logSearch(
  userId: string | null,
  query: string,
  resultsCount: number,
): Promise<void> {
  const q = query.trim().slice(0, 200)
  if (q.length < 2) return
  try {
    await db.searchQuery.create({ data: { query: q, userId, resultsCount } })
  } catch {
    // El registro nunca debe romper la búsqueda
  }
}
