import { redirect } from 'next/navigation'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { hasMemberAccess } from '@/features/billing/access'
import { startCheckout } from '@/features/billing/actions'
import { Button } from '@/components/ui/button'
import { SignupSteps } from '../steps'

export const metadata = { title: 'Activa tu acceso', robots: { index: false } }

const INCLUDES = [
  'Cursos, tutoriales y píldoras de Pere Brachfield',
  'Todas las herramientas y plantillas descargables',
  'Entrevistas, guías y casos prácticos',
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
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-6 sm:p-8">
      <SignupSteps current={2} />
      <h1 className="mb-2 text-xl font-bold sm:text-2xl">Activa tu acceso, {user.name}</h1>
      <p className="mb-6 text-sm leading-relaxed text-ink-2">
        Tu correo está confirmado y tu cuenta creada. Solo queda activar tu membresía de alumno con
        el pago seguro.
      </p>
      <div className="mb-6 rounded-lg border border-border-soft bg-brand-soft p-5">
        <p className="font-semibold">Plan Profesional</p>
        <p className="mb-4 text-3xl font-bold">
          39 €<span className="text-base font-medium text-muted">/mes</span>
        </p>
        <ul className="flex flex-col gap-2.5">
          {INCLUDES.map((item) => (
            <li key={item} className="flex gap-2 text-[13.5px]">
              <span aria-hidden className="text-success">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <form action={startCheckout}>
        <Button type="submit" block size="lg">
          Continuar al pago seguro
        </Button>
      </form>
      <p className="mt-3 text-center font-mono text-[11.5px] text-muted-2">
        Pago gestionado por Stripe · Sin permanencia · Cancela cuando quieras
      </p>
    </div>
  )
}
