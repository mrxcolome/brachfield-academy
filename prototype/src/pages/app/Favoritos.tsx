import { useState } from 'react'
import { videos } from '../../data/content'
import { Cover } from '../../components/art'

const filters = ['Todos', 'Cursos', 'Vídeos', 'Herramientas']

export default function Favoritos() {
  const [filter, setFilter] = useState('Todos')
  const items = videos.slice(0, 4)

  return (
    <>
      <h1 className="page-title">Guardados</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button key={f} className={`chip${filter === f ? ' active' : ''}`} style={{ fontSize: 12.5, padding: '7px 14px' }} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      {filter !== 'Herramientas' ? (
        <div className="grid grid-4">
          {items.map((v) => (
            <div key={v.t} className="card card-md" style={{ overflow: 'hidden' }}>
              <Cover title={v.t} kind="video" style={{ aspectRatio: '16 / 10' }} />
              <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{v.t}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>▶ {v.dur}</div>
                </div>
                <span style={{ color: 'var(--accent)' }} aria-label="Guardado">♥</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Estado vacío del design system */
        <div className="card" style={{ padding: '48px 20px', textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 28, color: 'oklch(80% 0.01 258)' }} aria-hidden>♡</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>Sin guardados todavía</div>
        </div>
      )}
    </>
  )
}
