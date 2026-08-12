// Marca de Brachfield Academy en el panel de Payload (pedido del propietario):
// el login y la esquina del panel muestran nuestra marca, no la de Payload.
import React from 'react'

const NAVY = '#25355e'
const GOLD = '#c49237'

/** Wordmark del login del panel. */
export function Logo() {
  return (
    <svg width="280" height="64" viewBox="0 0 280 64" role="img" aria-label="Brachfield Academy">
      <rect x="0" y="8" width="48" height="48" rx="10" fill={NAVY} />
      <text
        x="24"
        y="40"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="22"
        fill="#ffffff"
      >
        PB
      </text>
      <circle cx="41" cy="17" r="4" fill={GOLD} />
      <text
        x="60"
        y="34"
        fontFamily="system-ui, sans-serif"
        fontWeight="700"
        fontSize="21"
        fill={NAVY}
      >
        Brachfield
      </text>
      <text
        x="60"
        y="52"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        fontSize="15"
        fill={GOLD}
      >
        Academy · Contenido
      </text>
    </svg>
  )
}

/** Icono compacto de la esquina del panel. */
export function Icon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="Brachfield Academy">
      <rect x="0" y="0" width="26" height="26" rx="6" fill={NAVY} />
      <text
        x="13"
        y="18.5"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="12"
        fill="#ffffff"
      >
        PB
      </text>
      <circle cx="21" cy="5" r="2.4" fill={GOLD} />
    </svg>
  )
}
