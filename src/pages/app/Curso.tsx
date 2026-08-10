import { Link } from 'react-router-dom'
import { courseDetails, courseModules } from '../../data/content'
import { Kicker } from '../../components/ui'

export default function Curso() {
  return (
    <>
      <Kicker>CURSO · INTERMEDIO · 2H 35MIN</Kicker>
      <h1 style={{ fontSize: 26, margin: '0 0 10px' }}>Cómo recuperar un impagado paso a paso</h1>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 14 }}>Pere Brachfield · 12 lecciones</div>
      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-3)', maxWidth: 640, margin: '0 0 16px' }}>
        {courseDetails['Cómo recuperar un impagado paso a paso'].desc}
      </p>
      <div className="section-label" style={{ marginBottom: 8 }}>Qué aprenderás</div>
      <ul style={{ margin: '0 0 20px', paddingLeft: 18, fontSize: 14, lineHeight: 1.9, color: 'var(--ink-2)', maxWidth: 640 }}>
        {courseDetails['Cómo recuperar un impagado paso a paso'].learn.map((l) => <li key={l}>{l}</li>)}
      </ul>
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
