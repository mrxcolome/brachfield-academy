import { itineraryItems } from '../../data/content'
import { Kicker, Progress } from '../../components/ui'

export default function Itinerario() {
  return (
    <div style={{ maxWidth: 820 }}>
      <Kicker>ITINERARIO · INTERMEDIO</Kicker>
      <h1 style={{ fontSize: 26, margin: '0 0 10px' }}>Especialista en prevención de impagos</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 16px' }}>4 de 8 módulos completados · ~6 horas</p>
      <Progress value={50} height={8} style={{ marginBottom: 28 }} />
      {itineraryItems.map((i) => (
        <div key={i.t} className="card card-md" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, opacity: i.done ? 1 : 0.92 }}>
          <span style={{ fontSize: 16, color: i.done ? 'var(--success)' : 'oklch(70% 0.01 260)' }} aria-hidden>
            {i.done ? '✓' : '○'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{i.t}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {i.type} · {i.done ? 'completado' : 'pendiente'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
