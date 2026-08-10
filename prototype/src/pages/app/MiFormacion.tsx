const stats = [
  { n: '3', l: 'Cursos en progreso' },
  { n: '2', l: 'Itinerarios en progreso' },
  { n: '7', l: 'Cursos completados' },
  { n: '18h 40m', l: 'Horas de formación' },
]

export default function MiFormacion() {
  return (
    <>
      <h1 className="page-title" style={{ marginBottom: 22 }}>Mi formación</h1>
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.l} className="card card-md" style={{ padding: 18 }}>
            <div className="mono" style={{ fontSize: 26, fontWeight: 700 }}>{s.n}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="section-label">Certificados</div>
      <div className="grid grid-3">
        <div className="card card-md" style={{ padding: 18 }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 6 }}>CERTIFICADO</div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, lineHeight: 1.3 }}>Especialista en Prevención de Impagos</div>
          <button className="btn btn-dark btn-sm" style={{ fontSize: 12 }}>↓ Descargar PDF</button>
        </div>
      </div>
    </>
  )
}
