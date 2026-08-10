import { Link } from 'react-router-dom'
import { toolDocs, tools } from '../../data/content'

const groups: { label: string; items: string[] }[] = [
  { label: 'MODELOS DE COMUNICACIÓN', items: tools.comunicacion },
  { label: 'CHECKLISTS', items: tools.checklists },
  { label: 'PLANTILLAS', items: tools.plantillas },
  { label: 'CALCULADORAS', items: tools.calculadoras },
  { label: 'SCRIPTS', items: tools.scripts },
]

export default function Herramientas() {
  return (
    <>
      <h1 className="page-title">Herramientas</h1>
      <p className="page-sub">Recursos listos para usar mañana mismo en tu empresa.</p>

      {/* Herramienta destacada con contenido real */}
      <div className="card" style={{ padding: 22, marginBottom: 26, maxWidth: 860 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>▦ DESTACADA · {toolDocs['Email de factura vencida'].formato}</div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Email de factura vencida</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-3)', margin: '0 0 14px' }}>{toolDocs['Email de factura vencida'].desc}</p>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border-faint)', borderRadius: 8, padding: '16px 18px', fontSize: 13, lineHeight: 1.7, color: 'var(--ink-2)' }}>
          {toolDocs['Email de factura vencida'].body.map((line, i) => (
            <p key={i} style={{ margin: i === 0 ? '0 0 10px' : '0 0 8px', fontWeight: i === 0 ? 600 : 400 }}>{line}</p>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button className="btn btn-primary btn-sm">↓ Descargar DOCX</button>
          <button className="btn btn-outline btn-sm">Copiar texto</button>
        </div>
      </div>
      <div className="grid grid-5" style={{ gap: 16, alignItems: 'start' }}>
        {groups.map((g) => (
          <div key={g.label}>
            <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--brand-link)', marginBottom: 10 }}>{g.label}</div>
            {g.items.map((t) => (
              <Link key={t} to="/app/documento" className="card" style={{ borderRadius: 8, padding: 12, marginBottom: 8, display: 'block', color: 'var(--ink)', textDecoration: 'none' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, display: 'block' }}>{t}</span>
                {toolDocs[t] && <span style={{ fontSize: 11.5, color: 'var(--muted)', display: 'block', marginTop: 4, lineHeight: 1.45 }}>{toolDocs[t].desc}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
