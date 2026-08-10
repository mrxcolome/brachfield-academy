import { Link } from 'react-router-dom'
import { guides, podcasts } from '../../data/content'
import { PodcastCover } from '../../components/art'

export default function Biblioteca() {
  return (
    <>
      <h1 className="page-title" style={{ marginBottom: 22 }}>Biblioteca</h1>

      <div className="section-label">Podcasts</div>
      <div className="grid grid-4" style={{ marginBottom: 26 }}>
        {podcasts.map((p) => (
          <Link key={p.t} to="/app/audio" className="card card-md" style={{ overflow: 'hidden', color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <PodcastCover title={p.t} style={{ aspectRatio: '1' }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{p.t}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>◑ PODCAST · {p.dur}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-label">Guías y PDFs</div>
      <div className="grid grid-4">
        {guides.map((g) => (
          <Link key={g.t} to="/app/documento" className="card card-md" style={{ padding: 16, color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{g.fmt} · {g.dur}</div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{g.t}</div>
          </Link>
        ))}
      </div>
    </>
  )
}
