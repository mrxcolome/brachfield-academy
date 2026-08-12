// Sentry (Fase 18): monitorización de errores en producción.
// Sin SENTRY_DSN es un no-op — mismo patrón que EmailService y Analytics.
import * as Sentry from '@sentry/nextjs'

export async function register() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return
  if (process.env.NEXT_RUNTIME !== 'nodejs') return // el middleware (edge) no lo necesita
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1, // 10% de trazas de rendimiento: suficiente y barato
    enableLogs: false,
  })
}

export const onRequestError = Sentry.captureRequestError
