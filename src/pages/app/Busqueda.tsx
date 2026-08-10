import { useState } from 'react'
import { searchResults } from '../../data/content'

export default function Busqueda() {
  const [query, setQuery] = useState('prescripción')
  const [saved, setSaved] = useState<Set<number>>(new Set())

  const toggle = (i: number) =>
    setSaved((s) => {
      const next = new Set(s)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <div className="search-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 32 }}>
      <div>
        <input
          className="input"
          style={{ borderRadius: 100, padding: '13px 20px', fontSize: 15, marginBottom: 6 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Busca "prescripción", "moroso", "factura vencida", "burofax"…'
          aria-label="Buscador global"
        />
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 22 }}>14 resultados</div>
        {searchResults.map((r, i) => (
          <div key={r.t} className="card card-md" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
            <span className="mono" style={{ fontSize: 16, color: 'var(--brand-link)', width: 20 }} aria-hidden>{r.g}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.t}</div>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{r.type} · {r.dur}</div>
            </div>
            <button
              onClick={() => toggle(i)}
              aria-label={saved.has(i) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              aria-pressed={saved.has(i)}
              style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: saved.has(i) ? 'var(--accent)' : 'oklch(70% 0.01 260)' }}
            >
              {saved.has(i) ? '♥' : '♡'}
            </button>
          </div>
        ))}
      </div>
      <aside className="search-filters" style={{ borderLeft: '1px solid var(--border-soft)', paddingLeft: 24 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>Filtros</div>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 6 }}>TIPO</div>
        <div style={{ fontSize: 13, lineHeight: 2.1, marginBottom: 16 }}>Vídeo · Artículo · PDF · Podcast · Webinar</div>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 6 }}>NIVEL</div>
        <div style={{ fontSize: 13, lineHeight: 2.1 }}>Iniciación · Intermedio · Avanzado</div>
      </aside>
      <style>{`@media (max-width: 900px) { .search-cols { grid-template-columns: 1fr !important; } .search-filters { border-left: none !important; padding-left: 0 !important; } }`}</style>
    </div>
  )
}
