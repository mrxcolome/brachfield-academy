import Link from 'next/link'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Portrait } from '@/components/art'
import { getSectorNews } from '@/features/sector-news/service'
import { NewsImage } from '@/components/product/news-image'
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

// ISR: la landing enseña las noticias reales del tablón — se regenera cada
// hora para estar siempre «viva» sin perder el servido estático.
export const revalidate = 3600

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

// La retícula jerárquica de formatos (la misma jerarquía que Explorar,
// aprobada por el propietario): Cursos grande, 4 medianas, 4 compactas.
// «Actualidad» sale de aquí — las noticias tienen su propia sección abajo.
const formatByLabel = Object.fromEntries(whatsInside.map((w) => [w.l, w]))
const HERO_FORMAT = formatByLabel['Cursos']!
const MEDIUM_FORMATS = ['Consejos', 'Artículos', 'Entrevistas', 'Sesiones en directo'].map(
  (l) => formatByLabel[l]!,
)
const COMPACT_FORMATS = ['Guías', 'Checklists', 'Plantillas', 'Casos prácticos'].map(
  (l) => formatByLabel[l]!,
)

const PERE_STATS = [
  { n: '+35', d: 'años de experiencia en morosidad y crédito' },
  { n: '32', d: 'libros publicados sobre la materia' },
  { n: 'Cientos', d: 'de empresas y profesionales formados' },
  { n: '1990', d: 'fundación de Brachfield Credit & Risk Consultants' },
]

// Títulos reales de Pere (perebrachfield.com/consultoria y Amazon; el
// propietario pasó capturas el 10/09). Tarjetas tipográficas tipo lomo —
// si algún día llegan las portadas en buena resolución, se sustituyen.
const PERE_BOOKS = [
  { t: 'Jaque a los impagados', e: 'Gestión 2000', c: 'bg-brand' },
  { t: 'La lucha contra la morosidad', e: 'Gestión 2000', c: 'bg-garnet' },
  {
    t: 'Credit Management: cómo conceder créditos y evitar los impagos',
    e: 'Profit Editorial',
    c: 'bg-accent',
  },
  { t: 'Guía práctica para el recobro de deudas', e: 'FC Editorial', c: 'bg-brand' },
  { t: 'Instrumentos para gestionar y cobrar impagados', e: 'Profit Editorial', c: 'bg-garnet' },
  { t: 'Tratamiento legal de los impagados', e: 'Atelier Libros Jurídicos', c: 'bg-accent' },
]

// Testimonios: datos de EJEMPLO (10/09). Encendidos por decisión del
// propietario MIENTRAS la academia está en prelanzamiento (PRELAUNCH=true,
// sin indexar): es la maqueta para que Pere recoja 3 citas reales.
// ⚠️ ANTES DE ABRIR: sustituir por testimonios reales con permiso o poner
// false — reseñas inventadas en una web comercial abierta son competencia
// desleal. Ítem añadido a docs/LAUNCH_CHECKLIST.md.
const TESTIMONIALS_LIVE = true
const TESTIMONIALS = [
  {
    quote:
      'Aplicando el método de Pere redujimos los cobros pendientes de más de 90 días a menos de la mitad en un año. Es formación que se paga sola.',
    name: 'Carlos Serra',
    role: 'Credit Manager en Netprocess',
  },
  {
    quote:
      'Por fin alguien que explica la reclamación de deudas en lenguaje de empresa, no de abogado. Las plantillas las usamos tal cual.',
    name: 'Clara Vedruna',
    role: 'Directora Financiera en Grupo Sastres',
  },
  {
    quote:
      'Llevo 20 años cobrando facturas y aun así cada sesión con Pere me llevo algo nuevo. Su experiencia con morosos no está en ningún manual.',
    name: 'Jose Ignacio Ramirez',
    role: 'Responsable de Cobros en Cocisa',
  },
]

const newsDateFmt = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Madrid',
})

