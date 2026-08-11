'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { getCourseBySlug, flattenLessons } from '@/features/content/service'
import { track } from '@/features/analytics/service'

const markSchema = z.object({
  courseSlug: z.string().min(1),
  lessonId: z.string().min(1),
  completed: z.boolean(),
})

/** Marca/desmarca una lección. Valida SIEMPRE que la lección pertenece al
 *  curso publicado (los ids nunca se aceptan a ciegas — DATABASE.md). */
export async function markLesson(raw: unknown): Promise<{ error?: string }> {
  const { user } = await requireActiveMember()
  const parsed = markSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }

  const course = await getCourseBySlug(parsed.data.courseSlug)
  if (!course) return { error: 'Curso no encontrado' }
  const lesson = flattenLessons(course).find((l) => l.id === parsed.data.lessonId)
  if (!lesson) return { error: 'Lección no encontrada' }

  const courseId = String(course.id)
  if (parsed.data.completed) {
    await db.userProgress.upsert({
      where: { userId_contentId: { userId: user.id, contentId: lesson.id } },
      create: {
        userId: user.id,
        contentId: lesson.id,
        courseId,
        status: 'COMPLETED',
        progressPct: 100,
        completedAt: new Date(),
      },
      update: { status: 'COMPLETED', progressPct: 100, completedAt: new Date() },
    })
    track('lesson_completed', {
      userId: user.id,
      properties: { courseSlug: course.slug, lessonId: lesson.id },
    })
    const done = await db.userProgress.count({
      where: { userId: user.id, courseId, status: 'COMPLETED' },
    })
    if (done === flattenLessons(course).length) {
      track('course_completed', { userId: user.id, properties: { courseSlug: course.slug } })
    }
  } else {
    await db.userProgress.updateMany({
      where: { userId: user.id, contentId: lesson.id },
      data: { status: 'IN_PROGRESS', progressPct: 0, completedAt: null },
    })
  }

  revalidatePath(`/app/courses/${course.slug}`)
  revalidatePath('/app/learning')
  revalidatePath('/app')
  return {}
}

/** Guarda posición de reproducción (throttled en el cliente — briefing §17). */
export async function saveLessonPosition(raw: unknown): Promise<void> {
  const { user } = await requireActiveMember()
  const schema = z.object({
    courseSlug: z.string().min(1),
    lessonId: z.string().min(1),
    positionSec: z
      .number()
      .int()
      .min(0)
      .max(60 * 60 * 24),
  })
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return

  const course = await getCourseBySlug(parsed.data.courseSlug)
  if (!course) return
  if (!flattenLessons(course).some((l) => l.id === parsed.data.lessonId)) return

  await db.userProgress.upsert({
    where: { userId_contentId: { userId: user.id, contentId: parsed.data.lessonId } },
    create: {
      userId: user.id,
      contentId: parsed.data.lessonId,
      courseId: String(course.id),
      status: 'IN_PROGRESS',
      lastPositionSec: parsed.data.positionSec,
    },
    update: { lastPositionSec: parsed.data.positionSec },
  })
}
