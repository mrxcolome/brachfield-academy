import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Portrait, Avatar } from '@/components/art'
import {
  aboutPere,
  creditProcess,
  faqs,
  knowledgeAreas,
  personas,
  sampleTools,
  trainingAreas,
  whatsInside,
  pricingIncludes,
} from '@/features/content/catalog'

export const metadata: Metadata = {
  description:
    'Todo el conocimiento que necesitas para gestionar mejor el crédito a clientes, prevenir impagos y cobrar a tiempo, de la mano de Pere Brachfield. 39 €/mes, cancela cuando quieras.',
  alternates: { canonical: '/' },
}

function Section({
  id,
  className = '',
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">{children}</div>
    </section>
  )
}

export default function LandingPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-block rounded-full bg-surface px-3.5 py-1.5 text-xs font-semibold text-brand-link">
              Por Pere Brachfield · Credit &amp; Risk Consultants desde 1990
            </p>
            <h1 className="mb-4 text-2xl leading-[1.2] font-bold tracking-tight sm:text-4xl sm:leading-[1.15]">
              Aprende a prevenir impagos.
              <br />
              Gestiona mejor el crédito.
              <br />
              Cobra lo que te deben.
            </h1>
            <p className="mb-3 text-[17px] leading-relaxed text-ink-2">
              Todo el conocimiento que necesitas para gestionar mejor el crédito a clientes,
              prevenir impagos y cobrar a tiempo.
            </p>
            <p className="mb-7 text-sm leading-relaxed text-ink-3">
              Microlearning, cursos, herramientas y píldoras prácticas para prevenir la morosidad,
              gestionar el crédito comercial, negociar con deudores y recuperar impagados, tanto por
              vía extrajudicial como judicial, de la mano de Pere Brachfield.
            </p>
            <div className="mb-4 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-md bg-brand px-5 py-3.5 text-[15px] font-semibold text-white no-underline hover:bg-brand-hover"
              >
                Acceder a Brachfield Academy
              </Link>
              <Link
                href="/courses"
                className="rounded-md border border-border-chip px-5 py-3.5 text-[15px] font-semibold text-brand no-underline hover:bg-surface"
              >
                Explorar contenidos
              </Link>
            </div>
            <p className="font-mono text-[13px] text-ink-2">39 €/mes · Cancela cuando quieras</p>
          </div>
          <Image
            src="/landing/hero.webp"
            alt="Director financiero revisando indicadores de crédito en su oficina"
            width={1200}
            height={900}
            priority
            className="rounded-xl object-cover"
            style={{ aspectRatio: '4 / 3' }}
          />
        </div>
      </section>

      {/* El ciclo completo del crédito */}
      <Section className="bg-bg">
        <h2 className="mb-2 text-2xl font-bold">El proceso del credit management</h2>
        <p className="mb-6 text-sm leading-relaxed text-ink-3">
          Una escuela especializada en todo el ciclo de vida del crédito comercial B2B, de la
          concesión a la recuperación.
        </p>
        <ol className="mb-7 flex flex-wrap items-center gap-y-2.5">
          {creditProcess.map((step, i) => (
            <li key={step} className="flex items-center">
              <span className="rounded-full border border-border-chip bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink-2">
                {step}
              </span>
              {i < creditProcess.length - 1 && (
                <span aria-hidden className="px-1.5 text-brand-link">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="text-sm leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">Formación en:</span> {trainingAreas.join(' · ')}
        </p>
        <p className="mt-1.5 text-sm text-ink-3">
          Con el conocimiento y la experiencia de Pere Brachfield.
        </p>
      </Section>

      {/* Qué encontrarás dentro */}
      <Section id="membresia" className="bg-surface">
        <h2 className="mb-2 text-2xl font-bold">Qué encontrarás dentro</h2>
        <p className="mb-7 text-sm leading-relaxed text-ink-3">
          Diez formatos pensados para distintos momentos: desde una lectura de cinco minutos hasta
          un curso completo, siempre con el mismo criterio: practicidad.
        </p>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {whatsInside.map((w) => (
            <div
              key={w.l}
              className="overflow-hidden rounded-lg border border-border-soft bg-surface"
            >
              <Image
                src={w.img}
                alt=""
                width={800}
                height={450}
                className="w-full object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <div className="p-3.5">
                <p className="text-[13.5px] font-semibold">
                  <span aria-hidden className="mr-1.5 text-brand-link">
                    {w.g}
                  </span>
                  {w.l}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-3">{w.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Áreas de conocimiento */}
      <Section className="bg-bg">
        <h2 className="mb-2 text-2xl font-bold">Áreas de conocimiento</h2>
        <p className="mb-7 text-sm leading-relaxed text-ink-3">
          Ocho grandes áreas que cubren el ciclo completo del crédito comercial: de la concesión y
          la prevención a la reclamación judicial, pasando por la organización del propio
          departamento.
        </p>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {knowledgeAreas.map((a) => (
            <div
              key={a.l}
              className="overflow-hidden rounded-lg border border-border-soft bg-surface"
            >
              <Image
                src={a.img}
                alt=""
                width={800}
                height={450}
                className="w-full object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <div className="p-3.5">
                <p className="text-sm font-semibold">{a.l}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-3">{a.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Vista previa */}
      <Section className="bg-surface">
        <h2 className="mb-1.5 text-2xl font-bold">Así se ve por dentro</h2>
        <p className="mb-6 text-sm text-muted">
          Tu formación, tus herramientas y la actualidad del sector, siempre a mano.
        </p>
        {/* Captura real del producto con datos de demostración. */}
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <Image
            src="/landing/dashboard.webp"
            alt="Panel de inicio de la zona de alumnos: curso en progreso y recomendaciones personalizadas"
            width={2000}
            height={875}
            className="w-full"
          />
        </div>
      </Section>

      {/* Formación práctica + contenido nuevo */}
      <section className="border-y border-border-soft bg-surface">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 sm:divide-x sm:divide-border-soft">
          <div className="bg-surface p-8 sm:p-12">
            <h3 className="mb-3 text-xl font-bold">Formación práctica, no solo teoría</h3>
            <p className="text-sm leading-relaxed text-ink-3">
              El objetivo no es acumular conocimiento, sino resolver situaciones reales: qué decir a
              un cliente que no paga, cuándo escalar una reclamación, cómo estructurar tu política
              de crédito.
            </p>
          </div>
          <div className="bg-surface p-8 sm:p-12">
            <h3 className="mb-3 text-xl font-bold">Contenido nuevo cada semana</h3>
            <p className="text-sm leading-relaxed text-ink-3">
              La morosidad y la legislación cambian constantemente. Brachfield Academy se actualiza
              para que tú no tengas que estar pendiente de todo.
            </p>
          </div>
        </div>
      </section>

      {/* Sesiones en directo */}
      <Section className="bg-brand-soft">
        <h2 className="mb-6 text-2xl font-bold">Sesiones en directo con Pere Brachfield</h2>
        <div className="flex max-w-xl flex-wrap items-center gap-4 rounded-lg bg-surface p-5">
          <Avatar size={56} />
          <div className="min-w-52 flex-1">
            <p className="text-[15px] font-semibold">
              Masterclass: reclamar una deuda sin deteriorar la relación comercial
            </p>
            <p className="mt-1 font-mono text-xs text-muted">18 septiembre · 17:00 · 75 min</p>
          </div>
          <Link
            href="/signup"
            className="rounded-sm bg-brand px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap text-white no-underline hover:bg-brand-hover"
          >
            Reservar plaza
          </Link>
        </div>
      </Section>

      {/* Recursos */}
      <Section className="bg-surface">
        <h2 className="mb-2 text-2xl font-bold">Recursos que usarás mañana mismo</h2>
        <p className="mb-7 text-sm leading-relaxed text-ink-3">
          Plantillas y documentos editables, listos para adaptar a tu empresa sin empezar de cero.
        </p>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {sampleTools.map((t) => (
            <div key={t.l} className="overflow-hidden rounded-lg border border-border-soft">
              <Image
                src={t.img}
                alt=""
                width={800}
                height={450}
                className="w-full object-cover"
                style={{ aspectRatio: '16/9' }}
              />
              <div className="p-3.5">
                <p className="font-mono text-[10.5px] font-semibold text-muted">▦ PLANTILLA</p>
                <p className="mt-1.5 text-sm leading-snug font-semibold">{t.l}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-3">{t.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Sobre Pere */}
      <Section id="sobre-pere" className="bg-bg">
        <div className="grid items-start gap-8 sm:grid-cols-[200px_1fr]">
          <Portrait className="max-w-50 rounded-xl" style={{ aspectRatio: '1' }} />
          <div>
            <h2 className="mb-3 text-2xl font-bold">Sobre Pere Brachfield</h2>
            <div className="space-y-3">
              {aboutPere.long.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-ink-3">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Para quién es */}
      <Section className="bg-surface">
        <h2 className="mb-2 text-2xl font-bold">Para quién es</h2>
        <p className="mb-6 text-sm leading-relaxed text-ink-3">
          Pensado para quien gestiona el crédito, el riesgo o el cobro en su empresa, no para el
          público general.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {personas.map((p) => (
            <span
              key={p}
              className="rounded-full bg-brand-soft px-4 py-2 text-[13.5px] font-semibold text-brand"
            >
              {p}
            </span>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <section id="precio" className="bg-surface-dark text-center text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="mb-2 text-2xl font-bold">Un único plan. Todo incluido.</h2>
          <p className="mb-7 text-sm text-on-dark-muted">Sin niveles, sin letra pequeña.</p>
          <div className="mx-auto max-w-sm rounded-xl bg-surface-dark-2 p-8 text-left">
            <p className="mb-1.5 text-center text-sm font-semibold text-on-dark">
              Plan Profesional
            </p>
            <p className="text-center text-4xl font-bold">
              39 €<span className="text-base font-medium text-on-dark-muted">/mes</span>
            </p>
            <p className="mt-1 mb-6 text-center font-mono text-xs text-on-dark-muted">
              IVA incluido · facturación mensual
            </p>
            <ul className="mb-7 flex list-none flex-col gap-2.5 p-0 text-sm text-on-dark">
              {pricingIncludes.map((item) => (
                <li key={item} className="flex gap-2.5 leading-snug">
                  <span aria-hidden className="text-success">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block rounded-md bg-accent px-4 py-3 text-center text-sm font-bold text-accent-ink no-underline hover:opacity-90"
            >
              Acceder a Brachfield Academy
            </Link>
            <p className="mt-3 text-center font-mono text-xs text-on-dark-muted">
              Sin permanencia · cancela cuando quieras
            </p>
          </div>
          <p className="mt-7 text-sm text-on-dark-muted">
            ¿Formación para tu equipo? Brachfield Academy for Teams — próximamente.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <Section className="bg-surface">
        <h2 className="mb-5 text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="max-w-2xl">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-border-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium">
                {f.q}
                <span aria-hidden className="text-faint group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-ink-3">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA final */}
      <Section className="bg-bg">
        <div className="text-center">
          <h2 className="mb-3 text-2xl font-bold">Empieza hoy a cobrar mejor</h2>
          <p className="mb-6 text-sm text-muted">
            Todo el conocimiento de Pere Brachfield sobre crédito, morosidad y recobro, en una sola
            plataforma.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-md bg-brand px-6 py-3.5 text-[15px] font-semibold text-white no-underline hover:bg-brand-hover"
          >
            Acceder a Brachfield Academy
          </Link>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  )
}
