import Link from 'next/link'

function Topbar() {
  return (
    <header className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="text-base font-bold text-ink no-underline">
          Brachfield <span className="text-brand-link">Academy</span>
        </Link>
        <nav
          aria-label="Principal"
          className="hidden items-center gap-7 text-sm text-ink-3 sm:flex"
        >
          <Link href="/#membresia" className="text-inherit no-underline hover:text-ink">
            Membresía
          </Link>
          <Link href="/courses" className="text-inherit no-underline hover:text-ink">
            Explorar
          </Link>
          <Link href="/#sobre-pere" className="text-inherit no-underline hover:text-ink">
            Sobre Pere
          </Link>
          <Link href="/pricing" className="text-inherit no-underline hover:text-ink">
            Precio
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink-3 no-underline hover:text-ink">
            Entrar
          </Link>
          <Link
            href="/signup"
            className="rounded-sm bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline hover:bg-brand-hover"
          >
            Acceder a Brachfield Academy
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-[13px] text-muted sm:flex-row">
        <div>
          <p className="font-bold text-ink">
            Brachfield <span className="text-brand-link">Academy</span>
          </p>
          <p className="mt-1">Credit Management, prevención de impagos y recobro.</p>
        </div>
        <div className="flex gap-6">
          <Link href="/pricing" className="text-inherit">
            Precio
          </Link>
          <Link href="/courses" className="text-inherit">
            Cursos
          </Link>
          <a href="https://perebrachfield.com" rel="noopener" className="text-inherit">
            perebrachfield.com
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      {children}
      <Footer />
    </>
  )
}
