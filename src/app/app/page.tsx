import { requireActiveMember } from '@/features/auth/guards'
import Link from 'next/link'

export const metadata = { title: 'Inicio' }

// Placeholder del área privada: la Home real llega en Fases 6 y 13.
export default async function AppHome() {
  const { user } = await requireActiveMember()
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-2xl font-bold">Hola, {user.name.split(' ')[0]}</h1>
      <p className="mb-8 text-sm text-muted">
        Tu membresía está activa. Estamos construyendo tu área privada — mientras tanto puedes
        gestionar tu suscripción.
      </p>
      <Link href="/app/account/billing" className="text-sm font-semibold">
        Mi suscripción →
      </Link>
    </main>
  )
}
