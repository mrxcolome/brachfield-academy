import Link from 'next/link'

export const metadata = { title: 'Pago completado', robots: { index: false } }

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center">
        <div aria-hidden className="mb-3 text-3xl text-success">
          ✓
        </div>
        <h1 className="mb-2 text-xl font-bold">Suscripción activada</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">
          Bienvenido a Brachfield Academy. Tu acceso completo ya está disponible.
        </p>
        <Link
          href="/app"
          className="block rounded-sm bg-brand px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
        >
          Ir a mi Academia
        </Link>
      </div>
    </main>
  )
}
