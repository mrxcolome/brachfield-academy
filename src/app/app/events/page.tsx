import { redirect } from 'next/navigation'

// Los directos viven ahora en Actualidad (rediseño 2026-09-09). La URL se
// mantiene por los enlaces antiguos (emails de reserva, marcadores).
export default function EventsPage() {
  redirect('/app/updates')
}
