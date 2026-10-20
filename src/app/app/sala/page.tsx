import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { listSalaContents, listSalaCourses, SALA_CONCEPTS } from '@/features/sala/service'
import { BorrarButton } from './delete-button'

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
        <Link
          href="/app"
          className="mb-3 inline-block text-[13px] font-semibold text-muted no-underline hover:text-ink"
        >
          ← Volver a la academia
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold">Sala de profesores</h1>
          <Link
            href="/app/admin"
            className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
          >
            ⚙ Administración →
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted">
          Crea y publica paso a paso, sin tocar el CMS. Seis tipologías: el curso y cinco piezas
          sueltas (consejo, artículo, guía, checklist y plantilla).
        </p>
      </header>

      {/* Un botón por tipología (pedido del propietario 21/10/2026): directo al asistente. */}
      <section aria-labelledby="crear-title" className="mb-10">
        <h2 id="crear-title" className="mb-3 text-[15px] font-bold">
          ¿Qué quieres crear?
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            {
              href: '/app/sala/nuevo',
              glyph: '▣',
              label: 'Curso',
              hint: 'Un tema completo, en lecciones',
            },
            ...SALA_CONCEPTS.map((c) => ({
              href: `/app/sala/contenido/nuevo?tipo=${c.value}`,
              glyph: c.glyph,
              label: c.label,
              hint: c.hint,
            })),
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 text-inherit no-underline transition-colors hover:border-brand-link hover:bg-brand-soft"
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-brand">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-link"
                >
                  {t.glyph}
                </span>
                + {t.label}
              </span>
              <span className="text-[12px] leading-snug text-muted">{t.hint}</span>
            </Link>
          ))}
        </div>
      </section>

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
                  <p className="font-semibold">
                    {c.title.trim() || <span className="text-muted">(Sin título)</span>}
                  </p>
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
                    {c.status === 'draft' ? 'Continuar' : 'Editar'}
                  </Link>
                )}
                <BorrarButton kind="curso" id={c.id} title={c.title} />
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
                  <p className="font-semibold">
                    {p.title.trim() || <span className="text-muted">(Sin título)</span>}
                  </p>
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
                  {p.status === 'draft' ? 'Continuar' : 'Editar'}
                </Link>
                <BorrarButton kind="pieza" id={p.id} title={p.title} />
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
