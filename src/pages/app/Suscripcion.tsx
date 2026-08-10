export default function Suscripcion() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Mi suscripción</h1>

      <div className="card" style={{ padding: 22, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-link)' }}>Plan Profesional</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>39 €/mes</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Próximo cobro: 10 septiembre 2026</div>
        </div>
        <span className="badge-active">ACTIVA</span>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Método de pago</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13.5 }}>
          <span>Visa terminada en 4242</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Cambiar tarjeta</a>
        </div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Facturas</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '7px 0', color: 'var(--ink-3)' }}>
          <span>Agosto 2026</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Descargar</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '7px 0', color: 'var(--ink-3)', borderTop: '1px solid var(--border-faint)' }}>
          <span>Julio 2026</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Descargar</a>
        </div>
      </div>

      <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13, color: 'var(--danger)' }}>
        Cancelar suscripción
      </a>
    </div>
  )
}
