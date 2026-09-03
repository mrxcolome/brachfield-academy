'use server'

// Server actions de la Sala de profesores. Guard: rol ADMIN o EDITOR de la
// app (los mismos roles del panel /app/admin). Validación Zod en cada una.
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireRole } from '@/features/auth/guards'
import {
  addSalaLesson,
  createSalaCourse,
  deleteSalaLesson,
  getSalaCourse,
  lessonProgressCount,
  logSala,
  moveSalaLesson,
  publishSalaCourse,
  setSalaCover,
  streamInfo,
  unpublishSalaCourse,
  updateSalaBasics,
  updateSalaLesson,
  type LessonInput,
} from './service'

type Result = { ok?: boolean; error?: string }

const basicsSchema = z.object({
  title: z.string().trim().min(3, 'El título necesita al menos 3 caracteres').max(160),
  description: z.string().trim().min(10, 'Cuenta en un par de frases de qué va el curso').max(2000),
  categoryId: z.coerce.number().int().positive('Elige el área de conocimiento'),
})

const lessonSchema = z.object({
  title: z.string().trim().min(2, 'La lección necesita un título').max(200),
  lessonType: z.enum(['video', 'text']),
  duration: z.string().trim().max(30).optional(),
  streamId: z.string().trim().max(64).optional(),
  text: z.string().trim().max(20000).optional(),
})

const idSchema = z.coerce.number().int().positive()

function revalidate(id?: number) {
  revalidatePath('/app/sala')
  if (id) revalidatePath(`/app/sala/${id}`)
}

export async function crearCurso(raw: unknown): Promise<Result & { id?: number }> {
  const { user } = await requireRole('ADMIN', 'EDITOR')
  const parsed = basicsSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Revisa los datos' }
  const id = await createSalaCourse(parsed.data)
  await logSala(user, 'CREATE', parsed.data.title)
  revalidate(id)
  return { ok: true, id }
}

export async function guardarCurso(raw: unknown): Promise<Result> {
  const { user } = await requireRole('ADMIN', 'EDITOR')
  const parsed = basicsSchema.extend({ id: idSchema }).safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Revisa los datos' }
  const { id, ...basics } = parsed.data
  await updateSalaBasics(id, basics)
  await logSala(user, 'UPDATE', basics.title)
  revalidate(id)
  return { ok: true }
}

export async function subirPortada(formData: FormData): Promise<Result> {
  await requireRole('ADMIN', 'EDITOR')
  const id = idSchema.safeParse(formData.get('id'))
  const file = formData.get('file')
  if (!id.success || !(file instanceof File)) return { error: 'Solicitud no válida' }
  if (!file.type.startsWith('image/')) return { error: 'La portada debe ser una imagen' }
  if (file.size > 4 * 1024 * 1024)
    return { error: 'Máximo 4 MB — reduce la imagen y vuelve a probar' }
  const course = await getSalaCourse(id.data)
  if (!course) return { error: 'Curso no encontrado' }
  await setSalaCover(
    id.data,
    {
      data: Buffer.from(await file.arrayBuffer()),
      name: file.name,
      mimetype: file.type,
      size: file.size,
    },
    `Portada del curso ${course.title}`,
  )
  revalidate(id.data)
  return { ok: true }
}

export async function anadirLeccion(raw: unknown): Promise<Result> {
  await requireRole('ADMIN', 'EDITOR')
  const parsed = lessonSchema.extend({ id: idSchema }).safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Revisa los datos' }
  const { id, ...lesson } = parsed.data
  await addSalaLesson(id, lesson as LessonInput)
  revalidate(id)
  return { ok: true }
}

export async function guardarLeccion(raw: unknown): Promise<Result> {
  await requireRole('ADMIN', 'EDITOR')
  const parsed = lessonSchema.extend({ id: idSchema, lessonId: z.string().min(1) }).safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Revisa los datos' }
  const { id, lessonId, ...lesson } = parsed.data
  await updateSalaLesson(id, lessonId, lesson as LessonInput)
  revalidate(id)
  return { ok: true }
}

/**
 * Borrar lección. Si tiene progreso de alumnos y no llega confirm=true,
 * no borra: devuelve el aviso con el recuento (decisión 3/09: avisar basta).
 */
export async function borrarLeccion(raw: unknown): Promise<Result & { warning?: number }> {
  await requireRole('ADMIN', 'EDITOR')
  const parsed = z
    .object({ id: idSchema, lessonId: z.string().min(1), confirm: z.boolean().optional() })
    .safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  const progress = await lessonProgressCount(parsed.data.lessonId)
  if (progress > 0 && !parsed.data.confirm) return { warning: progress }
  await deleteSalaLesson(parsed.data.id, parsed.data.lessonId)
  revalidate(parsed.data.id)
  return { ok: true }
}

export async function moverLeccion(raw: unknown): Promise<Result> {
  await requireRole('ADMIN', 'EDITOR')
  const parsed = z
    .object({
      id: idSchema,
      lessonId: z.string().min(1),
      dir: z.union([z.literal(-1), z.literal(1)]),
    })
    .safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  await moveSalaLesson(parsed.data.id, parsed.data.lessonId, parsed.data.dir)
  revalidate(parsed.data.id)
  return { ok: true }
}

export async function publicarCurso(raw: unknown): Promise<Result> {
  const { user } = await requireRole('ADMIN', 'EDITOR')
  const parsed = idSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  const res = await publishSalaCourse(parsed.data)
  if (res.error) return { error: res.error }
  const course = await getSalaCourse(parsed.data)
  await logSala(user, 'UPDATE', `${course?.title ?? 'Curso'} (publicado)`)
  revalidate(parsed.data)
  revalidatePath('/app/learning')
  revalidatePath('/courses')
  return { ok: true }
}

export async function despublicarCurso(raw: unknown): Promise<Result> {
  const { user } = await requireRole('ADMIN', 'EDITOR')
  const parsed = idSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  const course = await getSalaCourse(parsed.data)
  await unpublishSalaCourse(parsed.data)
  await logSala(user, 'UPDATE', `${course?.title ?? 'Curso'} (retirado a borrador)`)
  revalidate(parsed.data)
  return { ok: true }
}

/** Consulta a Stream si un vídeo subido ya está listo, y su duración. */
export async function estadoVideo(
  raw: unknown,
): Promise<Result & { ready?: boolean; duration?: string | null }> {
  await requireRole('ADMIN', 'EDITOR')
  const parsed = z.string().min(10).max(64).safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }
  const info = await streamInfo(parsed.data)
  if (!info) return { error: 'No se pudo consultar Cloudflare' }
  return { ok: true, ready: info.ready, duration: info.duration }
}
