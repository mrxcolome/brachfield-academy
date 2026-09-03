// Sala de profesores (fase 1) — servicio de escritura de cursos.
// La Sala escribe en Payload por la Local API con la estructura simplificada
// decidida el 3/09: Curso → Lecciones, con UN módulo técnico invisible
// (HIDDEN_MODULE) que preserva el esquema y los cursos existentes.
import 'server-only'
import { cms } from '@/lib/cms'
import { db } from '@/lib/db'
import { track } from '@/features/analytics/service'
import type { Course } from '@/payload/payload-types'

export const HIDDEN_MODULE = 'Contenido'

type CourseModules = NonNullable<Course['modules']>
type CourseLessonRaw = NonNullable<CourseModules[number]['lessons']>[number]

export interface SalaLesson {
  id: string
  title: string
  lessonType: 'video' | 'text'
  duration: string | null
  streamId: string | null
  text: string | null
}

export interface SalaCourse {
  id: number
  title: string
  slug: string
  description: string
  status: 'draft' | 'published'
  updatedAt: string
  categoryId: number | null
  coverUrl: string | null
  lessons: SalaLesson[]
  /** Curso con varios módulos creados en el CMS: la Sala no lo edita (fase 2). */
  multiModule: boolean
}

// ── Lexical mínimo: texto plano ↔ richText ───────────────────────────────
type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

export function textToLexical(text: string) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0)
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: (paragraphs.length ? paragraphs : ['']).map((p) => ({
        type: 'paragraph',
        version: 1,
        children: [
          {
            type: 'text',
            version: 1,
            text: p.trim(),
            format: 0,
            mode: 'normal',
            style: '',
            detail: 0,
          },
        ],
      })),
    },
  }
}

export function lexicalToText(body: unknown): string {
  const root = (body as { root?: LexicalNode } | null)?.root
  if (!root?.children) return ''
  const paragraph = (n: LexicalNode): string =>
    (n.children ?? []).map((c) => (typeof c.text === 'string' ? c.text : paragraph(c))).join('')
  return root.children.map(paragraph).filter(Boolean).join('\n\n')
}

// ── Lectura ──────────────────────────────────────────────────────────────
function toSalaLesson(raw: CourseLessonRaw): SalaLesson {
  return {
    id: String(raw.id ?? ''),
    title: raw.title,
    lessonType: raw.lessonType === 'video' ? 'video' : 'text',
    duration: raw.duration ?? null,
    streamId: raw.streamId ?? null,
    text: raw.body ? lexicalToText(raw.body) : null,
  }
}

function toSalaCourse(doc: Course): SalaCourse {
  const modules = doc.modules ?? []
  const cover = doc.coverImage
  const category = doc.categories?.[0]
  return {
    id: Number(doc.id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    status: doc._status === 'published' ? 'published' : 'draft',
    updatedAt: doc.updatedAt,
    categoryId:
      category == null
        ? null
        : typeof category === 'object'
          ? Number(category.id)
          : Number(category),
    coverUrl: cover && typeof cover === 'object' && cover.url ? cover.url : null,
    lessons: modules.flatMap((m) => (m.lessons ?? []).map(toSalaLesson)),
    multiModule: modules.length > 1,
  }
}

export async function listSalaCourses(): Promise<SalaCourse[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'courses',
    draft: true,
    depth: 1,
    limit: 100,
    sort: '-updatedAt',
    overrideAccess: true,
  })
  return res.docs.map(toSalaCourse)
}

export async function getSalaCourse(id: number): Promise<SalaCourse | null> {
  const payload = await cms()
  const doc = await payload
    .findByID({ collection: 'courses', id, draft: true, depth: 1, overrideAccess: true })
    .catch(() => null)
  return doc ? toSalaCourse(doc) : null
}

// ── Escritura ────────────────────────────────────────────────────────────
function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

async function uniqueSlug(
  title: string,
  collection: 'courses' | 'contents' = 'courses',
): Promise<string> {
  const payload = await cms()
  const base = slugify(title) || 'pieza'
  const taken = await payload.find({
    collection,
    draft: true,
    depth: 0,
    limit: 50,
    where: { slug: { like: base } },
    overrideAccess: true,
  })
  const slugs = new Set(taken.docs.map((d) => d.slug))
  if (!slugs.has(base)) return base
  for (let n = 2; ; n++) if (!slugs.has(`${base}-${n}`)) return `${base}-${n}`
}

