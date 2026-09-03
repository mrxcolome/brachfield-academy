import Link from 'next/link'

// Los 4 pasos del asistente de la Sala (Backstage v1.1: sin módulos).
export const SALA_STEPS = ['El curso', 'La portada', 'Las lecciones', 'Publicar'] as const

export function SalaSteps({ courseId, current }: { courseId: number; current: 1 | 2 | 3 | 4 }) {
  return (
    <ol aria-label={`Paso ${current} de 4`} className="mb-6 flex items-center gap-2">
      {SALA_STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4
        const done = n < current
        const active = n === current
        return (
          <li key={label} className={`flex items-center gap-2 ${n < 4 ? 'flex-1' : 'flex-none'}`}>
            <Link
              href={`/app/sala/${courseId}?paso=${n}`}
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
            {n < 4 && <span aria-hidden className="h-px min-w-3 flex-1 bg-border-input" />}
          </li>
        )
      })}
    </ol>
  )
}