export default async function LandingPage() {
  // Las 3 últimas noticias del tablón real (si aún no hay, la sección se oculta)
  const news = (await getSectorNews(3).catch(() => [])).filter((n) => n.topic)

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
        {/* En móvil el hero se edita, no se encoge: imagen arriba, menos texto
            (decisión del propietario, 2026-08-20). */}
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-8 sm:gap-10 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 hidden rounded-full bg-surface px-3.5 py-1.5 text-xs font-semibold text-brand-link sm:inline-block">
              Por Pere Brachfield · Credit &amp; Risk Consultants desde 1990
            </p>
            <h1 className="mb-4 text-[25px] leading-[1.2] font-bold tracking-tight sm:text-4xl sm:leading-[1.15]">
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
            <p className="mb-7 hidden text-sm leading-relaxed text-ink-3 sm:block">
              Microlearning, cursos, herramientas y consejos prácticos para prevenir la morosidad,
              gestionar el crédito comercial, negociar con deudores y recuperar impagados, tanto por
              vía extrajudicial como judicial, de la mano de Pere Brachfield.
            </p>
            <div className="mb-4 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-md bg-brand px-5 py-3.5 text-[15px] font-semibold text-white no-underline hover:bg-brand-hover"
              >
                Quiero ser alumno
              </Link>
              <Link
                href="/courses"
                className="rounded-md border border-border-chip px-5 py-3.5 text-[15px] font-semibold text-brand no-underline hover:bg-surface"
              >
                Explorar cursos
              </Link>
            </div>
            <p className="font-mono text-[13px] text-ink-2">39 €/mes · Cancela cuando quieras</p>
          </div>
          <Image
            src="/landing/pere-hero.webp"
            alt="Pere Brachfield, fundador de Brachfield Academy"
            width={1200}
            height={1200}
            priority
            className="order-first aspect-[2/1] w-full rounded-xl object-cover object-top lg:order-none lg:aspect-square"
          />
        </div>
      </section>

      {/* La autoridad de Pere, en cifras (prueba social mínima y real).
          Banda navy con números en el naranja del logo — v2 tras el feedback
          del propietario («muy pobre a nivel visual»). */}
      <section className="bg-surface-dark text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 text-center sm:grid-cols-4 sm:divide-x sm:divide-white/10">
          {PERE_STATS.map((s) => (
            <div key={s.d} className="px-4">
              <p className="text-3xl font-bold text-accent sm:text-4xl">{s.n}</p>
              <p className="mx-auto mt-2 max-w-44 text-xs leading-snug text-on-dark-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* El ciclo completo del crédito */}
      <Section className="bg-bg">
        <h2 className="mb-2 text-2xl font-bold">El proceso del credit management</h2>
        <p className="mb-6 text-sm leading-relaxed text-ink-3">
          Una escuela especializada en todo el ciclo de vida del crédito comercial B2B, de la
          concesión a la recuperación.
        </p>
        {/* Pasos numerados (decisión del propietario 10/09: los chips con
            flechas eran demasiado pequeños para leerse como proceso) */}
        <ol className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {creditProcess.map((step, i) => (
            <li key={step} className="rounded-lg border border-border-soft bg-surface p-3.5">
              {/* Granate: acento puntual de la paleta (el color del logo). */}
              <p className="font-mono text-[11px] font-bold text-garnet">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-1 text-[13px] leading-snug font-semibold text-ink-2">{step}</p>
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

      {/* Qué encontrarás dentro — la misma retícula jerárquica que Explorar */}
      <Section id="membresia" className="bg-surface">
        <h2 className="mb-2 text-2xl font-bold">Qué encontrarás dentro</h2>
        <p className="mb-7 text-sm leading-relaxed text-ink-3">
          Nueve formatos para distintos momentos — desde una lectura de cinco minutos hasta un curso
          completo — con los cursos como columna vertebral. Siempre con el mismo criterio:
          practicidad.
        </p>
        <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col overflow-hidden rounded-lg border border-border-soft bg-surface sm:col-span-2 lg:row-span-2">
            <div className="relative aspect-video w-full lg:aspect-auto lg:min-h-0 lg:flex-1">
              <Image
                src={HERO_FORMAT.img}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1.5 p-5">
              <p className="text-lg font-bold text-brand">Cursos</p>
              <p className="text-[13.5px] font-semibold text-ink-2">
                «Aprende un tema completo» — con lecciones y tu progreso guardado
              </p>
              <p className="text-[12.5px] leading-relaxed text-muted">{HERO_FORMAT.d}</p>
            </div>
          </div>
          {MEDIUM_FORMATS.map((w) => (
            <div
              key={w.l}
              className="flex flex-col overflow-hidden rounded-lg border border-border-soft bg-surface"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={w.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 250px"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="mb-0.5 text-[13px] font-bold text-brand">{w.l}</p>
                <p className="text-[11.5px] leading-snug text-muted">{w.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {COMPACT_FORMATS.map((w) => (
            <div key={w.l} className="rounded-lg border border-border-soft bg-surface p-4">
              <p className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-[15px] text-brand">
                <span aria-hidden>{w.g}</span>
              </p>
              <p className="mt-2 text-sm font-bold text-brand">{w.l}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-3">{w.d}</p>
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
        {/* Móvil: checklist de áreas, sin tarjetas (regla móvil del propietario) */}
        <ul className="flex flex-col gap-2.5 sm:hidden">
          {knowledgeAreas.map((a) => (
            <li key={a.l} className="flex gap-2.5 text-sm leading-snug font-semibold text-ink-2">
              <span aria-hidden className="font-bold text-garnet">
                ✓
              </span>
              {a.l}
            </li>
          ))}
        </ul>
        <div className="hidden grid-cols-2 gap-3.5 sm:grid lg:grid-cols-4">
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

      {/* Vista previa — solo desktop: la captura del dashboard no comunica
          nada a tamaño teléfono (regla móvil del propietario). */}
      <Section className="hidden bg-surface sm:block">
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

      {/* El sector, al día — noticias REALES del tablón: la prueba de que la
          academia está viva. Si aún no hay noticias, la sección no sale. */}
      {news.length > 0 && (
        <Section className="bg-bg">
          <h2 className="mb-2 text-2xl font-bold">El sector, al día</h2>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-3">
            Cada mañana, la academia destaca la noticia (o dos) de morosidad y crédito que de verdad
            afecta a quien gestiona el cobro — con la clave de por qué te importa. Esto es lo
            último:
          </p>
          <div className="grid gap-3.5 sm:grid-cols-3">
            {news.map((n) => (
              <a
                key={n.id}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col overflow-hidden rounded-lg border border-border-soft bg-surface text-inherit no-underline"
              >
                <NewsImage
                  src={n.imageUrl}
                  fallback="/landing/formato-actualizaciones.webp"
                  className="aspect-video w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-3.5">
                  <p className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand-link">
                      {n.topic}
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {n.source} · {newsDateFmt.format(n.publishedAt)}
                    </span>
                  </p>
                  <p className="text-sm leading-snug font-semibold">{n.title}</p>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-5 text-sm text-ink-3">
            Dentro de la academia, cada noticia llega con «la clave para ti» y el contenido
            relacionado para profundizar.{' '}
            <Link href="/signup" className="font-semibold text-brand-link">
              Quiero estar al día →
            </Link>
          </p>
        </Section>
      )}

      {/* Recursos — solo desktop (regla móvil del propietario) */}
      <Section className="hidden bg-surface sm:block">
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
        <div className="mt-10">
          <p className="mb-4 text-sm font-semibold text-ink-2">
            De sus 32 libros, algunos títulos de referencia:
          </p>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {PERE_BOOKS.map((b) => (
              <div
                key={b.t}
                className="flex min-h-36 flex-col overflow-hidden rounded-lg border border-border-soft bg-surface"
              >
                <span aria-hidden className={`h-1.5 w-full ${b.c}`} />
                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <p className="text-[13px] leading-snug font-bold">{b.t}</p>
                  <p className="mt-3 font-mono text-[10.5px] text-muted uppercase">{b.e}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink-3">
            Disponibles en las principales librerías y en Amazon.
          </p>
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

      {/* Testimonios (encendido controlado por TESTIMONIALS_LIVE) */}
      {TESTIMONIALS_LIVE && (
        <Section className="bg-brand-soft">
          <h2 className="mb-7 text-2xl font-bold">Lo que dicen quienes ya cobran mejor</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="m-0 flex flex-col justify-between rounded-lg border border-border-soft bg-surface p-5"
              >
                <blockquote className="m-0">
                  <span aria-hidden className="block text-3xl leading-none text-garnet">
                    “
                  </span>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{t.quote}</p>
                </blockquote>
                <figcaption className="mt-4">
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      )}

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
              className="block rounded-md bg-accent px-4 py-3 text-center text-sm font-bold text-brand no-underline hover:opacity-90"
            >
              Quiero ser alumno
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
            Quiero ser alumno
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