export async function createSalaCourse(input: {
  title: string
  description: string
  categoryId: number
}): Promise<number> {
  const payload = await cms()
  const doc = await payload.create({
    collection: 'courses',
    draft: true,
    overrideAccess: true,
    data: {
      title: input.title,
      slug: await uniqueSlug(input.title),
      description: input.description,
      categories: [input.categoryId],
      modules: [{ name: HIDDEN_MODULE, lessons: [] }],
      _status: 'draft',
    },
  })
  return Number(doc.id)
}

export async function updateSalaBasics(
  id: number,
  input: { title: string; description: string; categoryId: number },
): Promise<void> {
  const payload = await cms()
  await payload.update({
    collection: 'courses',
    id,
    draft: true,
    overrideAccess: true,
    data: {
      title: input.title,
      description: input.description,
      categories: [input.categoryId],
    },
  })
}

export async function setSalaCover(
  id: number,
  file: { data: Buffer; name: string; mimetype: string; size: number },
  alt: string,
): Promise<void> {
  const payload = await cms()
  const media = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt },
    file: file,
  })
  await payload.update({
    collection: 'courses',
    id,
    draft: true,
    overrideAccess: true,
    data: { coverImage: media.id },
  })
}

/** Lee las lecciones crudas del módulo técnico, aplica fn y guarda. */
async function withLessons(
  id: number,
  fn: (lessons: CourseLessonRaw[]) => CourseLessonRaw[],
): Promise<void> {
  const payload = await cms()
  const doc = await payload.findByID({
    collection: 'courses',
    id,
    draft: true,
    depth: 0,
    overrideAccess: true,
  })
  const modules: CourseModules = doc.modules?.length
    ? (doc.modules as CourseModules)
    : [{ name: HIDDEN_MODULE, lessons: [] }]
  if (modules.length > 1) throw new Error('MULTI_MODULE')
  const first = modules[0] ?? { name: HIDDEN_MODULE, lessons: [] }
  first.lessons = fn((first.lessons ?? []) as CourseLessonRaw[])
  modules[0] = first
  await payload.update({
    collection: 'courses',
    id,
    draft: true,
    overrideAccess: true,
    data: { modules },
  })
}

export interface LessonInput {
  title: string
  lessonType: 'video' | 'text'
  duration?: string
  streamId?: string
  text?: string
}

function toRawLesson(input: LessonInput, existing?: CourseLessonRaw): CourseLessonRaw {
  return {
    ...existing,
    title: input.title,
    lessonType: input.lessonType,
    duration: input.duration || existing?.duration || null,
    streamId: input.lessonType === 'video' ? input.streamId || existing?.streamId || null : null,
    body: input.text?.trim()
      ? (textToLexical(input.text) as CourseLessonRaw['body'])
      : (existing?.body ?? null),
  }
}

export async function addSalaLesson(id: number, input: LessonInput): Promise<void> {
  await withLessons(id, (lessons) => [...lessons, toRawLesson(input)])
}

export async function updateSalaLesson(
  id: number,
  lessonId: string,
  input: LessonInput,
): Promise<void> {
  await withLessons(id, (lessons) =>
    lessons.map((l) => (String(l.id) === lessonId ? toRawLesson(input, l) : l)),
  )
}

export async function deleteSalaLesson(id: number, lessonId: string): Promise<void> {
  await withLessons(id, (lessons) => lessons.filter((l) => String(l.id) !== lessonId))
}

export async function moveSalaLesson(id: number, lessonId: string, dir: -1 | 1): Promise<void> {
  await withLessons(id, (lessons) => {
    const i = lessons.findIndex((l) => String(l.id) === lessonId)
    const j = i + dir
    if (i < 0 || j < 0 || j >= lessons.length) return lessons
    const next = [...lessons]
    const [item] = next.splice(i, 1)
    if (item) next.splice(j, 0, item)
    return next
  })
}

/** Cuántos alumnos tienen progreso registrado en una lección (para el aviso). */
export async function lessonProgressCount(lessonId: string): Promise<number> {
  return db.userProgress.count({ where: { contentId: lessonId } })
}

