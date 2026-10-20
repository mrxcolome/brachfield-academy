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

const TYPES = [
  { value: 'CURSO', label: 'Cursos' },
  ...SALA_CONCEPTS.map((c) => ({
    value: c.value as string,
    label: c.value === 'CHECKLIST' ? 'Checklists' : `${c.label}s`,
  })),
]

export default async function SalaHomePage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { role } = await requireRole('ADMIN', 'EDITOR')
  const { tipo } = await searchParams
  const filtro = TYPES.some((t) => t.value === tipo) ? tipo : undefined
  const [courses, contents] = await Promise.all([listSalaCourses(), listSalaContents()])
  const conceptLabel = (v: string) => SALA_CONCEPTS.find((c) => c.value === v)?.label ?? v

  const all = [
    ...courses.map((c) => ({
      key: `curso-${c.id}`,
      kind: 'curso' as const,
      type: 'CURSO',
      id: c.id,
      title: c.title,
      status: c.status,
      updatedAt: c.updatedAt,
      meta: `Curso · ${c.lessons.length} ${c.lessons.length === 1 ? 'lección' : 'lecciones'}`,
      href: c.multiModule ? null : `/app/sala/${c.id}`,
    })),
    ...contents.map((p) => ({
      key: `pieza-${p.id}`,
      kind: 'pieza' as const,
      type: p.conceptType as string,
      id: p.id,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      meta: conceptLabel(p.conceptType),
      href: `/app/sala/contenido/${p.id}`,
    })),
  ].sort((x, y) => y.updatedAt.localeCompare(x.updatedAt))
  const items = filtro ? all.filter((it) => it.type === filtro) : all

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
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            <a
              href="/docs/manual-editor"
              className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
            >
              Manual del editor →
            </a>
            <Link
              href="/app/admin"
              className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
            >
              ⚙ Administración →
            </Link>
          </span>
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

      {/* Una sola lista con todo (pedido del propietario 21/10/2026), lo último primero. */}
      <section aria-labelledby="contenido-title">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="contenido-title" className="text-[15px] font-bold">
            Tu contenido
          </h2>
          <span className="text-[12.5px] text-muted">
            {items.length} {items.length === 1 ? 'elemento' : 'elementos'}
          </span>
        </div>
        {all.length > 0 && (
          <nav aria-label="Filtrar por tipo" className="mb-4 flex flex-wrap gap-2">
            {[{ value: '', label: 'Todo' }, ...TYPES].map((t) => {
              const active = (filtro ?? '') === t.value
              return (
                <Link
                  key={t.value || 'todo'}
                  href={t.value ? `/app/sala?tipo=${t.value}` : '/app/sala'}
                  aria-current={active ? 'true' : undefined}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold no-underline ${
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-border-chip bg-surface text-ink-2 hover:bg-bg'
                  }`}
                >
                  {t.label}
                </Link>
              )
            })}
          </nav>
        )}
        {items.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
            {all.length === 0
              ? 'Todavía no hay contenido. Elige arriba qué quieres crear: está a cuatro pasos.'
              : 'Nada de este tipo todavía.'}
          </p>
        ) : (
          <ol className="flex flex-col gap-3">
            {items.map((it) => (
              <li
                key={it.key}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface p-4"
              >
                <div className="min-w-52 flex-1">
                  <p className="font-semibold">
                    {it.title.trim() || <span className="text-muted">(Sin título)</span>}
                  </p>
                  <p className="text-[12.5px] text-muted">
                    {it.meta} · actualizado {dateFmt.format(new Date(it.updatedAt))}
                  </p>
                </div>
                <StatusPill status={it.status} />
                {it.href ? (
                  <Link
                    href={it.href}
                    className="rounded-sm border border-border-input px-4 py-2 text-[13px] font-semibold text-ink no-underline hover:bg-bg"
                  >
                    {it.status === 'draft' ? 'Continuar' : 'Editar'}
                  </Link>
                ) : (
                  <span className="text-[12px] text-muted">Con módulos — se edita en el CMS</span>
                )}
                <BorrarButton kind={it.kind} id={it.id} title={it.title} />
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
