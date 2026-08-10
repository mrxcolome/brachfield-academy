import { Link } from 'react-router-dom'
import { videos } from '../../data/content'
import { Kicker } from '../../components/ui'
import { Cover } from '../../components/art'

export default function Categoria() {
  return (
    <>
      <Kicker>EXPLORAR / RECOBRO DE IMPAGADOS</Kicker>
      <h1 style={{ fontSize: 24, margin: '0 0 20px' }}>Recobro de impagados</h1>
      <div className="grid grid-4">
        {videos.map((v) => (
          <Link key={v.t} to="/app/leccion" className="card card-md" style={{ overflow: 'hidden', color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <Cover title={v.t} kind="video" style={{ aspectRatio: '16 / 10' }} />
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{v.t}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>▶ VÍDEO · {v.dur}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
