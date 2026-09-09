'use client'

import { useEffect, useState } from 'react'
import { marcarTourVisto } from '@/features/welcome/actions'

interface Step {
  selector: string | null
  title: string
  text: string
}

// Las 6 paradas del tour, sobre el menú real. En móvil (sin sidebar) las
// tarjetas salen centradas, sin foco.
const STEPS: Step[] = [
  {
    selector: '#global-search',
    title: 'El buscador',
    text: 'Tu atajo para todo: escribe la duda («burofax», «intereses de demora»…) y te llevamos a la pieza que la resuelve.',
  },
  {
    selector: 'aside a[href="/app/learning"]',
    title: 'Mi formación',
    text: 'Tus cursos, con el progreso guardado. Puedes parar cuando quieras y continuar justo donde lo dejaste.',
  },
  {
    selector: 'aside a[href="/app/explore"]',
    title: 'Explorar',
    text: 'El escaparate de todo el catálogo: los cursos y las nueve tipologías de piezas, cada una con su promesa. Cuando no sepas por dónde empezar, empieza aquí.',
  },
  {
    selector: 'aside a[href="/app/updates"]',
    title: 'Actualidad',
    text: 'Cada día, la noticia del sector que de verdad importa — con la clave de por qué te afecta a ti. Las sesiones en directo con Pere las encontrarás desde Explorar.',
  },
  {
    selector: 'aside a[href="/app/new"]',
    title: 'Nuevo este mes',
    text: 'Cada mes publicamos contenido nuevo. Aquí lo encontrarás todo, mes a mes, con la etiqueta naranja NUEVO.',
  },
  {
    selector: 'aside a[href="/app/favorites"]',
    title: 'Favoritos',
    text: 'Guarda cualquier pieza con el botón «Guardar» y tenla siempre a mano aquí.',
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export function NavTour() {
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(true)
  const [rect, setRect] = useState<Rect | null>(null)

  const current = STEPS[step] ?? STEPS[0]!

  useEffect(() => {
    if (!open) return
    function measure() {
      const el = current.selector ? document.querySelector(current.selector) : null
      if (el instanceof HTMLElement && el.offsetWidth > 0) {
        const r = el.getBoundingClientRect()
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
      } else {
        setRect(null)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [current, open])

  if (!open) return null

  function close() {
    setOpen(false)
    void marcarTourVisto()
  }

  const last = step === STEPS.length - 1
  // Tooltip junto al elemento enfocado (a su derecha); centrado si no hay foco
  const tooltipStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: Math.min(Math.max(rect.top - 12, 16), window.innerHeight - 260),
        left: Math.min(rect.left + rect.width + 20, window.innerWidth - 380),
      }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tour del área de alumnos"
      className="fixed inset-0 z-50"
    >
      <div className="absolute inset-0 bg-[rgba(13,20,32,0.55)]" onClick={close} />
      {rect && (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-lg bg-white/10 ring-3 ring-accent"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
        />
      )}
      <div
        style={tooltipStyle}
        className="w-[min(88vw,352px)] rounded-lg bg-surface p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      >
        <p className="mb-1.5 font-mono text-[10.5px] tracking-wider text-muted uppercase">
          Paso {step + 1} de {STEPS.length}
        </p>
        <p className="mb-1 text-[15px] font-bold">{current.title}</p>
        <p className="mb-4 text-[13px] leading-relaxed text-ink-3">{current.text}</p>
        <div className="flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={close}
            className="cursor-pointer text-[12.5px] text-muted hover:text-ink"
          >
            Saltar el tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="cursor-pointer rounded-sm border border-border-input px-3.5 py-2 text-[13px] font-semibold text-ink-2 hover:border-brand-link"
              >
                Anterior
              </button>
            )}
            <button
              type="button"
              onClick={() => (last ? close() : setStep((s) => s + 1))}
              className="cursor-pointer rounded-sm bg-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-brand-hover"
            >
              {last ? 'Terminar' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
