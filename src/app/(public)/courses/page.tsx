import Link from 'next/link'
import type { Metadata } from 'next'
import { Cover } from '@/components/art'
import { courses, knowledgeAreas } from '@/features/content/catalog'

export const metadata: Metadata = {
  title: 'Cursos de Credit Management, impagos y recobro',
  description:
    'Catálogo de formación de Brachfield Academy: prevención de impagos, recobro de deudas, negociación con morosos, análisis de riesgo y marco legal de la morosidad.',
  alternates: { canonical: '/courses' },
}

export default function CoursesPage() {
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
        <h1 className="mb-2 text-3xl font-bold">Explora todo el conocimiento</h1>
        <p className="mb-6 text-sm text-muted">
          Vista previa pública del catálogo. Suscríbete para acceder al contenido completo.
        </p>
        <div className="mb-8 flex flex-wrap gap-2.5">
          {knowledgeAreas.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border-chip px-3.5 py-2 text-[13px] font-medium text-ink-2"
            >
              {a}
            </span>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="relative overflow-hidden rounded-lg border border-border text-inherit no-underline"
            >
              <Cover title={c.title} kind="curso" style={{ aspectRatio: '16/10' }} />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[11px] font-semibold">
                🔒 Premium
              </span>
              <div className="p-4">
                <p className="mb-1.5 text-[14.5px] leading-snug font-semibold">{c.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  CURSO · {c.duration} · {c.level}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
