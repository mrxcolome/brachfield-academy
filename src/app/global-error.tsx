'use client'

// Errores de render no capturados en el App Router: se reportan a Sentry
// (si está configurado) y se muestra un mensaje digno en español.
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="es">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
          background: '#f7f5f0',
          color: '#282c38',
        }}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ fontSize: 40, margin: 0 }} aria-hidden>
            ⚠
          </p>
          <h1 style={{ fontSize: 20, margin: '8px 0' }}>Algo no ha ido bien</h1>
          <p style={{ color: '#4c5164', maxWidth: 420 }}>
            Ha ocurrido un error inesperado. Ya estamos avisados — puedes intentarlo de nuevo.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#25355e',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              padding: '10px 22px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
