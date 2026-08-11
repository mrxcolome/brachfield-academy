import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireActiveMember } from '@/features/auth/guards'
import { getCourseBySlug, flattenLessons } from '@/features/content/service'
import { getCourseProgress } from '@/features/learning/service'
import { db } from '@/lib/db'
import { Cover } from '@/components/art'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/cn'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: Props) {
  const { user } = await requireActiveMember()
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const progress = await getCourseProgress(user.id, course)
  const lessons = flattenLessons(course)
  const done = new Set(
    (
      await db.userProgress.findMany({
        where: { userId: user.id, courseId: String(course.id), status: 'COMPLETED' },
        select: { contentId: true },
      })
    ).map((r) => r.contentId),
  )

  const ctaLesson = progress.nextLessonId ?? lessons[0]?.id

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="mb-2 font-mono text-[11px] tracking-wide text-muted uppercase">
          Curso {course.duration ? `· ${course.duration}` : ''}
        </p>
        <h1 className="mb-2.5 text-2xl leading-tight font-bold">{course.title}</h1>
        <p className="mb-4 text-[13.5px] text-muted">
          {course.teacher} · {lessons.length} lecciones
        </p>
        <p className="mb-5 max-w-xl text-sm leading-relaxed text-ink-3">{course.description}</p>

        {progress.total > 0 && (
          <div className="mb-6 max-w-md">
            <Progress value={progress.pct} label="Progreso del curso" className="mb-1.5" />
            <p className="font-mono text-xs text-muted">
              {progress.completed} de {progress.total} lecciones · {progress.pct}%
            </p>
          </div>
        )}

        {ctaLesson && (
          <Link
            href={`/app/courses/${course.slug}/${ctaLesson}`}
            className="mb-8 inline-block rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
          >
            {progress.completed > 0 ? 'Continuar curso' : 'Empezar curso'}
          </Link>
        )}

        {(course.objectives?.length ?? 0) > 0 && (
          <>
            <h2 className="mb-2 text-sm font-semibold">Qué aprenderás</h2>
            <ul className="mb-7 max-w-xl list-disc pl-5 text-sm leading-loose text-ink-2">
              {course.objectives!.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="mb-3 text-sm font-semibold">Contenido del curso</h2>
        <div className="flex max-w-xl flex-col gap-3">
          {(course.modules ?? []).map((m) => (
            <div key={m.id} className="rounded-md border border-border-soft bg-surface p-4">
              <p className="mb-1.5 text-[13px] font-semibold">{m.name}</p>
              {(m.lessons ?? []).map((l) => {
                const isDone = done.has(l.id ?? '')
                return (
                  <Link
                    key={l.id}
                    href={`/app/courses/${course.slug}/${l.id}`}
                    className={cn(
                      'flex items-center gap-2.5 rounded px-1.5 py-2 text-[13.5px] no-underline hover:bg-bg',
                      isDone ? 'text-muted' : 'text-ink-2',
                    )}
                  >
                    <span aria-hidden className={cn(isDone ? 'text-success' : 'text-faint')}>
                      {isDone ? '✓' : '○'}
                    </span>
                    <span className={cn(isDone && 'line-through decoration-border-input')}>
                      {l.title}
                    </span>
                    {l.duration && (
                      <span className="ml-auto font-mono text-[11px] text-muted">{l.duration}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <aside>
        <Cover
          title={course.title}
          kind="curso"
          className="rounded-xl"
          style={{ aspectRatio: '16/10' }}
        />
      </aside>
    </div>
  )
}
