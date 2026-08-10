import { Link } from 'react-router-dom'
import { courses, knowledgeAreas } from '../../data/content'
import { Cover } from '../../components/art'

export default function Catalogo() {
  return (
    <main style={{ background: '#fff', minHeight: 'calc(100vh - 71px)' }}>
      <div style={{ maxWidth: 1344, margin: '0 auto', padding: '40px 48px 48px' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 8px' }}>Explora todo el conocimiento</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 22px' }}>
          Vista previa pública. Suscríbete para acceder al contenido completo.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {knowledgeAreas.map((a) => (
            <span key={a} className="chip" style={{ cursor: 'default' }}>{a}</span>
          ))}
        </div>
        <div className="grid grid-3" style={{ gap: 18 }}>
          {courses.map((c) => (
            <Link key={c.t} to="/curso-publico" className="card card-md" style={{ overflow: 'hidden', position: 'relative', color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <Cover title={c.t} kind="curso" style={{ aspectRatio: '16 / 10' }} />
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,.9)', borderRadius: 100, padding: '5px 10px', fontSize: 11, fontWeight: 600 }} className="mono">
                🔒 Premium
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{c.t}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>CURSO · {c.dur} · {c.lvl}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
