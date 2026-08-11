import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { recommendedCourses } from '@/features/onboarding/recommendations'
import { getContinueLearning } from '@/features/learning/service'
import { Cover, Avatar } from '@/components/art'
import { Progress } from '@/components/ui/progress'

export const metadata = { title: 'Inicio' }

export default async function AppHome() {
  const { user } = await requireActiveMember()
  const dbUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { name: true, onboardingStatus: true, professionalProfile: true, interests: true },
  })
  if (dbUser.onboardingStatus !== 'COMPLETED') redirect('/onboarding')

  const firstName = dbUser.name.split(' ')[0] ?? dbUser.name
  const recommended = recommendedCourses(dbUser.professionalProfile)
  const continueLearning = await getContinueLearning(user.id)

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Hola, {firstName}</h1>
      <p className="mt-0.5 mb-7 text-sm text-muted">¿Qué quieres aprender hoy?</p>

      {continueLearning && (
        <section aria-labelledby="continue-title" className="mb-7">
          <h2 id="continue-title" className="mb-3 text-[13px] font-semibold text-ink-2">
            Continúa donde lo dejaste
          </h2>
          <div className="flex flex-wrap items-center gap-5 rounded-lg border border-border bg-surface p-4.5">
            <Cover
              title={continueLearning.courseTitle}
              kind="curso"
              className="rounded-md"
              style={{ width: 148, aspectRatio: '16/10', flex: 'none' }}
            />
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

      <section aria-labelledby="rec-title" className="mb-8">
        <h2 id="rec-title" className="mb-3 text-[13px] font-semibold text-ink-2">
          Recomendado para ti
          {dbUser.interests.length > 0 && (
            <span className="ml-2 font-normal text-muted">según tu perfil e intereses</span>
          )}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((c) => (
            <Link
              key={c.slug}
              href={`/app/courses/${c.slug}`}
              className="overflow-hidden rounded-lg border border-border bg-surface text-inherit no-underline"
            >
              <Cover title={c.title} kind="curso" style={{ aspectRatio: '16/10' }} />
              <div className="p-3.5">
                <p className="mb-1.5 text-[13.5px] leading-snug font-semibold">{c.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  CURSO · {c.duration} · {c.level}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
          <div className="mb-2.5 flex items-center gap-2.5">
            <Avatar size={32} />
            <p className="text-[13px] font-semibold">Pere Brachfield</p>
          </div>
          <p className="mb-1 text-sm leading-snug font-semibold">
            Reclamar una deuda sin deteriorar la relación comercial
          </p>
          <p className="font-mono text-[11.5px] text-muted">18 septiembre · 17:00 · 75 min</p>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-2 text-[13px] font-semibold text-ink-2">La Academia crece</h2>
          <p className="text-[13px] leading-relaxed text-ink-3">
            Estamos cargando los cursos, vídeos y herramientas. Cada semana encontrarás contenido
            nuevo — te avisaremos aquí y por correo.
          </p>
        </section>
      </div>
    </div>
  )
}
