import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { listSalaContents, listSalaCourses, SALA_CONCEPTS } from '@/features/sala/service'

export const metadata = { title: 'Sala de profesores' }

const dateFmt = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: 'Europe/Madrid',
})

function StatusPill({ status }: { status: 'draft' | 'published' }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-wide uppercase ${
        status === 'published'
          ? 'bg-brand-soft text-brand-link'
          : 'border border-border-input text-muted'
      }`}
    >
      {status === 'published' ? 'Publicado' : 'Borrador'}
    </span>
  )
}

export default async function SalaHomePage() {
  const { role } = await requireRole('ADMIN', 'EDITOR')
  const [courses, contents] = await Promise.all([listSalaCourses(), listSalaContents()])
  const conceptLabel = (v: string) => SALA_CONCEPTS.find((c) => c.value === v)?.label ?? v

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Sala de profesores</h1>
        <p className="mt-1 text-sm text-muted">
          Crea y publica paso a paso, sin tocar el CMS. Diez conceptos: el curso y las nueve piezas
          sueltas.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap items-center gap-3">
        <Link
          href="/app/sala/nuevo"
          className="rounded-sm bg-brand px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
        >
          + Crear un curso
        </Link>
        <Link
          href="/app/sala/contenido/nuevo"
          className="rounded-sm border border-brand px-5 py-3 text-sm font-semibold text-brand no-underline hover:bg-brand-soft"
        >
          + Crear una pieza
        </Link>
        <span className="text-[12.5px] text-muted">
          Pieza = tutorial, píldora, entrevista, guía, checklist, plantilla…
        </span>
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-[15px] font-bold">Cursos</h2>
        {courses.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
            Todavía no hay cursos.
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
                <StatusPill status={c.status} />
                {c.multiModule ? (
                  <span className="text-[12px] text-muted">
                    Con módulos — se edita en el CMS (fase 2)
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
      </section>

      <section>
        <h2 className="mb-3 text-[15px] font-bold">Piezas sueltas</h2>
        {contents.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
            Todavía no hay piezas. La primera está a cuatro pasos.
          </p>
        ) : (
          <ol className="flex flex-col gap-3">
            {contents.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface p-4"
              >
                <div className="min-w-52 flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-[12.5px] text-muted">
                    {conceptLabel(p.conceptType)} · actualizado{' '}
                    {dateFmt.format(new Date(p.updatedAt))}
                  </p>
                </div>
                <StatusPill status={p.status} />
                <Link
                  href={`/app/sala/contenido/${p.id}`}
                  className="rounded-sm border border-border-input px-4 py-2 text-[13px] font-semibold text-ink no-underline hover:bg-bg"
                >
                  {p.status === 'draft' ? 'Continuar' : 'Abrir'}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="mt-8 text-[12.5px] text-muted">
        ¿Algo que la Sala aún no hace (tags, SEO, publicación programada)?{' '}
        {role === 'ADMIN' ? (
          <>
            Está en el{' '}
            <a href="/admin" target="_blank" rel="noreferrer">
              modo experto (CMS)
            </a>
            .
          </>
        ) : (
          'Pídeselo al administrador.'
        )}
      </p>
    </div>
  )
}
