// Marca de Brachfield Academy en el panel de Payload (pedido del propietario):
// el login y la esquina del panel muestran los SVG OFICIALES de public/brand/
// tal cual — positivo en tema claro, negativo en tema oscuro (Payload marca el
// tema con data-theme en <html>; el cambio se hace por CSS).
// Tras editar este archivo: npx payload generate:importmap
import React from 'react'

const themeCss = `
  .ba-logo .ba-neg { display: none; }
  html[data-theme='dark'] .ba-logo .ba-pos { display: none; }
  html[data-theme='dark'] .ba-logo .ba-neg { display: inline-block; }
`

/** Logo del login del panel: el logo completo oficial. */
export function Logo() {
  return (
    <span className="ba-logo" style={{ display: 'inline-flex' }}>
      <style>{themeCss}</style>
      <img
        className="ba-pos"
        src="/brand/logo.svg"
        alt="Brachfield Academy"
        style={{ height: 44, width: 'auto' }}
      />
      <img
        className="ba-neg"
        src="/brand/logo-neg.svg"
        alt="Brachfield Academy"
        style={{ height: 44, width: 'auto' }}
      />
    </span>
  )
}

/** Icono compacto de la esquina del panel: solo el símbolo. */
export function Icon() {
  return (
    <span className="ba-logo" style={{ display: 'inline-flex' }}>
      <style>{themeCss}</style>
      <img
        className="ba-pos"
        src="/brand/icon.svg"
        alt="Brachfield Academy"
        style={{ height: 26, width: 'auto' }}
      />
      <img
        className="ba-neg"
        src="/brand/icon-neg.svg"
        alt="Brachfield Academy"
        style={{ height: 26, width: 'auto' }}
      />
    </span>
  )
}
