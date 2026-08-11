// AnalyticsService (Fase 15, briefing §45): ÚNICO punto de salida de eventos
// de producto. Nunca PostHog directo en componentes o actions.
//
// Decisiones:
// - Solo server-side (los eventos salen de actions/webhooks/páginas RSC):
//   sin SDK en el navegador → sin cookies de tracking → sin banner de cookies
//   por analítica. Host UE (datos en Europa).
// - Sin POSTHOG_API_KEY el servicio es un no-op (en dev imprime a consola).
// - track() NUNCA lanza: la analítica jamás rompe el producto.

export type AnalyticsEvent =
  // Adquisición y facturación
  | 'user_signed_up'
  | 'checkout_started'
  | 'subscription_activated'
  | 'subscription_canceled'
  | 'payment_failed'
  | 'onboarding_completed'
  // Aprendizaje
  | 'lesson_completed'
  | 'course_completed'
  | 'content_viewed'
  // Consulta
  | 'search_performed'
  | 'search_no_results'
  | 'tool_downloaded'
  // Implicación
  | 'favorite_added'
  | 'favorite_removed'
  | 'event_reserved'
  | 'event_reservation_canceled'
  | 'question_answered'

export interface TrackOptions {
  /** id del usuario (distinct_id). null/undefined → 'anonymous'. */
  userId?: string | null
  properties?: Record<string, string | number | boolean | null>
}

const HOST = () => process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com'

/** Envía un evento de producto. Fire-and-forget: no bloquea ni lanza. */
export function track(event: AnalyticsEvent, opts: TrackOptions = {}): void {
  const key = process.env.POSTHOG_API_KEY
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[analytics:dev] ${event}`, opts.properties ?? {})
    }
    return
  }

  void fetch(`${HOST()}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      event,
      distinct_id: opts.userId ?? 'anonymous',
      properties: { source: 'server', ...opts.properties },
      timestamp: new Date().toISOString(),
    }),
  }).catch((e) => {
    console.error(`[analytics] fallo al enviar "${event}"`, e)
  })
}
