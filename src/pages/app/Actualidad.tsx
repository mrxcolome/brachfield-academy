import { news } from '../../data/content'

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
          <h2 style={{ fontWeight: 600, fontSize: 15, margin: '10px 0', lineHeight: 1.35 }}>{n.t}</h2>
          <div className="news-meta" style={{ display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--muted)', flexWrap: 'wrap' }}>
            <span><b style={{ color: 'var(--ink-2)' }}>Qué ha cambiado ·</b> resumen ejecutivo</span>
            <span><b style={{ color: 'var(--ink-2)' }}>Cómo te afecta ·</b> impacto directo</span>
            <span><b style={{ color: 'var(--ink-2)' }}>Qué hacer ·</b> acción recomendada</span>
          </div>
        </article>
      ))}
    </div>
  )
}
