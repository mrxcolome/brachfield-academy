import { useState } from 'react'
import { casoAnalysis } from '../../data/content'
import { Kicker } from '../../components/ui'

const contexto = [
  { l: 'SITUACIÓN', t: 'Cliente estratégico, 8 años de relación, factura de 45.000 € vencida hace 60 días.' },
  { l: 'PROBLEMA', t: 'No responde a los recordatorios, pero sigue haciendo nuevos pedidos.' },
  { l: 'DATOS DISPONIBLES', t: 'Historial de pagos, condiciones contractuales, últimas comunicaciones.' },
]

export default function CasoPractico() {
  const [revealed, setRevealed] = useState(false)
  return (
    <>
      <Kicker>▣ CASO PRÁCTICO</Kicker>
      <h1 style={{ fontSize: 26, margin: '0 0 20px' }}>Cliente importante con 45.000 € vencidos</h1>
      <div className="grid grid-3" style={{ gap: 16, marginBottom: 26 }}>
        {contexto.map((c) => (
          <div key={c.l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>{c.l}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{c.t}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--brand-soft)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <b style={{ fontSize: 14 }}>¿Qué harías?</b>
      </div>
      {!revealed ? (
        <button className="btn btn-primary" onClick={() => setRevealed(true)}>Ver análisis de Pere</button>
      ) : (
        <div className="grid grid-3">
          {casoAnalysis.map((a) => (
            <div key={a.n} className="card card-md" style={{ padding: 16 }}>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--brand-link)', marginBottom: 8 }}>{a.n}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{a.t}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
