// Indicador del camino de alta: tres pasos, siempre a la vista, para que el
// nuevo alumno sepa dónde está y cuánto le queda (poco).
const STEPS = ['Tu cuenta', 'Activa tu acceso', 'Tu perfil'] as const

export function SignupSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol aria-label={`Paso ${current} de 3`} className="mb-6 flex items-center gap-2">
      {STEPS.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <li key={label} className={`flex items-center gap-2 ${n < 3 ? 'flex-1' : 'flex-none'}`}>
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
                active ? 'font-semibold text-ink' : 'hidden text-muted sm:inline'
              }`}
            >
              {label}
            </span>
            {n < 3 && <span aria-hidden className="h-px min-w-3 flex-1 bg-border-input" />}
          </li>
        )
      })}
    </ol>
  )
}
