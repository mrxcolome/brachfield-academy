// Formateo de fechas de eventos. En BD todo es UTC; el directo se anuncia
// en hora peninsular española (el público del producto).

export function formatEventDate(iso: string): string {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(d)
  const time = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(d)
  return `${date} · ${time}h (hora peninsular)`
}

/** Bloque compacto para las cards: { day: '21', month: 'AGO' } */
export function eventDateBlock(iso: string): { day: string; month: string } {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(d)
  const month = new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: 'Europe/Madrid' })
    .format(d)
    .replace('.', '')
    .toUpperCase()
  return { day, month }
}
