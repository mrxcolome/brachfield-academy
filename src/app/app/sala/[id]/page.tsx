import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/features/auth/guards'
import { getCategories } from '@/features/content/service'
import { getSalaCourse } from '@/features/sala/service'
import { SalaSteps } from '../steps'
import { BasicsForm } from '../basics-form'
import { CoverForm } from './cover-form'
import { LessonsEditor } from './lessons-editor'
import { PublishPanel } from './publish-panel'

export const metadata = { title: 'Sala de profesores · Curso' }

const TITLES: Record<number, { h: string; sub: string }> = {
  1: { h: 'El curso', sub: 'Título, descripción y área. Es lo que ve el alumno en la tarjeta.' },
  2: { h: 'La portada', sub: 'Opcional: sin portada propia, entra la automática del área.' },
  3: { h: 'Las lecciones', sub: 'El contenido del curso, en el orden en que se estudiará.' },
  4: { h: 'Revisar y publicar', sub: 'Un último vistazo antes de abrir la puerta a los alumnos.' },
}

export default async function SalaCursoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ paso?: string }>
}) {
  await requireRole('ADMIN', 'EDITOR')
  const { id: rawId } = await params
  const id = Number.parseInt(rawId, 10)
  if (!Number.isFinite(id)) notFound()
  const course = await getSalaCourse(id)
  if (!course) notFound()

  const { paso: rawPaso } = await searchParams
  const paso = Math.min(4, Math.max(1, Number.parseInt(rawPaso ?? '1', 10) || 1)) as 1 | 2 | 3 | 4

  if (course.multiModule) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link href="/app/sala" className="text-[13px] text-brand-link">
          ← Sala de profesores
        </Link>
        <p className="mt-4 rounded-lg border border-border bg-surface p-6 text-sm text-ink-2">
          <strong>{course.title}</strong> tiene varios módulos creados en el CMS. La Sala editará
          estos cursos en la fase 2; de momento se retoca en el{' '}
          <a href="/admin" target="_blank" rel="noreferrer">
            modo experto
          </a>
          .
        </p>
      </div>
    )
  }

  const meta = TITLES[paso]!
  const sinVideo = course.lessons.filter((l) => l.lessonType === 'video' && !l.streamId).length

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <Link href="/app/sala" className="text-[13px] text-brand-link">
          ← Sala de profesores
        </Link>
        <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
          {course.status === 'published' ? 'Publicado' : 'Borrador — invisible para los alumnos'}
        </span>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <SalaSteps courseId={course.id} current={paso} />
        <h1 className="mb-1 text-xl font-bold">{meta.h}</h1>
        <p className="mb-6 text-sm text-muted">{meta.sub}</p>

        {paso === 1 && (
          <BasicsForm
            categories={(await getCategories()).map((c) => ({ id: Number(c.id), name: c.name }))}
            course={{
              id: course.id,
              title: course.title,
              description: course.description,
              categoryId: course.categoryId,
            }}
          />
        )}

        {paso === 2 && <CoverForm courseId={course.id} coverUrl={course.coverUrl} />}

        {paso === 3 && (
          <>
            <LessonsEditor courseId={course.id} lessons={course.lessons} />
            <div className="mt-6 border-t border-border-soft pt-4">
              <Link
                href={`/app/sala/${course.id}?paso=4`}
                className="rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
              >
                Revisar y publicar →
              </Link>
            </div>
          </>
        )}

        {paso === 4 && (
          <>
            <ul className="mb-6 flex flex-col gap-2 text-sm">
              <li>
                <span aria-hidden className="mr-2 font-bold text-success">
                  ✓
                </span>
                <strong>{course.title}</strong> · {course.description.slice(0, 90)}
                {course.description.length > 90 ? '…' : ''}
              </li>
              <li>
                <span
                  aria-hidden
                  className={`mr-2 font-bold ${course.categoryId ? 'text-success' : 'text-danger'}`}
                >
                  {course.categoryId ? '✓' : '✕'}
                </span>
                Área de conocimiento {course.categoryId ? 'asignada' : 'pendiente (paso 1)'}
              </li>
              <li>
                <span aria-hidden className="mr-2 font-bold text-success">
                  ✓
                </span>
                Portada {course.coverUrl ? 'propia' : 'automática del área'}
              </li>
              <li>
                <span
                  aria-hidden
                  className={`mr-2 font-bold ${course.lessons.length ? 'text-success' : 'text-danger'}`}
                >
                  {course.lessons.length ? '✓' : '✕'}
                </span>
                {course.lessons.length} {course.lessons.length === 1 ? 'lección' : 'lecciones'}
                {sinVideo > 0 && (
                  <span className="ml-2 text-[13px] text-accent-ink">
                    ({sinVideo} de vídeo aún sin su vídeo — se puede publicar igualmente y añadirlos
                    después)
                  </span>
                )}
              </li>
            </ul>
            <PublishPanel courseId={course.id} status={course.status} slug={course.slug} />
          </>
        )}
      </div>
    </div>
  )
}
