import Link from 'next/link'

// Indicador de pasos de los asistentes de la Sala (cursos y contenidos).
export function WizardSteps({
  labels,
  current,
  href,
}: {
  labels: readonly string[]
  current: number
  href: (n: number) => string
}) {
  const last = labels.length
  return (
    <ol aria-label={`Paso ${current} de ${last}`} className="mb-6 flex items-center gap-2">
      {labels.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <li
            key={label}
            className={`flex items-center gap-2 ${n < last ? 'flex-1' : 'flex-none'}`}
          >
            <Link
              href={href(n)}
              aria-current={active ? 'step' : undefined}
              className="flex items-center gap-2 no-underline"
            >
              <span
                aria-hidden
                className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[12px] font-bold ${
                  done || active
                    ? 'bg-brand text-white'
                    : 'border border-border-input bg-surface text-muted'
                }`}
              >
                {done ? '✓' : n}
              </span>
              <span
                className={`text-[12.5px] whitespace-nowrap ${
                  active ? 'font-semibold text-ink' : 'hidden text-muted lg:inline'
                }`}
              >
                {label}
              </span>
            </Link>
            {n < last && <span aria-hidden className="h-px min-w-3 flex-1 bg-border-input" />}
          </li>
        )
      })}
    </ol>
  )
}

export const SALA_STEPS = ['El curso', 'La portada', 'Las lecciones', 'Publicar'] as const

export function SalaSteps({ courseId, current }: { courseId: number; current: 1 | 2 | 3 | 4 }) {
  return (
    <WizardSteps
      labels={SALA_STEPS}
      current={current}
      href={(n) => `/app/sala/${courseId}?paso=${n}`}
    />
  )
}
