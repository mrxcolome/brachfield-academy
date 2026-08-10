import { Kicker, StripePh } from '../../components/ui'

const checklistItems = [
  'Verificar datos registrales y solvencia',
  'Consultar ficheros de morosidad',
  'Solicitar referencias comerciales',
  'Fijar un límite de crédito inicial prudente',
  'Definir condiciones de pago por escrito',
]

export default function Documento() {
  return (
    <div className="doc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40 }}>
      <div>
        <Kicker>✓ CHECKLIST · 5 MINUTOS</Kicker>
        <h1 style={{ fontSize: 26, margin: '0 0 16px' }}>Checklist para prevenir impagos antes de vender</h1>
        <div className="section-label" style={{ marginBottom: 8 }}>Resumen</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-3)', margin: '0 0 18px' }}>
          Once puntos de control para evaluar el riesgo de un cliente nuevo antes de concederle una línea de crédito comercial.
        </p>
        <div className="section-label" style={{ marginBottom: 8 }}>Cuándo utilizarlo</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-3)', margin: '0 0 18px' }}>
          Antes de dar de alta a un cliente nuevo o de ampliar el límite de crédito a uno existente.
        </p>
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 20, fontSize: 13.5, lineHeight: 2 }}>
          {checklistItems.map((item) => (
            <label key={item} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--brand)' }} />
              {item}
            </label>
          ))}
        </div>
      </div>
      <div>
        <StripePh style={{ aspectRatio: '1 / 1.3', borderRadius: 10, marginBottom: 16 }} label="VISTA PREVIA DEL PDF" />
        <button className="btn btn-primary btn-block" style={{ padding: 13 }}>↓ Descargar PDF</button>
      </div>
      <style>{`@media (max-width: 900px) { .doc-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
