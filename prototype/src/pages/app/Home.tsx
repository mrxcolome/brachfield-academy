import { Link } from 'react-router-dom'
import { newThisWeek, user, videos } from '../../data/content'
import { Progress } from '../../components/ui'
import { Avatar, Cover } from '../../components/art'

export default function Home() {
  return (
    <>
      <h1 style={{ fontSize: 24, margin: '0 0 4px' }}>Hola, {user.nombre}</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 26px' }}>¿Qué quieres aprender hoy?</p>

      {/* Continúa donde lo dejaste */}
      <div className="section-label">Continúa donde lo dejaste</div>
      <div className="card continue-card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
        <Cover title="Cómo negociar con un cliente moroso" kind="curso" radius={8} style={{ width: 160, height: 96, flex: 'none' }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>CURSO</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Cómo negociar con un cliente moroso</div>
          <Progress value={67} style={{ maxWidth: 280, marginBottom: 6 }} />
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>67% completado</div>
        </div>
        <Link to="/app/curso" className="btn btn-primary btn-sm" style={{ padding: '10px 18px' }}>Continuar</Link>
      </div>

      {/* Tu itinerario */}
      <div className="section-label">Tu itinerario</div>
      <Link to="/app/itinerario" className="card" style={{ display: 'block', padding: '18px 20px', marginBottom: 28, color: 'inherit', textDecoration: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14.5 }}>Especialista en prevención de impagos</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>4 de 8 módulos</span>
        </div>
        <Progress value={50} />
      </Link>

      <div className="home-cols" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div>
          {/* Recomendado */}
          <div className="section-label">Recomendado para ti</div>
          <div className="grid grid-3" style={{ marginBottom: 28 }}>
            {videos.slice(0, 3).map((v) => (
              <Link key={v.t} to="/app/leccion" className="card card-md" style={{ overflow: 'hidden', color: 'inherit', textDecoration: 'none', display: 'block' }}>
                <Cover title={v.t} kind="video" style={{ aspectRatio: '16 / 10' }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{v.t}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>▶ VÍDEO · {v.dur}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Nuevo esta semana */}
          <div className="section-label">Nuevo esta semana</div>
          <div className="grid grid-3">
            {newThisWeek.map((t) => (
              <div key={t} className="card card-md" style={{ padding: 14 }}>
                <span className="badge-new">NUEVO</span>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Herramienta destacada */}
          <div className="section-label">Herramienta destacada</div>
          <div className="card card-md" style={{ padding: 16, marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>▦ PLANTILLA · PDF/DOCX</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Modelo de email de reclamación de factura vencida</div>
            <Link to="/app/documento" className="btn btn-dark btn-block btn-sm">↓ Descargar</Link>
          </div>

          {/* Pregunta del mes */}
          <div className="section-label">Pregunta del mes</div>
          <div style={{ background: 'var(--brand-soft)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>¿Cuándo prescribe una deuda comercial?</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              Con carácter general, la acción para reclamar deudas comerciales prescribe a los 5 años…
            </div>
          </div>

          {/* Próximo directo */}
          <div className="section-label">Próximo directo</div>
          <div className="card card-md" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <Avatar size={36} />
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>Pere Brachfield</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6, lineHeight: 1.3 }}>
              Cómo reclamar una deuda sin deteriorar la relación comercial
            </div>
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>18 septiembre · 17:00</div>
            <Link to="/app/confirmacion" className="btn btn-primary btn-block btn-sm">Reservar plaza</Link>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 1100px) { .home-cols { grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
