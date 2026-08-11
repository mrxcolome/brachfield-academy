import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { requireActiveMember } from '@/features/auth/guards'
import { getCourseBySlug, flattenLessons } from '@/features/content/service'
import { db } from '@/lib/db'
import { cn } from '@/lib/cn'
import { MarkCompleteButton } from './mark-complete-button'

interface Props {
  params: Promise<{ slug: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { user } = await requireActiveMember()
  const { slug, lessonId } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const lessons = flattenLessons(course)
  const index = lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) notFound()
  const lesson = lessons[index]!

  // Datos de la lección completa (body/transcript viven en los módulos)
  const rawLesson = (course.modules ?? [])
    .flatMap((m) => m.lessons ?? [])
    .find((l) => l.id === lessonId)

  const done = new Set(
    (
      await db.userProgress.findMany({
        where: { userId: user.id, courseId: String(course.id), status: 'COMPLETED' },
        select: { contentId: true },
      })
    ).map((r) => r.contentId),
  )

  const prev = index > 0 ? lessons[index - 1] : null
  const next = index < lessons.length - 1 ? lessons[index + 1] : null
  const completedCount = lessons.filter((l) => done.has(l.id)).length
  const pct = Math.round((completedCount / lessons.length) * 100)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      {/* Sidebar del curso */}
      <aside className="w-full flex-none rounded-lg border border-border bg-surface lg:w-72">
        <div className="border-b border-border-soft p-4">
          <p className="mb-1 font-mono text-[10.5px] tracking-wide text-muted uppercase">Curso</p>
          <Link
            href={`/app/courses/${course.slug}`}
            className="text-[13.5px] leading-snug font-semibold text-ink no-underline hover:text-brand"
          >
            {course.title}
          </Link>
        </div>
        <nav
          aria-label="Lecciones del curso"
          className="max-h-105 overflow-y-auto py-2 lg:max-h-none"
        >
          {(course.modules ?? []).map((m) => (
            <div key={m.id}>
              <p className="px-4 pt-3 pb-1.5 font-mono text-[11px] font-semibold tracking-wide text-muted uppercase">
                {m.name}
              </p>
              {(m.lessons ?? []).map((l) => {
                const isCurrent = l.id === lessonId
                const isDone = done.has(l.id ?? '')
                return (
                  <Link
                    key={l.id}
                    href={`/app/courses/${course.slug}/${l.id}`}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-[13px] no-underline',
                      isCurrent
                        ? 'bg-brand-soft font-semibold text-brand'
                        : isDone
                          ? 'text-muted hover:bg-bg'
                          : 'text-ink-2 hover:bg-bg',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        isDone ? 'text-success' : isCurrent ? 'text-brand' : 'text-faint',
                      )}
                    >
                      {isDone ? '✓' : '○'}
                    </span>
                    {l.title}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Área principal */}
      <div className="min-w-0 flex-1">
        {/* Player o cabecera según tipo */}
        {(lesson.lessonType === 'video' || lesson.lessonType === 'audio') && (
          <div className="mb-5 flex aspect-video items-center justify-center rounded-xl bg-player text-center">
            <div>
              <p aria-hidden className="mb-2 text-3xl text-on-dark-muted">
                ▶
              </p>
              <p className="font-mono text-xs text-on-dark-muted">
                {lesson.lessonType === 'video' ? 'REPRODUCTOR DE VÍDEO' : 'REPRODUCTOR DE AUDIO'}
              </p>
              <p className="mt-1 px-6 text-[11.5px] text-on-dark-muted">
                Se activará al conectar Cloudflare Stream
              </p>
            </div>
          </div>
        )}

        <p className="mb-1.5 font-mono text-[11px] tracking-wide text-muted uppercase">
          Lección {index + 1} de {lessons.length} · {lesson.moduleName}
        </p>
        <h1 className="mb-4 text-2xl font-bold">{lesson.title}</h1>

        {/* Navegación + completar */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          {prev ? (
            <Link
              href={`/app/courses/${course.slug}/${prev.id}`}
              className="rounded-sm bg-border-faint px-3.5 py-2 text-[13px] font-semibold text-ink-2 no-underline hover:bg-border-soft"
            >
              ← Anterior
            </Link>
          ) : null}
          <MarkCompleteButton
            courseSlug={course.slug}
            lessonId={lesson.id}
            initialCompleted={done.has(lesson.id)}
            nextHref={
              next ? `/app/courses/${course.slug}/${next.id}` : `/app/courses/${course.slug}`
            }
          />
          {next ? (
            <Link
              href={`/app/courses/${course.slug}/${next.id}`}
              className="rounded-sm bg-brand px-3.5 py-2 text-[13px] font-semibold text-white no-underline hover:bg-brand-hover"
            >
              Siguiente →
            </Link>
          ) : null}
          <span className="ml-auto font-mono text-xs text-muted">
            {completedCount} de {lessons.length} · {pct}%
          </span>
        </div>

        {/* Contenido */}
        {rawLesson?.body && (
          <div className="prose-sm mb-6 max-w-2xl text-sm leading-relaxed text-ink-2 [&_p]:mb-3">
            <RichText data={rawLesson.body} />
          </div>
        )}

        {/* Transcripción */}
        {(rawLesson?.transcript?.length ?? 0) > 0 && (
          <section className="max-w-2xl">
            <h2 className="mb-2 text-[13px] font-semibold text-ink-2">En esta lección</h2>
            <div className="flex flex-col">
              {rawLesson!.transcript!.map((t) => (
                <p key={t.id} className="flex gap-3 py-1.5 text-[13px]">
                  <span className="font-mono text-brand-link">
                    {Math.floor(t.ts / 60)}:{String(Math.floor(t.ts % 60)).padStart(2, '0')}
                  </span>
                  <span className="text-ink-2">{t.text}</span>
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
