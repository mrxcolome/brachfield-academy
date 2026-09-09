import Link from 'next/link'
import Image from 'next/image'
import type { Course } from '@/payload/payload-types'
import type { WelcomeState } from '@/features/welcome/service'
import type { ContinueLearning } from '@/features/learning/service'
import { COURSES_TILE, MEDIUM_TILES, COMPACT_TILES } from '@/features/content/tiles'
import { courseCover } from '@/features/content/covers'
import { WelcomeVideo } from '@/components/product/welcome/welcome-video'
import { SmartCover } from '@/components/product/smart-cover'
import { Progress } from '@/components/ui/progress'

/** El Inicio de primera visita (2026-09-09): bienvenida-escaparate. Se
 *  muestra hasta completar «Tus primeros pasos» o 14 días (rules.ts). */
export function WelcomeHome({
  firstName,
  welcome,
  firstCourse,
  continueLearning,
}: {
  firstName: string
  welcome: WelcomeState
  firstCourse: Course | null
  continueLearning: ContinueLearning | null
}) {
  const done = welcome.checklist.filter((i) => i.done).length
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Bienvenido, {firstName}</h1>
      <p className="mt-0.5 mb-6 text-sm text-muted">
        Ya eres alumno de la academia de Pere Brachfield: formación y herramientas para cobrar mejor
        y sufrir menos impagos. Empecemos.
      </p>

      <div className="mb-8 grid items-stretch gap-4 lg:grid-cols-[3fr_2fr]">
        <WelcomeVideo streamId={welcome.videoStreamId} />
        <section
          aria-labelledby="steps-title"
          className="rounded-lg border border-border bg-surface p-5"
        >
          <h2 id="steps-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            Tus primeros pasos
            <span className="ml-2 font-mono text-[11px] font-normal text-muted">
              {done} de {welcome.checklist.length}
            </span>
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {welcome.checklist.map((item, i) => (
              <li key={item.key} className="flex items-baseline gap-2.5">
                <span
                  aria-hidden
                  className={
                    item.done
                      ? 'flex h-5 w-5 flex-none translate-y-0.5 items-center justify-center rounded-full bg-success text-[11px] font-bold text-white'
                      : 'flex h-5 w-5 flex-none translate-y-0.5 items-center justify-center rounded-full border-[1.5px] border-border-input text-[11px] font-bold text-muted'
                  }
                >
                  {item.done ? '✓' : i + 1}
                </span>
                <span className="min-w-0">
                  {item.done ? (
                    <span className="block text-[13px] font-semibold text-muted line-through">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-[13px] font-semibold text-ink no-underline hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  )}
                  <span className="block text-[11.5px] text-muted">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="tiles-title" className="mb-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="tiles-title" className="text-[13px] font-semibold text-ink-2">
            Nueve maneras de ayudarte
          </h2>
          <Link
            href="/app/explore"
            className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
          >
            Explorar todo el catálogo →
          </Link>
        </div>
        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Link
            href={COURSES_TILE.href}
            className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline sm:col-span-2"
          >
            <div className="relative aspect-video w-full">
              <Image
                src={COURSES_TILE.img}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 340px"
                className="object-cover"
              />
            </div>
            <div className="p-3.5">
              <p className="mb-0.5 text-[14.5px] font-bold text-brand">{COURSES_TILE.label}</p>
              <p className="text-[11.5px] leading-snug text-muted">
                «{COURSES_TILE.promise}» — la formación de fondo, con tu progreso guardado.
              </p>
            </div>
          </Link>
          {MEDIUM_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={tile.img}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 170px"
                  className="object-cover"
                />
              </div>
              <div className="p-2.5">
                <p className="mb-0.5 text-[12.5px] font-bold text-brand">{tile.label}</p>
                <p className="text-[11px] leading-snug text-muted">«{tile.promise}»</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COMPACT_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="rounded-lg border border-border bg-surface px-3.5 py-3 text-inherit no-underline"
            >
              <p className="mb-0.5 text-[12.5px] font-bold text-brand">
                <span aria-hidden className="mr-1.5 text-brand-link">
                  {tile.glyph}
                </span>
                {tile.label}
              </p>
              <p className="text-[11px] leading-snug text-muted">«{tile.promise}»</p>
            </Link>
          ))}
        </div>
      </section>

      {continueLearning ? (
        <section aria-labelledby="start-title">
          <h2 id="start-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            Continúa donde lo dejaste
          </h2>
          <div className="flex flex-wrap items-center gap-5 rounded-lg border border-border bg-surface p-4.5">
            <div className="w-37 flex-none overflow-hidden rounded-md">
              <SmartCover
                src={continueLearning.cover}
                title={continueLearning.courseTitle}
                kind="curso"
              />
            </div>
            <div className="min-w-52 flex-1">
              <p className="mb-1 font-mono text-[11px] tracking-wide text-muted uppercase">Curso</p>
              <p className="mb-2 text-[15px] leading-snug font-semibold">
                {continueLearning.courseTitle}
              </p>
              <Progress
                value={continueLearning.pct}
                label="Progreso del curso"
                className="mb-1.5 max-w-64"
              />
              <p className="font-mono text-xs text-muted">
                {continueLearning.pct}% · siguiente: {continueLearning.lessonTitle}
              </p>
            </div>
            <Link
              href={`/app/courses/${continueLearning.courseSlug}/${continueLearning.lessonId}`}
              className="rounded-sm bg-brand px-4.5 py-2.5 text-[13.5px] font-semibold text-white no-underline hover:bg-brand-hover"
            >
              Continuar
            </Link>
          </div>
        </section>
      ) : firstCourse ? (
        <section aria-labelledby="start-title">
          <h2 id="start-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            Empieza por aquí
            <span className="ml-2 font-normal text-muted">
              elegido según tu perfil y tus objetivos
            </span>
          </h2>
          <div className="flex flex-wrap items-center gap-5 rounded-lg border border-border bg-surface p-4.5">
            <div className="w-42 flex-none overflow-hidden rounded-md">
              <SmartCover src={courseCover(firstCourse)} title={firstCourse.title} kind="curso" />
            </div>
            <div className="min-w-52 flex-1">
              <p className="mb-1 font-mono text-[11px] tracking-wide text-muted uppercase">
                Curso{firstCourse.duration ? ` · ${firstCourse.duration}` : ''} · Tu primer curso
              </p>
              <p className="mb-1 text-[16px] leading-snug font-bold">{firstCourse.title}</p>
              {firstCourse.description ? (
                <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
                  {firstCourse.description}
                </p>
              ) : null}
            </div>
            <Link
              href={`/app/courses/${firstCourse.slug}`}
              className="rounded-sm bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline hover:bg-brand-hover"
            >
              Empezar el curso
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  )
}
