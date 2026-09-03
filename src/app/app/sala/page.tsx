import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { listSalaCourses } from '@/features/sala/service'

export const metadata = { title: 'Sala de profesores' }

const dateFmt = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: 'Europe/Madrid',
})

export default async function SalaHomePage() {
  await requireRole('ADMIN', 'EDITOR')
  const courses = await listSalaCourses()
  const drafts = courses.filter((c) => c.status === 'draft')

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Sala de profesores</h1>
        <p className="mt-1 text-sm text-muted">
          Crea y publica cursos paso a paso, sin tocar el CMS. Lo que publiques aquí aparece al
          instante para los alumnos.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link
          href="/app/sala/nuevo"
          className="rounded-sm bg-brand px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
        >
          + Crear un curso
        </Link>
        {drafts.length > 0 && (
          <span className="text-[13px] text-muted">
            Tienes {drafts.length} {drafts.length === 1 ? 'borrador' : 'borradores'} sin publicar.
          </span>
        )}
      </div>

      {courses.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
          Todavía no hay cursos. El primero está a cuatro pasos.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {courses.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface p-4"
            >
              <div className="min-w-52 flex-1">
                <p className="font-semibold">{c.title}</p>
                <p className="text-[12.5px] text-muted">
                  {c.lessons.length} {c.lessons.length === 1 ? 'lección' : 'lecciones'} ·
                  actualizado {dateFmt.format(new Date(c.updatedAt))}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wide uppercase ${
                  c.status === 'published'
                    ? 'bg-brand-soft text-brand-link'
                    : 'border border-border-input text-muted'
                }`}
              >
                {c.status === 'published' ? 'Publicado' : 'Borrador'}
              </span>
              {c.multiModule ? (
                <span className="text-[12px] text-muted">
                  Curso con módulos — se edita en el CMS (la Sala lo cubrirá en la fase 2)
                </span>
              ) : (
                <Link
                  href={`/app/sala/${c.id}`}
                  className="rounded-sm border border-border-input px-4 py-2 text-[13px] font-semibold text-ink no-underline hover:bg-bg"
                >
                  {c.status === 'draft' ? 'Continuar' : 'Abrir'}
                </Link>
              )}
            </li>
          ))}
        </ol>
      )}

      <p className="mt-8 text-[12.5px] text-muted">
        ¿Necesitas algo que la Sala aún no hace (tags, SEO, publicación programada)? Está en el{' '}
        <a href="/admin" target="_blank" rel="noreferrer">
          modo experto (CMS)
        </a>
        .
      </p>
    </div>
  )
}
