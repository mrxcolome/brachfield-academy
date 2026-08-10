import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center">
        <p aria-hidden className="mb-3 font-mono text-3xl text-muted">
          404
        </p>
        <h1 className="mb-2 text-xl font-bold">Esta página no existe</h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">
          Puede que el enlace haya cambiado o que la página se haya movido.
        </p>
        <Link
          href="/"
          className="block rounded-sm bg-brand px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-brand-hover"
        >
          Ir a la portada
        </Link>
      </div>
    </main>
  )
}
