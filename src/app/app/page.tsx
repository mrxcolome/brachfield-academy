import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { getRecommendations, getNewThisWeek } from '@/features/personalization/service'
import { getContinueLearning } from '@/features/learning/service'
import { getUpcomingEvents, EVENT_TYPE_LABEL } from '@/features/events/service'
import { formatEventDate } from '@/features/events/format'
import { CONTENT_TYPE_META, LEVEL_META } from '@/features/content/service'
import { Avatar } from '@/components/art'
import { SmartCover } from '@/components/product/smart-cover'
import { contentCover, courseCover } from '@/features/content/covers'
import { Progress } from '@/components/ui/progress'
import { getWelcomeState } from '@/features/welcome/service'
import { getPublishedCourses } from '@/features/content/service'
import { WelcomeHome } from './welcome-home'
import { NavTour } from '@/components/product/welcome/nav-tour'

export const metadata = { title: 'Inicio' }

export default async function AppHome({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>
}) {
  const { user } = await requireActiveMember()
  const { tour: tourParam } = await searchParams
  const dbUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      name: true,
      onboardingStatus: true,
      professionalProfile: true,
      level: true,
      interests: true,
    },
  })
  if (dbUser.onboardingStatus !== 'COMPLETED') redirect('/onboarding')

  const firstName = dbUser.name.split(' ')[0] ?? dbUser.name
  const continueLearning = await getContinueLearning(user.id)
  const welcome = await getWelcomeState(user.id)
  // el tour se abre solo la primera vez, o al pedirlo desde Tu cuenta (?tour=1)
  const showTour = (welcome.active && welcome.tourPending) || tourParam === '1'

  if (welcome.active) {
    const recommended = await getRecommendations(user.id, {
      professionalProfile: dbUser.professionalProfile,
      level: dbUser.level,
      interests: dbUser.interests,
    })
    const recCourse = recommended.find((r) => r.kind === 'course')
    const firstCourse =
      (recCourse?.kind === 'course' ? recCourse.course : null) ??
      (await getPublishedCourses())[0] ??
      null
    return (
      <>
        {showTour && <NavTour />}
        <WelcomeHome
          firstName={firstName}
          welcome={welcome}
          firstCourse={firstCourse}
          continueLearning={continueLearning}
        />
      </>
    )
  }

  const [recommended, newThisWeek, upcoming] = await Promise.all([
    getRecommendations(
      user.id,
      {
        professionalProfile: dbUser.professionalProfile,
        level: dbUser.level,
        interests: dbUser.interests,
      },
      { excludeCourseSlug: continueLearning?.courseSlug },
    ),
    getNewThisWeek(3, 30),
    getUpcomingEvents(),
  ])
  const nextEvent = upcoming[0] ?? null

  return (
    <div className="mx-auto max-w-5xl">
      {showTour && <NavTour />}
      <h1 className="text-2xl font-bold">Hola, {firstName}</h1>
      <p className="mt-0.5 mb-7 text-sm text-muted">¿Qué quieres aprender hoy?</p>

      {continueLearning && (
        <section aria-labelledby="continue-title" className="mb-7">
          <h2 id="continue-title" className="mb-3 text-[13px] font-semibold text-ink-2">
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
      )}

      <section aria-labelledby="need-title" className="mb-8">
        <h2 id="need-title" className="mb-3 text-[13px] font-semibold text-ink-2">
          ¿Qué necesitas hoy?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: '/app/learning',
              title: 'Aprender',
              promise: 'Un tema completo, paso a paso',
              detail: 'Cursos y tutoriales, con tu progreso guardado.',
            },
            {
              href: '/app/library',
              title: 'Resolver',
              promise: 'Una duda concreta, ahora',
              detail: 'Guías, checklists y plantillas listas para usar.',
            },
            {
              href: '/app/updates',
              title: 'Ponerte al día',
              promise: 'Lo último en morosidad y crédito',
              detail: 'Cada día, la noticia del sector que importa.',
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-lg border border-border bg-surface p-4.5 text-inherit no-underline"
            >
              <span className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-[15.5px] font-bold text-brand">{card.title}</span>
                <span aria-hidden className="text-sm font-semibold text-brand-link">
                  →
                </span>
              </span>
              <span className="mb-1 block text-[13px] font-semibold text-ink-2">
                «{card.promise}»
              </span>
              <span className="block text-[12.5px] leading-relaxed text-muted">{card.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      {recommended.length > 0 && (
        <section aria-labelledby="rec-title" className="mb-8">
          <h2 id="rec-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            Recomendado para ti
            <span className="ml-2 font-normal text-muted">según tu perfil e intereses</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((rec) =>
              rec.kind === 'course' ? (
                <Link
                  key={`course-${rec.course.id}`}
                  href={`/app/courses/${rec.course.slug}`}
                  className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
                >
                  <SmartCover src={courseCover(rec.course)} title={rec.course.title} kind="curso" />
                  <div className="p-3.5">
                    <p className="mb-1.5 text-[13.5px] leading-snug font-semibold">
                      {rec.course.title}
                    </p>
                    <p className="font-mono text-[11px] text-muted">
                      CURSO
                      {rec.course.duration ? ` · ${rec.course.duration}` : ''}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  key={`content-${rec.content.id}`}
                  href={`/app/contents/${rec.content.slug}`}
                  className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
                >
                  <SmartCover
                    src={contentCover(rec.content)}
                    title={rec.content.title}
                    kind={CONTENT_TYPE_META[rec.content.contentType].kind}
                  />
                  <div className="p-3.5">
                    <p className="mb-1.5 text-[13.5px] leading-snug font-semibold">
                      {rec.content.title}
                    </p>
                    <p className="font-mono text-[11px] text-muted">
                      {CONTENT_TYPE_META[rec.content.contentType].label.toUpperCase()}
                      {rec.content.duration ? ` · ${rec.content.duration}` : ''}
                    </p>
                  </div>
                </Link>
              ),
            )}
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-2 text-[13px] font-semibold text-ink-2">Pregunta del mes</h2>
          <p className="mb-1.5 text-sm font-semibold">¿Cuándo prescribe una deuda comercial?</p>
          <p className="text-[13px] leading-relaxed text-ink-3">
            Con carácter general, la acción para reclamar deudas comerciales prescribe a los 5 años
            — pero cada reclamación fehaciente reinicia el contador…
          </p>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-2 text-[13px] font-semibold text-ink-2">Próximo directo</h2>
          {nextEvent ? (
            <>
              <div className="mb-2.5 flex items-center gap-2.5">
                <Avatar size={32} />
                <p className="text-[13px] font-semibold">
                  {nextEvent.speaker ?? 'Pere Brachfield'}
                </p>
              </div>
              <p className="mb-1 text-sm leading-snug font-semibold">{nextEvent.title}</p>
              <p className="mb-3 font-mono text-[11.5px] text-muted">
                {EVENT_TYPE_LABEL[nextEvent.eventType]} · {formatEventDate(nextEvent.startAt)}
              </p>
              <Link
                href="/app/events"
                className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
              >
                Reservar plaza →
              </Link>
            </>
          ) : (
            <p className="text-[13px] leading-relaxed text-ink-3">
              No hay directos programados ahora mismo. Publicaremos aquí la próxima masterclass.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-2 text-[13px] font-semibold text-ink-2">Nuevo este mes</h2>
          {newThisWeek.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {newThisWeek.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/app/contents/${c.slug}`}
                    className="text-[13px] leading-snug font-medium text-ink no-underline hover:text-brand"
                  >
                    <span aria-hidden className="mr-1.5 text-accent-ink">
                      {CONTENT_TYPE_META[c.contentType].glyph}
                    </span>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] leading-relaxed text-ink-3">
              Cada mes publicamos contenido nuevo — lo encontrarás aquí y en «Nuevo este mes».
            </p>
          )}
          <Link
            href="/app/new"
            className="mt-3 inline-block text-[13px] font-semibold text-brand-link no-underline hover:underline"
          >
            Ver todo lo nuevo →
          </Link>
        </section>
      </div>
    </div>
  )
}
