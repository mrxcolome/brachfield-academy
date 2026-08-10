import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { goalOptions, profileOptions } from '../data/content'
import { Kicker, StripePh } from '../components/ui'

const STEPS = ['BIENVENIDA', 'PERFIL', 'OBJETIVOS', 'NIVEL', 'RECOMENDACIÓN'] as const
const levels = ['Iniciación', 'Intermedio', 'Avanzado']

/** Itinerario recomendado según el perfil elegido (personalización del briefing). */
function recommendedPath(profile: string | null): { t: string; meta: string } {
  switch (profile) {
    case 'Director/a Financiero':
    case 'Controller':
      return { t: 'Director de Credit Management', meta: '9 módulos · Nivel avanzado' }
    case 'Abogado/a':
      return { t: 'Marco legal de la morosidad comercial', meta: '11 lecciones · Nivel intermedio' }
    case 'Administración / Cobros':
      return { t: 'Especialista en recobro', meta: '6 módulos · Nivel intermedio' }
    default:
      return { t: 'Especialista en prevención de impagos', meta: '8 módulos · Nivel intermedio' }
  }
}

const optionStyle = (selected: boolean): React.CSSProperties => ({
  border: selected ? '2px solid var(--brand)' : '1px solid var(--border-chip)',
  borderRadius: 8,
  padding: selected ? '10px 13px' : '11px 14px',
  fontSize: 13.5,
  background: selected ? 'var(--brand-soft)' : '#fff',
  fontWeight: selected ? 600 : 400,
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
})

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<string | null>(null)
  const [goals, setGoals] = useState<string[]>([])
  const [level, setLevel] = useState<string | null>(null)

  const toggleGoal = (g: string) =>
    setGoals((gs) => (gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g]))

  const rec = recommendedPath(profile)

  return (
    <main className="auth-wrap" style={{ alignItems: 'flex-start', paddingTop: 64 }}>
      <div className="auth-card" style={{ width: 480 }}>
        <Kicker style={{ marginBottom: 10 }}>
          PASO {step + 1} DE {STEPS.length} · {STEPS[step]}
        </Kicker>

        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <StripePh style={{ width: 72, height: 72, borderRadius: 100, margin: '4px auto 20px' }} label="" />
            <h1 style={{ fontSize: 20, margin: '0 0 10px' }}>Bienvenido a Brachfield Academy</h1>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 22px' }}>
              Personalicemos tu experiencia en menos de un minuto.
            </p>
            <button className="btn btn-primary" onClick={() => setStep(1)}>Empezar</button>
          </div>
        )}

        {step === 1 && (
          <>
            <h1 style={{ fontSize: 19, margin: '0 0 18px' }}>¿Cuál es tu perfil?</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {profileOptions.map((p) => (
                <button key={p} style={optionStyle(profile === p)} onClick={() => setProfile(p)}>
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontSize: 19, margin: '0 0 6px' }}>¿Qué quieres mejorar?</h1>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px' }}>Selección múltiple</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {goalOptions.map((g) => {
                const on = goals.includes(g)
                return (
                  <button key={g} style={{ ...optionStyle(on), display: 'flex', gap: 8, alignItems: 'center' }} onClick={() => toggleGoal(g)} aria-pressed={on}>
                    <span
                      aria-hidden
                      style={{
                        width: 14, height: 14, flex: 'none', borderRadius: 4,
                        border: on ? 'none' : '1.5px solid var(--faint)',
                        background: on ? 'var(--brand)' : 'transparent',
                        color: '#fff', fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {on ? '✓' : ''}
                    </span>
                    {g}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontSize: 19, margin: '0 0 18px' }}>¿Cuál es tu nivel?</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {levels.map((l) => (
                <button key={l} style={optionStyle(level === l)} onClick={() => setLevel(l)}>
                  {l}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 style={{ fontSize: 19, margin: '0 0 6px' }}>Tu itinerario recomendado</h1>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 0 16px' }}>
              Según tu perfil{profile ? ` de ${profile}` : ''}
            </p>
            <div className="card card-md" style={{ padding: 18, marginBottom: 14 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--brand-link)', marginBottom: 6 }}>ITINERARIO</div>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 6 }}>{rec.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{rec.meta}</div>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/app')}>Ir a mi Home</button>
          </>
        )}

        {step > 0 && step < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setStep(step - 1)}>← Anterior</button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !profile) || (step === 3 && !level)}
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
