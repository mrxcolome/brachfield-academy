'use client'

import { useState, useTransition } from 'react'
import { saveOnboarding } from '@/features/onboarding/actions'
import { GOAL_OPTIONS, LEVEL_OPTIONS, PROFILE_OPTIONS } from '@/features/onboarding/schemas'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

const STEPS = ['Bienvenida', 'Perfil', 'Objetivos', 'Nivel'] as const

export function OnboardingForm({ firstName }: { firstName: string }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<string | null>(null)
  const [goals, setGoals] = useState<string[]>([])
  const [level, setLevel] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function toggleGoal(g: string) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function submit() {
    setError(null)
    startTransition(async () => {
      const res = await saveOnboarding({ professionalProfile: profile, interests: goals, level })
      if (res?.error) setError(res.error)
    })
  }

  const canContinue =
    step === 0 ||
    (step === 1 && profile !== null) ||
    (step === 2 && goals.length > 0) ||
    (step === 3 && level !== null)

  return (
    <div className="w-full max-w-lg">
      {/* Progreso */}
      <div className="mb-6 flex items-center justify-center gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn('h-1.5 w-12 rounded-full', i <= step ? 'bg-brand' : 'bg-track')}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-8">
        <p className="mb-1.5 font-mono text-[11px] tracking-wide text-muted uppercase">
          Paso {step + 1} de {STEPS.length} · {STEPS[step]}
        </p>

        {step === 0 && (
          <>
            <h1 className="mb-3 text-2xl font-bold">Bienvenido, {firstName}</h1>
            <p className="mb-2 text-sm leading-relaxed text-ink-3">
              Tu suscripción está activa. Antes de entrar, tres preguntas rápidas para adaptar la
              Academia a tu trabajo: qué te recomendamos aprender y qué herramientas te enseñamos
              primero.
            </p>
            <p className="mb-6 text-sm text-muted">
              Menos de un minuto. Podrás cambiarlo en tu perfil.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="mb-4 text-xl font-bold">¿Cuál es tu perfil?</h1>
            <div className="mb-6 grid grid-cols-2 gap-2.5">
              {PROFILE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setProfile(o.value)}
                  aria-pressed={profile === o.value}
                  className={cn(
                    'rounded-md border px-3.5 py-3 text-left text-[13.5px] font-medium transition-colors',
                    profile === o.value
                      ? 'border-brand bg-brand-soft font-semibold text-brand'
                      : 'border-border-chip bg-surface hover:bg-bg',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="mb-1 text-xl font-bold">¿Qué quieres mejorar?</h1>
            <p className="mb-4 text-[13px] text-muted">Puedes elegir varias opciones</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGoal(g)}
                  aria-pressed={goals.includes(g)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[13px] font-medium transition-colors',
                    goals.includes(g)
                      ? 'border-brand bg-brand text-white'
                      : 'border-border-chip bg-surface hover:bg-bg',
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="mb-4 text-xl font-bold">¿Cuál es tu nivel?</h1>
            <div className="mb-6 flex flex-col gap-2.5">
              {LEVEL_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setLevel(o.value)}
                  aria-pressed={level === o.value}
                  className={cn(
                    'rounded-md border px-4 py-3.5 text-left transition-colors',
                    level === o.value
                      ? 'border-brand bg-brand-soft'
                      : 'border-border-chip bg-surface hover:bg-bg',
                  )}
                >
                  <span
                    className={cn('block text-sm font-semibold', level === o.value && 'text-brand')}
                  >
                    {o.label}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-muted">{o.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="mb-4 text-[13px] text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={pending}>
              ← Atrás
            </Button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canContinue}>
              {step === 0 ? 'Empezar' : 'Continuar'}
            </Button>
          ) : (
            <Button onClick={submit} disabled={!canContinue || pending}>
              {pending ? 'Guardando…' : 'Entrar en mi Academia'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
