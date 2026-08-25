import Link from 'next/link'
import type { Metadata } from 'next'
import { pricingIncludes } from '@/features/content/catalog'

export const metadata: Metadata = {
  title: 'Precio',
  description:
    'Plan Profesional: 39 €/mes con acceso completo a cursos, herramientas, eventos en directo y toda la biblioteca de Credit Management. Sin permanencia.',
  alternates: { canonical: '/pricing' },
}

export default function PricingPage() {
  return (
    <main className="bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:py-20">
        <h1 className="mb-2 text-3xl font-bold">Un plan. Sin sorpresas.</h1>
        <p className="mx-auto mb-10 max-w-lg text-[15px] text-muted">
          Acceso completo a la biblioteca, cursos, herramientas y sesiones en directo con Pere
          Brachfield.
        </p>
        <div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-9 text-left shadow-sm">
          <p className="mb-2 text-sm font-semibold text-brand-link">Plan Profesional</p>
          <p className="text-[44px] leading-none font-bold">
            39 €<span className="text-base font-medium text-muted">/mes</span>
          </p>
          <p className="mt-2 mb-6 font-mono text-xs text-muted">
            IVA incluido · facturación mensual
          </p>
          <ul className="mb-7 flex flex-col gap-2.5">
            {pricingIncludes.map((item) => (
              <li key={item} className="flex gap-2 text-[13.5px]">
                <span aria-hidden className="text-success">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block rounded-md bg-brand px-4 py-3.5 text-center text-sm font-semibold text-white no-underline hover:bg-brand-hover"
          >
            Hazte alumno de la Academy
          </Link>
          <p className="mt-3 text-center font-mono text-[11.5px] text-muted-2">
            Sin permanencia · cancela cuando quieras
          </p>
        </div>
        <p className="mt-8 text-[13px] text-muted">
          ¿Formación para tu equipo? Brachfield Academy for Teams — próximamente.
        </p>
      </div>
    </main>
  )
}