// ── Publicación ──────────────────────────────────────────────────────────
function totalDuration(lessons: SalaLesson[]): string | null {
  let minutes = 0
  for (const l of lessons) {
    const m = l.duration?.match(/(\d+)\s*h/)?.[1]
    const min = l.duration?.match(/(\d+)\s*m/)?.[1]
    minutes += (m ? Number(m) * 60 : 0) + (min ? Number(min) : 0)
  }
  if (minutes === 0) return null
  const h = Math.floor(minutes / 60)
  return h > 0 ? `${h}h ${minutes % 60}min` : `${minutes}min`
}

export async function publishSalaCourse(id: number): Promise<{ error?: string }> {
  const course = await getSalaCourse(id)
  if (!course) return { error: 'Curso no encontrado' }
  if (!course.title.trim() || !course.description.trim()) {
    return { error: 'Faltan el título o la descripción (paso 1).' }
  }
  if (course.categoryId == null) return { error: 'Falta el área de conocimiento (paso 1).' }
  if (course.lessons.length === 0)
    return { error: 'Un curso necesita al menos una lección (paso 3).' }
  const payload = await cms()
  await payload.update({
    collection: 'courses',
    id,
    overrideAccess: true,
    data: {
      _status: 'published',
      publishedAt: new Date().toISOString(),
      duration: totalDuration(course.lessons),
    },
  })
  return {}
}

export async function unpublishSalaCourse(id: number): Promise<void> {
  const payload = await cms()
  await payload.update({
    collection: 'courses',
    id,
    overrideAccess: true,
    data: { _status: 'draft' },
  })
}

// ── Cloudflare Stream ────────────────────────────────────────────────────
export async function streamInfo(
  uid: string,
): Promise<{ ready: boolean; duration: string | null } | null> {
  const account = process.env.R2_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_STREAM_TOKEN
  if (!account || !token) return null
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/stream/${encodeURIComponent(uid)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  ).catch(() => null)
  if (!res?.ok) return null
  const json = (await res.json()) as {
    result?: { readyToStream?: boolean; duration?: number }
  }
  const seconds = json.result?.duration ?? -1
  return {
    ready: json.result?.readyToStream === true,
    duration: seconds > 0 ? `${Math.max(1, Math.round(seconds / 60))} min` : null,
  }
}

// ── Registro editorial (la Sala firma con el usuario de la app) ──────────
export async function logSala(
  user: { email: string; name: string },
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  docTitle: string,
  collection: 'courses' | 'contents' = 'courses',
): Promise<void> {
  try {
    await db.editorialActivity.create({
      data: {
        editorEmail: user.email,
        editorName: user.name,
        action,
        collection,
        docTitle,
      },
    })
  } catch (e) {
    console.error('[sala] no se pudo registrar la actividad', e)
  }
  track('editorial_change', {
    userId: `editor:${user.email}`,
    properties: { action, collection, docTitle, source: 'sala' },
    person: { email: user.email, name: user.name },
  })
}

// ─────────────── Contenidos sueltos (los otros 9 conceptos) ──────────────

import type { Content } from '@/payload/payload-types'

import { type SalaConceptType } from './concepts'
export { SALA_CONCEPTS, type SalaConceptType } from './concepts'

export interface SalaContent {
  id: number
  title: string
  slug: string
  conceptType: SalaConceptType
  excerpt: string
  status: 'draft' | 'published'
  updatedAt: string
  categoryId: number | null
  level: NonNullable<Content['level']> | null
  duration: string | null
  coverUrl: string | null
  streamId: string | null
  text: string
  audioName: string | null
  documentName: string | null
}

function toSalaContent(doc: Content): SalaContent {
  const cover = doc.coverImage
  const category = doc.categories?.[0]
  const mediaName = (m: Content['audioFile']): string | null =>
    m && typeof m === 'object' ? (m.filename ?? 'archivo') : null
  return {
    id: Number(doc.id),
    title: doc.title,
    slug: doc.slug,
    conceptType: doc.contentType,
    excerpt: doc.excerpt ?? '',
    status: doc._status === 'published' ? 'published' : 'draft',
    updatedAt: doc.updatedAt,
    categoryId:
      category == null
        ? null
        : typeof category === 'object'
          ? Number(category.id)
          : Number(category),
    level: doc.level ?? null,
    duration: doc.duration ?? null,
    coverUrl: cover && typeof cover === 'object' && cover.url ? cover.url : null,
    streamId: doc.streamId ?? null,
    text: doc.body ? lexicalToText(doc.body) : '',
    audioName: mediaName(doc.audioFile),
    documentName: mediaName(doc.documentFile),
  }
}

