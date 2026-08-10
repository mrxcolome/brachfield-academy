import { useState } from 'react'
import { chapters, courseModules } from '../../data/content'

/** Lección de vídeo: sidebar del curso + reproductor + capítulos + transcript. */
export default function Leccion() {
  const [completed, setCompleted] = useState(false)
  const current = 'Primer contacto'

  return (
    <div className="lesson-shell" style={{ display: 'flex', gap: 0, margin: -32, minHeight: 'calc(100vh - 65px)' }}>
      {/* Sidebar del curso */}
      <aside className="lesson-sidebar" style={{ width: 280, flex: 'none', borderRight: '1px solid var(--border-soft)', background: 'var(--bg)' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-soft)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>CURSO</div>
          <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.3 }}>Cómo recuperar un impagado paso a paso</div>
        </div>
        {courseModules.map((m) => (
          <div key={m.n}>
            <div className="mono" style={{ padding: '14px 20px 6px', fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>{m.n}</div>
            {m.items.map((l) => {
              const isCurrent = l === current
              return (
                <div
                  key={l}
                  style={{
                    padding: '9px 20px', fontSize: 13, display: 'flex', gap: 8,
                    color: isCurrent ? 'var(--brand)' : 'var(--ink-2)',
                    fontWeight: isCurrent ? 600 : 400,
                    background: isCurrent ? 'var(--brand-soft)' : 'transparent',
                  }}
                >
                  <span style={{ color: isCurrent ? 'var(--brand)' : 'oklch(70% 0.01 260)' }} aria-hidden>
                    {isCurrent && completed ? '✓' : '○'}
                  </span>
                  {l}
                </div>
              )
            })}
          </div>
        ))}
      </aside>

      {/* Área principal */}
      <div style={{ flex: 1, minWidth: 0, background: '#fff' }}>
        {/* Reproductor */}
        <div style={{ aspectRatio: '16 / 8', background: 'var(--player-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative' }}>
          <span className="mono" style={{ fontSize: 12, color: 'oklch(65% 0.01 260)' }}>▶ REPRODUCTOR DE VÍDEO</span>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px', background: 'linear-gradient(transparent, rgba(0,0,0,.6))', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span aria-hidden>⏵</span>
            <span className="mono" style={{ fontSize: 12 }}>02:34 / 08:10</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,.3)', borderRadius: 100 }}>
              <div style={{ width: '30%', height: '100%', background: 'var(--accent)' }} />
            </div>
            <span className="mono" style={{ fontSize: 12 }}>1x</span>
            <span>CC</span>
            <span aria-hidden>⛶</span>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>LECCIÓN 5 DE 12</div>
          <h1 style={{ fontSize: 22, margin: '0 0 14px' }}>Primer contacto</h1>
          <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm">← Anterior</button>
            <button className="btn btn-success btn-sm" onClick={() => setCompleted(!completed)} aria-pressed={completed}>
              {completed ? '✓ Completada' : '✓ Marcar como completado'}
            </button>
            <button className="btn btn-primary btn-sm">Siguiente →</button>
            <div className="mono" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
              {completed ? '8 de 12 lecciones · 67%' : '7 de 12 lecciones · 58%'}
            </div>
          </div>

          <div className="section-label" style={{ marginBottom: 8 }}>En esta lección</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
            {chapters.map((c) => (
              <button key={c} className="mono" style={{ fontSize: 12.5, color: 'var(--brand-link)', padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                {c}
              </button>
            ))}
          </div>

          <div className="section-label" style={{ marginBottom: 8 }}>Transcript</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink-3)', maxWidth: 640, margin: 0 }}>
            El primer contacto con un cliente que ha dejado de pagar es determinante. Un tono profesional pero firme, sin acusar, abre la puerta a una negociación posterior sin cerrar la relación comercial…
          </p>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .lesson-shell { flex-direction: column; margin: -20px !important; } .lesson-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border-soft); } }`}</style>
    </div>
  )
}
