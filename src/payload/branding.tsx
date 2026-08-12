// Marca de Brachfield Academy en el panel de Payload (pedido del propietario):
// el login y la esquina del panel muestran el logo oficial (cuatro cuadrados),
// tal cual, en positivo (tema claro) o negativo (tema oscuro): con tema oscuro
// el cuadrado girado pasa a blanco, "Brachfield" a blanco y "Academy" a
// naranja — versiones cerradas por el propietario, no inventar colores.
// Payload marca el tema con data-theme en <html>; el cambio se hace por CSS.
// Tras editar este archivo: npx payload generate:importmap
import React from 'react'

const NAVY = '#2b4a7c'
const ORANGE = '#ee8b0a'

const themeCss = `
  .ba-logo .ba-tilt { fill: ${NAVY}; }
  .ba-logo .ba-word-1 { color: var(--theme-elevation-800, #1c1c1c); }
  .ba-logo .ba-word-2 { color: ${NAVY}; }
  html[data-theme='dark'] .ba-logo .ba-tilt { fill: #ffffff; }
  html[data-theme='dark'] .ba-logo .ba-word-1 { color: #ffffff; }
  html[data-theme='dark'] .ba-logo .ba-word-2 { color: ${ORANGE}; }
`

function Squares({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      <rect
        className="ba-tilt"
        x="4"
        y="10"
        width="38"
        height="38"
        rx="3"
        transform="rotate(-12 23 29)"
      />
      <rect x="54" y="12" width="34" height="34" rx="3" fill={ORANGE} />
      <rect x="10" y="54" width="34" height="34" rx="3" fill={ORANGE} />
      <rect x="54" y="54" width="34" height="34" rx="3" fill={ORANGE} />
    </svg>
  )
}

/** Logo del login del panel: icono + wordmark + subtítulo. */
export function Logo() {
  return (
    <span
      className="ba-logo"
      role="img"
      aria-label="Brachfield Academy"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}
    >
      <style>{themeCss}</style>
      <Squares size={52} />
      <span
        style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, textAlign: 'left' }}
      >
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>
          <span className="ba-word-1">Brachfield</span> <span className="ba-word-2">Academy</span>
        </span>
        <span
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--theme-elevation-500, #808080)' }}
        >
          Panel de contenido
        </span>
      </span>
    </span>
  )
}

/** Icono compacto de la esquina del panel. */
export function Icon() {
  return (
    <span
      className="ba-logo"
      role="img"
      aria-label="Brachfield Academy"
      style={{ display: 'inline-flex' }}
    >
      <style>{themeCss}</style>
      <Squares size={26} />
    </span>
  )
}
