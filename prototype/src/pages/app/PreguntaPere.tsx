import { FormEvent, useState } from 'react'

export default function PreguntaPere() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }
  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h1 className="page-title">Pregunta a Pere</h1>
      <p className="page-sub">Algunas preguntas se responden en vídeo o en el Q&amp;A mensual.</p>
      {sent ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 34, color: 'var(--success)', marginBottom: 14 }} aria-hidden>✓</div>
          <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Pregunta enviada</h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            Si Pere la selecciona, la respuesta aparecerá por escrito, en vídeo corto o en el próximo Q&amp;A mensual.
          </p>
        </div>
      ) : (
        <form className="card" style={{ padding: 24 }} onSubmit={onSubmit}>
          <label className="field-label" htmlFor="qp-cat">Categoría</label>
          <select id="qp-cat" className="select" style={{ marginBottom: 16, fontSize: 13.5 }}>
            <option>Recobro de impagados</option>
            <option>Prevención de impagos</option>
            <option>Riesgo de crédito</option>
            <option>Negociación</option>
            <option>Legislación</option>
          </select>
          <label className="field-label" htmlFor="qp-q">¿Cuál es tu pregunta?</label>
          <textarea
            id="qp-q"
            className="textarea"
            style={{ marginBottom: 18, fontSize: 13.5 }}
            placeholder="Un cliente me debe una factura desde hace 120 días. ¿Qué pasos debería seguir?"
          />
          <button type="submit" className="btn btn-primary btn-block">Enviar pregunta</button>
        </form>
      )}
    </div>
  )
}
