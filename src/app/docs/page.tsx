import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { DOCS } from '@/features/docs/catalog'
import { BrandLogo } from '@/components/brand/logo'

export const metadata = { title: 'Documentación', robots: { index: false, follow: false } }

/** Portada de la documentación interna: un resumen de cada documento (pedido del propietario 21/10/2026). */
export default async function DocsHomePage() {
  await requireRole('ADMIN', 'EDITOR')

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <BrandLogo height={28} />
          <Link href="/app" className="text-[13px] font-semibold text-brand-link no-underline">
            Ir a la academia →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="mb-2 font-mono text-[11px] tracking-wide text-accent-strong uppercase">
          Documentación interna · solo para el equipo
        </p>
        <h1 className="mb-2 text-2xl font-bold text-brand">Documentación del proyecto</h1>
        <p className="mb-8 text-sm text-ink-2">
          Todo lo que hay que saber de Brachfield Academy, en cinco documentos. Empieza por
          «Descubre la Academy» si llegas nuevo; si vas a publicar, el «Manual del editor».
        </p>
        <ol className="grid gap-4 sm:grid-cols-2">
          {DOCS.map((d, i) => (
            <li key={d.slug}>
              <a
                href={d.href}
                className="flex h-full flex-col gap-2 rounded-lg border border-border bg-surface p-5 text-inherit no-underline transition-colors hover:border-brand-link"
              >
                <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                  {String(i + 1).padStart(2, '0')} · {d.audience}
                </span>
                <span className="text-lg font-bold text-brand">{d.title}</span>
                <span className="text-sm leading-relaxed text-ink-2">{d.summary}</span>
                <span className="mt-auto pt-2 text-[13px] font-semibold text-brand-link">
                  Abrir →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}
