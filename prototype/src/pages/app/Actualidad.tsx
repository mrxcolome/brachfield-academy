import { news, newsArticles } from '../../data/content'

export default function Actualidad() {
  return (
    <div style={{ maxWidth: 820 }}>
      <h1 className="page-title">Actualidad</h1>
      <p className="page-sub">Lo que un Credit Manager necesita saber esta semana.</p>
      {news.map((n) => (
        <article key={n.t} className="card card-md" style={{ padding: 20, marginBottom: 12 }}>
          <span className="mono" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--brand-link)', background: 'var(--brand-soft)', padding: '4px 9px', borderRadius: 100 }}>
            {n.tag}
          </span>
          <h2 style={{ fontWeight: 600, fontSize: 15, margin: '10px 0 4px', lineHeight: 1.35 }}>{n.t}</h2>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
            {newsArticles[n.t].date} · lectura {newsArticles[n.t].read}
          </div>
          <div style={{ display: 'grid', gap: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-3)' }}>
            <p style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>Qué ha cambiado · </b>{newsArticles[n.t].changed}</p>
            <p style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>Cómo te afecta · </b>{newsArticles[n.t].affects}</p>
            <p style={{ margin: 0 }}><b style={{ color: 'var(--ink)' }}>Qué hacer · </b>{newsArticles[n.t].action}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
