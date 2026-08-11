import Link from 'next/link'
import { requireActiveMember } from '@/features/auth/guards'
import { getPublishedCourses } from '@/features/content/service'
import { getCourseProgress } from '@/features/learning/service'
import { Cover } from '@/components/art'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Mi formación' }

export default async function LearningPage() {
  const { user } = await requireActiveMember()
  const courses = await getPublishedCourses()
  const withProgress = await Promise.all(
    courses.map(async (course) => ({ course, progress: await getCourseProgress(user.id, course) })),
  )

  const inProgress = withProgress.filter((c) => c.progress.completed > 0 && c.progress.nextLessonId)
  const completed = withProgress.filter((c) => c.progress.total > 0 && !c.progress.nextLessonId)
  const notStarted = withProgress.filter(
    (c) => c.progress.completed === 0 && c.progress.nextLessonId,
  )

  const totalCompleted = withProgress.reduce((acc, c) => acc + c.progress.completed, 0)

  function CourseCard({ course, progress }: (typeof withProgress)[number]) {
    return (
      <Link
        href={`/app/courses/${course.slug}`}
        className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
      >
        <Cover title={course.title} kind="curso" style={{ aspectRatio: '16/10' }} />
        <div className="p-3.5">
          <p className="mb-2 text-[13.5px] leading-snug font-semibold">{course.title}</p>
          <Progress value={progress.pct} label={`Progreso de ${course.title}`} className="mb-1.5" />
          <p className="font-mono text-[11px] text-muted">
            {progress.completed} de {progress.total} lecciones · {progress.pct}%
          </p>
        </div>
      </Link>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-1 text-2xl font-bold">Mi formación</h1>
      <p className="mb-7 text-sm text-muted">
        {totalCompleted > 0
          ? `Llevas ${totalCompleted} ${totalCompleted === 1 ? 'lección completada' : 'lecciones completadas'}. Sigue así.`
          : 'Empieza tu primer curso — tu progreso aparecerá aquí.'}
      </p>

      {inProgress.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">En progreso</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((c) => (
              <CourseCard key={c.course.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {notStarted.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Por empezar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notStarted.map((c) => (
              <CourseCard key={c.course.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Completados</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((c) => (
              <CourseCard key={c.course.id} {...c} />
            ))}
          </div>
        </section>
      )}

      {withProgress.length === 0 && (
        <EmptyState
          icon="▤"
          title="Aún no hay cursos publicados"
          description="El equipo editorial está preparando el contenido."
        />
      )}
    </div>
  )
}
