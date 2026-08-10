import { Link } from 'react-router-dom'
import { courses, knowledgeAreas, paths } from '../../data/content'
import { Cover } from '../../components/art'

export default function Explorar() {
  return (
    <>
      <h1 className="page-title">Explora todo el conocimiento</h1>
      <p className="page-sub">Cursos, vídeos, podcasts, guías y herramientas sobre crédito, morosidad y recobro.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {['Tipo de contenido', 'Tema', 'Nivel', 'Duración'].map((f) => (
          <select key={f} className="select" style={{ width: 'auto', padding: '9px 12px', fontSize: 13, borderRadius: 8 }} aria-label={f}>
            <option>{f}</option>
          </select>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
        {knowledgeAreas.map((a) => (
          <Link key={a} to="/app/categoria" className="chip" style={{ textDecoration: 'none' }}>
            {a}
          </Link>
        ))}
      </div>

      <div className="section-label" style={{ marginBottom: 12 }}>Itinerarios formativos</div>
      <div className="grid grid-5" style={{ marginBottom: 28 }}>
        {paths.map((p) => (
          <Link key={p.t} to="/app/itinerario" className="card card-md" style={{ padding: 16, color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--brand-link)', marginBottom: 8 }}>{p.lvl.toUpperCase()}</div>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10, lineHeight: 1.3 }}>{p.t}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{p.total}</div>
          </Link>
        ))}
      </div>

      <div className="section-label" style={{ marginBottom: 12 }}>Cursos</div>
      <div className="grid grid-3">
        {courses.map((c) => (
          <Link key={c.t} to="/app/curso" className="card card-md" style={{ overflow: 'hidden', color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <Cover title={c.t} kind="curso" style={{ aspectRatio: '16 / 10' }} />
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{c.t}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>CURSO · {c.dur} · {c.lvl}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
