import { Link } from 'react-router-dom'
import { aboutPere, faqAnswers, faqs, knowledgeAreas, personas, tools, whatsInside } from '../../data/content'
import { Avatar, DashboardMock, Portrait } from '../../components/art'

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--brand-soft)' }}>
        <div className="hero-grid" style={{ maxWidth: 1344, margin: '0 auto', padding: '72px 48px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40 }}>
          <div>
            <div style={{ display: 'inline-block', background: '#fff', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--brand-link)', marginBottom: 20 }}>
              Por Pere Brachfield · Credit &amp; Risk Consultants desde 1990
            </div>
            <h1 style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', lineHeight: 1.1, letterSpacing: '-0.015em', margin: '0 0 18px' }}>
              Domina el crédito.
              <br />
              Previene los impagos.
              <br />
              Cobra mejor.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 480, margin: '0 0 28px' }}>
              Formación, herramientas y conocimiento especializado en Credit Management y recobro de impagados, de la mano de Pere Brachfield.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              <Link to="/registro" className="btn btn-primary" style={{ padding: '14px 22px', fontSize: 15 }}>
                Acceder a Brachfield Academy
              </Link>
              <Link to="/catalogo" className="btn btn-outline" style={{ padding: '14px 22px', fontSize: 15 }}>
                Explorar contenidos
              </Link>
            </div>
            <div className="mono" style={{ fontSize: 13, color: 'oklch(38% 0.02 260)' }}>39 €/mes · Cancela cuando quieras</div>
          </div>
          <Portrait style={{ aspectRatio: '4 / 3' }} />
        </div>
      </section>

      {/* Qué encontrarás dentro */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 22px' }}>Qué encontrarás dentro</h2>
          <div className="grid grid-5">
            {whatsInside.map((w) => (
              <div key={w.l} style={{ border: '1px solid var(--border-soft)', borderRadius: 10, padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: 20, color: 'var(--brand-link)', marginBottom: 8 }} aria-hidden>{w.g}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{w.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Áreas de conocimiento */}
      <section style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 22px' }}>Áreas de conocimiento</h2>
          <div className="grid grid-4" style={{ gap: 12 }}>
            {knowledgeAreas.map((a) => (
              <div key={a} className="card card-md" style={{ padding: '16px 18px', fontSize: 14, fontWeight: 600 }}>{a}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Vista previa de la plataforma */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 8px' }}>Así se ve por dentro</h2>
          <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: '0 0 22px' }}>Tu formación, tus herramientas y la actualidad del sector, siempre a mano.</p>
          <DashboardMock style={{ height: 340 }} />
        </div>
      </section>

      {/* Formación práctica + contenido nuevo */}
      <section style={{ background: 'var(--border-soft)' }}>
        <div className="grid grid-2" style={{ gap: 1, maxWidth: 1344, margin: '0 auto' }}>
          <div style={{ background: '#fff', padding: 48 }}>
            <h3 style={{ fontSize: 20, margin: '0 0 12px' }}>Formación práctica, no solo teoría</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-3)', margin: 0 }}>
              El objetivo no es acumular conocimiento, sino resolver situaciones reales: qué decir a un cliente que no paga, cuándo escalar una reclamación, cómo estructurar tu política de crédito.
            </p>
          </div>
          <div style={{ background: '#fff', padding: 48 }}>
            <h3 style={{ fontSize: 20, margin: '0 0 12px' }}>Contenido nuevo cada semana</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-3)', margin: 0 }}>
              La morosidad y la legislación cambian constantemente. Brachfield Academy se actualiza para que tú no tengas que estar pendiente de todo.
            </p>
          </div>
        </div>
      </section>

      {/* Sesiones en directo */}
      <section style={{ background: 'var(--brand-soft)' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 22px' }}>Sesiones en directo con Pere Brachfield</h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: 22, display: 'flex', gap: 18, alignItems: 'center', maxWidth: 640, flexWrap: 'wrap' }}>
            <Avatar size={64} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Masterclass: reclamar una deuda sin deteriorar la relación comercial</div>
              <div className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>18 septiembre · 17:00 · 75 min</div>
            </div>
            <Link to="/registro" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>Reservar plaza</Link>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 22px' }}>Recursos que usarás mañana mismo</h2>
          <div className="grid grid-4">
            {tools.plantillas.slice(0, 4).map((t) => (
              <div key={t} style={{ border: '1px solid var(--border-soft)', borderRadius: 10, padding: 16 }}>
                <div className="mono" style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>▦ PLANTILLA</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Pere */}
      <section id="sobre-pere" style={{ background: 'var(--bg)' }}>
        <div className="about-grid" style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>
          <Portrait style={{ aspectRatio: '1' }} radius={12} />
          <div>
            <h2 style={{ fontSize: 22, margin: '0 0 10px' }}>Sobre Pere Brachfield</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-3)', maxWidth: 640, margin: 0 }}>{aboutPere.long}</p>
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 20px' }}>Para quién es</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {personas.map((p) => (
              <span key={p} className="chip-soft chip" style={{ cursor: 'default' }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: 'var(--surface-dark)', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '64px 48px' }}>
          <h2 style={{ fontSize: 24, margin: '0 0 8px' }}>Un único plan. Todo incluido.</h2>
          <p style={{ fontSize: 14.5, color: 'oklch(75% 0.01 260)', margin: '0 0 28px' }}>Sin niveles, sin letra pequeña.</p>
          <div style={{ background: 'var(--surface-dark-2)', borderRadius: 14, padding: 36, maxWidth: 340, margin: '0 auto' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'oklch(80% 0.03 258)', marginBottom: 6 }}>Plan Profesional</div>
            <div style={{ fontSize: 42, fontWeight: 700, marginBottom: 4 }}>
              39 €<span style={{ fontSize: 16, fontWeight: 500, color: 'var(--on-dark-muted)' }}>/mes</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'oklch(65% 0.01 260)', marginBottom: 22 }}>Cancela cuando quieras</div>
            <Link to="/registro" className="btn btn-accent btn-block" style={{ padding: 13, fontSize: 14.5 }}>
              Acceder a Brachfield Academy
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1344, margin: '0 auto', padding: '56px 48px' }}>
          <h2 style={{ fontSize: 22, margin: '0 0 20px' }}>Preguntas frecuentes</h2>
          <div style={{ maxWidth: 760 }}>
            {faqs.map((q) => (
              <details key={q} style={{ borderTop: '1px solid var(--border-soft)' }}>
                <summary style={{ padding: '16px 0', fontSize: 14.5, fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{q}</span>
                  <span style={{ color: 'var(--faint)' }} aria-hidden>＋</span>
                </summary>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-3)', margin: '0 0 16px' }}>{faqAnswers[q]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 40px 20px !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .about-grid > div[role="img"] { max-width: 200px; }
          main section > div { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </main>
  )
}
