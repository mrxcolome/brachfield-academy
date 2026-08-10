import { Link } from 'react-router-dom'
import { courseModules } from '../../data/content'
import { Kicker } from '../../components/ui'

export default function Curso() {
  return (
    <>
      <Kicker>CURSO · INTERMEDIO · 2H 35MIN</Kicker>
      <h1 style={{ fontSize: 26, margin: '0 0 10px' }}>Cómo recuperar un impagado paso a paso</h1>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 20 }}>Pere Brachfield · 12 lecciones</div>
      <Link to="/app/leccion" className="btn btn-primary" style={{ marginBottom: 28 }}>Empezar curso</Link>
      <div className="grid grid-2" style={{ marginTop: 28 }}>
        {courseModules.map((m) => (
          <div key={m.n} className="card card-md" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{m.n}</div>
            {m.items.map((l) => (
              <Link key={l} to="/app/leccion" style={{ display: 'block', fontSize: 13, color: 'var(--ink-3)', padding: '5px 0', borderTop: '1px solid var(--border-faint)', textDecoration: 'none' }}>
                {l}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
