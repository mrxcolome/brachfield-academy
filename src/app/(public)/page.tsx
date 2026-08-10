import Link from 'next/link'
import type { Metadata } from 'next'
import { Cover, DashboardMock, Portrait, Avatar } from '@/components/art'
import {
  aboutPere,
  courses,
  faqs,
  knowledgeAreas,
  personas,
  sampleTools,
  whatsInside,
} from '@/features/content/catalog'

export const metadata: Metadata = {
  description:
    'Formación, herramientas y conocimiento especializado en Credit Management, prevención de impagos y recobro, de la mano de Pere Brachfield. 39 €/mes, cancela cuando quieras.',
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
            <h1 className="mb-4 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
              Domina el crédito.
              <br />
              Previene los impagos.
              <br />
              Cobra mejor.
            </h1>
            <p className="mb-7 max-w-md text-[17px] leading-relaxed text-ink-2">
              Formación, herramientas y conocimiento especializado en Credit Management y recobro de
              impagados, de la mano de Pere Brachfield.
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
          <Portrait className="rounded-xl" style={{ aspectRatio: '4 / 3' }} />
        </div>
      </section>

      {/* Qué encontrarás dentro */}
      <Section id="membresia" className="bg-surface">
        <h2 className="mb-6 text-2xl font-bold">Qué encontrarás dentro</h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {whatsInside.map((w) => (
            <div key={w.l} className="rounded-md border border-border-soft p-4 text-center">
              <div aria-hidden className="mb-2 text-xl text-brand-link">
                {w.g}
              </div>
              <div className="text-[13.5px] font-semibold">{w.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Áreas de conocimiento */}
      <Section className="bg-bg">
        <h2 className="mb-6 text-2xl font-bold">Áreas de conocimiento</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {knowledgeAreas.map((a) => (
            <div
              key={a}
              className="rounded-md border border-border-soft bg-surface px-4 py-4 text-sm font-semibold"
            >
              {a}
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
        <DashboardMock style={{ aspectRatio: '16/7' }} />
      </Section>

      {/* Formación práctica + contenido nuevo */}
      <section className="bg-border-soft">
        <div className="mx-auto grid max-w-6xl gap-px sm:grid-cols-2">
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
        <h2 className="mb-6 text-2xl font-bold">Recursos que usarás mañana mismo</h2>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {sampleTools.map((t) => (
            <div key={t} className="rounded-md border border-border-soft p-4">
              <p className="font-mono text-[11px] font-semibold text-muted">▦ PLANTILLA</p>
              <p className="mt-2 text-sm font-semibold">{t}</p>
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
            <p className="max-w-2xl text-sm leading-relaxed text-ink-3">{aboutPere.long}</p>
          </div>
        </div>
      </Section>

      {/* Para quién es */}
      <Section className="bg-surface">
        <h2 className="mb-5 text-2xl font-bold">Para quién es</h2>
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

      {/* Cursos destacados */}
      <Section className="bg-bg">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold">Cursos</h2>
          <Link href="/courses" className="text-sm font-semibold">
            Ver catálogo →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
            >
              <Cover title={c.title} kind="curso" style={{ aspectRatio: '16/10' }} />
              <div className="p-4">
                <p className="mb-1.5 text-sm leading-snug font-semibold">{c.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  CURSO · {c.duration} · {c.level}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <section className="bg-surface-dark text-center text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="mb-2 text-2xl font-bold">Un único plan. Todo incluido.</h2>
          <p className="mb-7 text-sm text-on-dark-muted">Sin niveles, sin letra pequeña.</p>
          <div className="mx-auto max-w-xs rounded-xl bg-surface-dark-2 p-8">
            <p className="mb-1.5 text-sm font-semibold text-on-dark">Plan Profesional</p>
            <p className="text-4xl font-bold">
              39 €<span className="text-base font-medium text-on-dark-muted">/mes</span>
            </p>
            <p className="mt-1 mb-5 font-mono text-xs text-on-dark-muted">Cancela cuando quieras</p>
            <Link
              href="/signup"
              className="block rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-ink no-underline hover:opacity-90"
            >
              Acceder a Brachfield Academy
            </Link>
          </div>
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
          <p className="mx-auto mb-6 max-w-md text-sm text-muted">
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
