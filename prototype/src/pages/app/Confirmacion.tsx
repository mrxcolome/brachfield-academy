import { Link } from 'react-router-dom'

export default function Confirmacion() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 32 }}>
      <div className="card" style={{ width: 440, maxWidth: '100%', textAlign: 'center', borderRadius: 14, padding: 40 }}>
        <div style={{ fontSize: 34, color: 'var(--success)', marginBottom: 14 }} aria-hidden>✓</div>
        <h1 style={{ fontSize: 20, margin: '0 0 8px' }}>Plaza reservada</h1>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
          Te avisaremos por correo y desde la Academia antes de que empiece la sesión.
        </p>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 14, fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
          Masterclass · 18 septiembre · 17:00
        </div>
        <Link to="/app" className="btn btn-primary btn-block" style={{ fontSize: 13.5 }}>
          Volver a mi Home
        </Link>
      </div>
    </div>
  )
}
