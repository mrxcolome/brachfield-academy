// Regla del primer aterrizaje (decisión del propietario, 2026-09-09):
// el Inicio muestra la bienvenida-escaparate hasta que el alumno completa
// «Tus primeros pasos» o pasan 14 días del alta — lo que llegue antes.

export const WELCOME_WINDOW_DAYS = 14

export interface ChecklistItem {
  key: string
  label: string
  detail: string
  href: string
  done: boolean
}

export function isWelcomeActive(
  createdAt: Date,
  checklist: Pick<ChecklistItem, 'done'>[],
  now: Date = new Date(),
): boolean {
  const ageMs = now.getTime() - createdAt.getTime()
  if (ageMs > WELCOME_WINDOW_DAYS * 24 * 60 * 60 * 1000) return false
  if (checklist.length > 0 && checklist.every((i) => i.done)) return false
  return true
}
