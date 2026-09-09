// «Nuevo este mes»: una pieza es nueva durante sus primeros 30 días.
// Sale solo de publishedAt — cero trabajo editorial (decisión del propietario, 2026-09-09).

export const NEW_WINDOW_DAYS = 30

export function isNew(publishedAt: string | null | undefined, now: Date = new Date()): boolean {
  if (!publishedAt) return false
  const published = new Date(publishedAt)
  if (Number.isNaN(published.getTime())) return false
  const age = now.getTime() - published.getTime()
  return age >= 0 && age <= NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
}
