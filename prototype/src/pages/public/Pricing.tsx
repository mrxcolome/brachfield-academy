import { Link } from 'react-router-dom'
import { pricingIncludes } from '../../data/content'

export default function Pricing() {
  return (
    <main style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg)', minHeight: 'calc(100vh - 71px)' }}>
      <h1 style={{ fontSize: 32, margin: '0 0 10px' }}>Un plan. Sin sorpresas.</h1>
      <p style={{ fontSize: 15, color: 'var(--muted)', margin: '0 0 40px' }}>
        Acceso completo a la biblioteca, cursos, herramientas y sesiones en directo con Pere Brachfield.
      </p>
      <div className="card" style={{ borderRadius: 16, padding: 40, maxWidth: 380, margin: '0 auto', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-link)', marginBottom: 8 }}>Plan Profesional</div>
        <div style={{ fontSize: 44, fontWeight: 700, marginBottom: 2 }}>
          39 €<span style={{ fontSize: 16, fontWeight: 500, color: 'var(--muted)' }}>/mes</span>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>IVA incluido · facturación mensual</div>
        <ul style={{ listStyle: 'none', margin: '0 0 26px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pricingIncludes.map((p) => (
            <li key={p} style={{ display: 'flex', gap: 8, fontSize: 13.5 }}>
              <span style={{ color: 'var(--success)' }} aria-hidden>✓</span>
              {p}
            </li>
          ))}
        </ul>
        <Link to="/registro" className="btn btn-primary btn-block" style={{ padding: 14 }}>
          Acceder a Brachfield Academy
        </Link>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', textAlign: 'center', marginTop: 12 }}>
          Sin permanencia · cancela cuando quieras
        </div>
      </div>
      <div style={{ marginTop: 28, fontSize: 13, color: 'var(--muted)' }}>
        ¿Formación para tu equipo? <a href="#" onClick={(e) => e.preventDefault()}>Brachfield Academy for Teams →</a> (próximamente)
      </div>
    </main>
  )
}
