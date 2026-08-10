import { Link } from 'react-router-dom'
import { courseModules } from '../../data/content'
import { StripePh } from '../../components/ui'

export default function CursoPublico() {
  return (
    <main style={{ background: '#fff', minHeight: 'calc(100vh - 71px)' }}>
      <div className="curso-pub-grid" style={{ maxWidth: 1344, margin: '0 auto', padding: 48, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
        <div>
          <div className="kicker">CURSO · INTERMEDIO</div>
          <h1 style={{ fontSize: 30, margin: '0 0 14px' }}>Cómo recuperar un impagado paso a paso</h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-3)', maxWidth: 600, margin: '0 0 24px' }}>
            Un recorrido completo, con casos reales, desde el diagnóstico inicial hasta la vía judicial: cómo reaccionar cuando un cliente deja de pagar y qué hacer en cada fase del proceso de recobro.
          </p>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Qué aprenderás</div>
          <ul style={{ margin: '0 0 24px', paddingLeft: 18, fontSize: 14, lineHeight: 1.9, color: 'var(--ink-2)' }}>
            <li>Diagnosticar por qué un cliente no paga</li>
            <li>Escribir reclamaciones efectivas</li>
            <li>Negociar acuerdos de pago realistas</li>
            <li>Saber cuándo escalar a vía judicial</li>
          </ul>
          <div style={{ border: '1px solid var(--border-soft)', borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{courseModules[0].n}</div>
            {courseModules[0].items.map((l) => (
              <div key={l} style={{ display: 'flex', gap: 8, padding: '6px 0', fontSize: 13.5, color: 'var(--muted)' }}>
                <span aria-hidden>🔒</span>
                {l}
              </div>
            ))}
          </div>
        </div>
        <div>
          <StripePh style={{ borderRadius: 12, aspectRatio: '16 / 10', marginBottom: 18 }} label="PORTADA DEL CURSO" />
          <div className="card" style={{ padding: 22, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Incluido en la membresía</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 14 }}>39 €/mes</div>
            <Link to="/registro" className="btn btn-primary btn-block" style={{ padding: 13 }}>
              Acceder a Brachfield Academy
            </Link>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .curso-pub-grid { grid-template-columns: 1fr !important; padding: 24px 20px !important; } }`}</style>
    </main>
  )
}
