import { COMPANY, COMPANY_INCOMPLETE } from '@/features/legal/company'

/**
 * Maqueta común de las páginas legales: título, fecha de revisión y prosa.
 * El aviso de borrador solo aparece mientras COMPANY tenga datos [PENDIENTE].
 */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-[13px] text-muted">Última revisión: {COMPANY.updated}</p>
      {COMPANY_INCOMPLETE && (
        <p className="mt-4 rounded-md border border-border bg-brand-soft px-4 py-3 text-[13.5px] text-ink-2">
          Borrador pendiente de completar con los datos del titular y de revisión por un asesor
          legal.
        </p>
      )}
      <div className="legal-prose mt-8 space-y-4 text-[15px] leading-relaxed text-ink-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </main>
  )
}
