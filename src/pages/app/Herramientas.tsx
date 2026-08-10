import { Link } from 'react-router-dom'
import { tools } from '../../data/content'

const groups: { label: string; items: string[] }[] = [
  { label: 'MODELOS DE COMUNICACIÓN', items: tools.comunicacion },
  { label: 'CHECKLISTS', items: tools.checklists },
  { label: 'PLANTILLAS', items: tools.plantillas },
  { label: 'CALCULADORAS', items: tools.calculadoras },
  { label: 'SCRIPTS', items: tools.scripts },
]

export default function Herramientas() {
  return (
    <>
      <h1 className="page-title">Herramientas</h1>
      <p className="page-sub">Recursos listos para usar mañana mismo en tu empresa.</p>
      <div className="grid grid-5" style={{ gap: 16, alignItems: 'start' }}>
        {groups.map((g) => (
          <div key={g.label}>
            <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--brand-link)', marginBottom: 10 }}>{g.label}</div>
            {g.items.map((t) => (
              <Link key={t} to="/app/documento" className="card" style={{ borderRadius: 8, padding: 12, fontSize: 12.5, fontWeight: 500, marginBottom: 8, display: 'block', color: 'var(--ink)', textDecoration: 'none' }}>
                {t}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
