import { StripePh } from '../../components/ui'

/** Lección de audio con reproductor persistente inferior estilo Spotify. */
export default function Audio() {
  return (
    <div style={{ margin: -32, minHeight: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }}>
      <div className="audio-hero" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, padding: 48, flexWrap: 'wrap' }}>
        <StripePh style={{ width: 280, height: 280, borderRadius: 14 }} label="PORTADA" />
        <div style={{ maxWidth: 360 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>PODCAST · BRACHFIELD ACADEMY</div>
          <h1 style={{ fontSize: 24, margin: '0 0 10px', lineHeight: 1.3 }}>Ep. 12 · El coste real de la morosidad en las pymes</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 24 }}>Pere Brachfield · 34 min</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14 }}>
            <button className="mono" style={{ fontSize: 15, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Retroceder 15 segundos">−15s</button>
            <button style={{ fontSize: 26, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Pausar">⏸</button>
            <button className="mono" style={{ fontSize: 15, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Avanzar 15 segundos">+15s</button>
          </div>
          <div style={{ height: 5, borderRadius: 100, background: 'var(--border)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: '42%', height: '100%', background: 'var(--brand)' }} />
          </div>
          <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
            <span>14:18</span>
            <span>1x</span>
            <span>34:00</span>
          </div>
        </div>
      </div>

      {/* Reproductor persistente */}
      <div style={{ background: 'var(--surface-dark)', color: '#fff', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', bottom: 0 }}>
        <StripePh style={{ width: 36, height: 36, borderRadius: 6, flex: 'none' }} label="" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Ep. 12 · El coste real de la morosidad en las pymes
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--on-dark-muted)' }}>Reproductor persistente — sigue sonando al navegar</div>
        </div>
        <span aria-hidden>⏸</span>
        <span className="mono" style={{ fontSize: 11 }}>14:18 / 34:00</span>
      </div>
    </div>
  )
}
