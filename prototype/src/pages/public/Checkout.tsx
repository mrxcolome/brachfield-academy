import { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const navigate = useNavigate()
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/onboarding')
  }
  return (
    <main style={{ background: '#fff', minHeight: 'calc(100vh - 71px)' }}>
      <form className="checkout-grid" style={{ maxWidth: 1344, margin: '0 auto', padding: 56, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48 }} onSubmit={onSubmit}>
        <div>
          <div className="kicker" style={{ marginBottom: 6 }}>PASO 3 DE 3</div>
          <h1 style={{ fontSize: 22, margin: '0 0 24px' }}>Datos de facturación y pago</h1>
          <div className="grid grid-2" style={{ marginBottom: 14 }}>
            <div>
              <label className="field-label" htmlFor="co-company">Empresa</label>
              <input id="co-company" className="input" placeholder="Razón social" />
            </div>
            <div>
              <label className="field-label" htmlFor="co-cif">CIF/NIF</label>
              <input id="co-cif" className="input" placeholder="B12345678" />
            </div>
          </div>
          <label className="field-label" htmlFor="co-address">Dirección de facturación</label>
          <input id="co-address" className="input" placeholder="Calle, número, ciudad" style={{ marginBottom: 14 }} />
          <label className="field-label" htmlFor="co-card">Tarjeta</label>
          <input id="co-card" className="input" placeholder="4242 4242 4242 4242" inputMode="numeric" />
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 26, alignSelf: 'start' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 14 }}>Resumen</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
            <span>Plan Profesional</span>
            <span>39,00 €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 14 }}>
            <span>IVA (21%)</span>
            <span>8,19 €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 20 }}>
            <span>Total hoy</span>
            <span>47,19 €</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ padding: 13 }}>Confirmar y pagar</button>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', textAlign: 'center', marginTop: 12 }}>
            Pago seguro · cancela cuando quieras
          </div>
        </div>
      </form>
      <style>{`@media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; padding: 24px 20px !important; } }`}</style>
    </main>
  )
}
