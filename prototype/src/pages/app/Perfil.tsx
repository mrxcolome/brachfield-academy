import { useState } from 'react'
import { user } from '../../data/content'

function Toggle({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 13.5 }}>
      {label}
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn(!on)}
        style={{
          width: 36, height: 20, background: on ? 'var(--brand)' : 'var(--track)',
          borderRadius: 100, border: 'none', position: 'relative', cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{ width: 16, height: 16, background: '#fff', borderRadius: 100, position: 'absolute', top: 2, left: on ? 18 : 2, transition: 'left .12s ease' }} />
      </button>
    </div>
  )
}

const fields = [
  { l: 'Nombre', v: user.nombreCompleto },
  { l: 'Cargo', v: user.cargo },
  { l: 'Empresa', v: user.empresa },
  { l: 'Correo', v: user.email },
]

export default function Perfil() {
  return (
    <div style={{ maxWidth: 640 }}>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Perfil</h1>
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>Datos personales</div>
        <div className="grid grid-2">
          {fields.map((f) => (
            <div key={f.l}>
              <label className="field-label" style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400, marginBottom: 5 }} htmlFor={`pf-${f.l}`}>{f.l}</label>
              <input id={`pf-${f.l}`} className="input" defaultValue={f.v} style={{ padding: '9px 11px', fontSize: 13.5, borderColor: 'var(--border-chip)' }} />
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>Notificaciones</div>
        <Toggle label="Contenido nuevo" />
        <Toggle label="Recordatorios de eventos" />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" style={{ color: 'var(--ink-3)' }}>Cambiar contraseña</button>
        <button className="btn btn-ghost">Cerrar sesión</button>
      </div>
    </div>
  )
}
