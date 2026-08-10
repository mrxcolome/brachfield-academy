import { redirect } from 'next/navigation'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { hasMemberAccess } from '@/features/billing/access'
import { startCheckout } from '@/features/billing/actions'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Suscripción' }

const INCLUDES = [
  'Biblioteca completa de cursos y vídeos',
  'Todas las herramientas y plantillas descargables',
  'Podcasts y guías legales actualizadas',
  'Sesiones mensuales en directo con Pere',
  'Certificados de finalización',
  'Acceso desde cualquier dispositivo',
]

export default async function CheckoutPage() {
  const user = await requireUser()
  const subscription = await db.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
  if (hasMemberAccess(subscription?.status)) redirect('/app')

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8">
        <p className="mb-1 font-mono text-[11px] tracking-wide text-muted uppercase">Paso 2 de 3</p>
        <h1 className="mb-1 text-xl font-bold">Plan Profesional</h1>
        <p className="mb-5 text-3xl font-bold">
          39 €<span className="text-base font-medium text-muted">/mes</span>
        </p>
        <ul className="mb-6 flex flex-col gap-2.5">
          {INCLUDES.map((item) => (
            <li key={item} className="flex gap-2 text-[13.5px]">
              <span aria-hidden className="text-success">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <form action={startCheckout}>
          <Button type="submit" block size="lg">
            Continuar al pago seguro
          </Button>
        </form>
        <p className="mt-3 text-center font-mono text-[11.5px] text-muted-2">
          Pago gestionado por Stripe · Cancela cuando quieras
        </p>
      </div>
    </main>
  )
}
