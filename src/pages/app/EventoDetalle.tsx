import { Link } from 'react-router-dom'
import { Kicker, StripePh } from '../../components/ui'

export default function EventoDetalle() {
  return (
    <div className="event-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
      <div>
        <Kicker>MASTERCLASS · EN DIRECTO</Kicker>
        <h1 style={{ fontSize: 26, margin: '0 0 14px' }}>Cómo reclamar una deuda sin deteriorar la relación comercial</h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-3)', maxWidth: 560, margin: '0 0 20px' }}>
          Pere Brachfield analizará estrategias de reclamación que priorizan mantener al cliente, con casos reales y turno de preguntas en directo.
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
          <StripePh style={{ width: 44, height: 44, borderRadius: 100, flex: 'none' }} label="" />
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Con Pere Brachfield</div>
        </div>
      </div>
      <div className="card" style={{ padding: 22, alignSelf: 'start' }}>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>18 SEPTIEMBRE · 17:00 · 75 MIN</div>
        <Link to="/app/confirmacion" className="btn btn-primary btn-block" style={{ padding: 13, marginBottom: 10 }}>
          Reservar plaza
        </Link>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center' }}>Incluido en tu membresía</div>
      </div>
      <style>{`@media (max-width: 900px) { .event-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
