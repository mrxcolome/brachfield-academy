import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { courses, getCourse } from '@/features/content/catalog'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug)
  if (!course) return {}
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/courses/${course.slug}` },
  }
}

export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).slug)
  if (!course) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    inLanguage: 'es',
    provider: {
      '@type': 'Organization',
      name: 'Brachfield Academy',
      sameAs: 'https://perebrachfield.com',
    },
    offers: { '@type': 'Offer', price: '39', priceCurrency: 'EUR', category: 'Subscription' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${course.duration.replace('h ', 'H').replace('min', 'M').replace(' ', '')}`,
    },
  }

  return (
    <main className="bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="mb-2.5 font-mono text-[11px] tracking-wide text-muted uppercase">
            Curso · {course.duration}
          </p>
          <h1 className="mb-4 text-3xl leading-tight font-bold">{course.title}</h1>
          <p className="mb-6 max-w-xl text-[15px] leading-relaxed text-ink-3">
            {course.description}
          </p>

          <h2 className="mb-2.5 text-sm font-semibold">Qué aprenderás</h2>
          <ul className="mb-7 max-w-xl list-disc pl-5 text-sm leading-loose text-ink-2">
            {course.learn.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>

          <h2 className="mb-3 text-sm font-semibold">
            Contenido del curso · {course.lessons} lecciones
          </h2>
          <div className="flex max-w-xl flex-col gap-3">
            {course.modules.map((m) => (
              <div key={m.name} className="rounded-md border border-border-soft p-4">
                <p className="mb-2 text-[13px] font-semibold">{m.name}</p>
                {m.lessons.map((l) => (
                  <p key={l} className="flex gap-2 py-1 text-[13.5px] text-muted">
                    <span aria-hidden>🔒</span>
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside>
          <Image
            src={course.img}
            alt=""
            width={800}
            height={500}
            className="mb-4 w-full rounded-xl object-cover"
            style={{ aspectRatio: '16/10' }}
          />
          <div className="rounded-xl border border-border p-5 text-center">
            <p className="mb-1 text-[13px] text-muted">Incluido en la membresía</p>
            <p className="mb-4 text-2xl font-bold">39 €/mes</p>
            <Link
              href="/signup"
              className="block rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
            >
              Hazte alumno de la Academy
            </Link>
            <p className="mt-2.5 font-mono text-[11.5px] text-muted-2">Cancela cuando quieras</p>
          </div>
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  )
}
