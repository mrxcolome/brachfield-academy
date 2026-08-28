import Link from 'next/link'
import { SignupSteps } from '../../steps'

export const metadata = { title: 'Pago completado', robots: { index: false } }

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
      <div className="text-left">
        <SignupSteps current={3} />
      </div>
      <div aria-hidden className="mb-3 text-3xl text-success">
        ✓
      </div>
      <h1 className="mb-2 text-xl font-bold">Suscripción activada</h1>
      <p className="mb-6 text-sm leading-relaxed text-muted">
        Bienvenido a Brachfield Academy. Un último paso: cuéntanos tu perfil para personalizar tu
        experiencia.
      </p>
      <Link
        href="/onboarding"
        className="block rounded-sm bg-brand px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
      >
        Continuar
      </Link>
    </div>
  )
}
