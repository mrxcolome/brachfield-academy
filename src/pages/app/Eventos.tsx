import { Link } from 'react-router-dom'
import { events, replays } from '../../data/content'
import { StripePh } from '../../components/ui'

export default function Eventos() {
  return (
    <>
      <h1 className="page-title" style={{ marginBottom: 22 }}>Eventos</h1>

      <div className="section-label">Próximos</div>
      <div className="grid grid-3" style={{ marginBottom: 28 }}>
        {events.map((e) => (
          <div key={e.t} className="card card-md" style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{e.date} · {e.dur}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, lineHeight: 1.35, flex: 1 }}>
              <Link to="/app/evento" style={{ color: 'inherit' }}>{e.t}</Link>
            </div>
            <Link to="/app/confirmacion" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', fontSize: 12.5, padding: '8px 14px' }}>
              Reservar plaza
            </Link>
          </div>
        ))}
      </div>

      <div className="section-label">Eventos pasados / replays</div>
      <div className="grid grid-3">
        {replays.map((r) => (
          <div key={r.t} className="card card-md" style={{ overflow: 'hidden' }}>
            <StripePh style={{ aspectRatio: '16 / 9' }} label="" />
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{r.t}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>◉ REPLAY · {r.dur}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