export async function listSalaContents(): Promise<SalaContent[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'contents',
    draft: true,
    depth: 1,
    limit: 100,
    sort: '-updatedAt',
    overrideAccess: true,
  })
  return res.docs.map(toSalaContent)
}

export async function getSalaContent(id: number): Promise<SalaContent | null> {
  const payload = await cms()
  const doc = await payload
    .findByID({ collection: 'contents', id, draft: true, depth: 1, overrideAccess: true })
    .catch(() => null)
  return doc ? toSalaContent(doc) : null
}

export interface SalaContentBasics {
  title: string
  excerpt: string
  categoryId: number
  conceptType: SalaConceptType
  level?: NonNullable<Content['level']>
}

export async function createSalaContent(input: SalaContentBasics): Promise<number> {
  const payload = await cms()
  const doc = await payload.create({
    collection: 'contents',
    draft: true,
    overrideAccess: true,
    data: {
      title: input.title,
      slug: await uniqueSlug(input.title, 'contents'),
      excerpt: input.excerpt,
      contentType: input.conceptType,
      categories: [input.categoryId],
      level: input.level ?? null,
      premium: true,
      _status: 'draft',
    },
  })
  return Number(doc.id)
}

export async function updateSalaContentBasics(id: number, input: SalaContentBasics): Promise<void> {
  const payload = await cms()
  await payload.update({
    collection: 'contents',
    id,
    draft: true,
    overrideAccess: true,
    data: {
      title: input.title,
      excerpt: input.excerpt,
      contentType: input.conceptType,
      categories: [input.categoryId],
      level: input.level ?? null,
    },
  })
}

export async function setSalaContentMaterial(
  id: number,
  input: { streamId?: string; duration?: string; text?: string },
): Promise<void> {
  const payload = await cms()
  await payload.update({
    collection: 'contents',
    id,
    draft: true,
    overrideAccess: true,
    data: {
      streamId: input.streamId?.trim() || null,
      duration: input.duration?.trim() || null,
      body: input.text?.trim() ? (textToLexical(input.text) as Content['body']) : null,
    },
  })
}

/** Sube portada, audio o documento y lo vincula al contenido. */
export async function attachSalaContentFile(
  id: number,
  kind: 'cover' | 'audio' | 'document',
  file: { data: Buffer; name: string; mimetype: string; size: number },
  alt: string,
): Promise<void> {
  const payload = await cms()
  const media = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt },
    file,
  })
  const field = kind === 'cover' ? 'coverImage' : kind === 'audio' ? 'audioFile' : 'documentFile'
  await payload.update({
    collection: 'contents',
    id,
    draft: true,
    overrideAccess: true,
    data: { [field]: media.id },
  })
}

export async function publishSalaContent(id: number): Promise<{ error?: string }> {
  const piece = await getSalaContent(id)
  if (!piece) return { error: 'Contenido no encontrado' }
  if (!piece.title.trim()) return { error: 'Falta el título (paso 1).' }
  if (!piece.excerpt.trim()) return { error: 'Faltan las dos frases de resumen (paso 1).' }
  if (piece.categoryId == null) return { error: 'Falta el área de conocimiento (paso 1).' }
  if (!piece.streamId && !piece.text.trim() && !piece.audioName && !piece.documentName) {
    return {
      error: 'La pieza necesita al menos un material: vídeo, texto, audio o archivo (paso 2).',
    }
  }
  const payload = await cms()
  await payload.update({
    collection: 'contents',
    id,
    overrideAccess: true,
    data: { _status: 'published', publishedAt: new Date().toISOString() },
  })
  return {}
}

export async function unpublishSalaContent(id: number): Promise<void> {
  const payload = await cms()
  await payload.update({
    collection: 'contents',
    id,
    overrideAccess: true,
    data: { _status: 'draft' },
  })
}
