import Link from 'next/link'
import { BrandLogo } from '@/components/brand/logo'

function Topbar() {
  return (
    <header className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="no-underline" aria-label="Brachfield Academy — inicio">
          {/* Más grande en móvil y aún más en desktop (pedido del propietario).
              Los spans envolventes controlan la visibilidad: el display base del
              propio BrandLogo pisaría un `hidden` aplicado directamente. */}
          <span className="sm:hidden">
            <BrandLogo markSize={34} textClassName="text-lg" />
          </span>
          <span className="hidden sm:inline">
            <BrandLogo markSize={40} textClassName="text-2xl" />
          </span>
        </Link>
        <Link
          href="/login"
          className="rounded-sm bg-brand px-4 py-2.5 text-[13.5px] font-semibold text-white no-underline hover:bg-brand-hover"
        >
          Acceso alumnos
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-[13px] text-muted sm:flex-row">
        <div>
          <BrandLogo markSize={22} textClassName="text-[14px]" />
          <p className="mt-2">Credit Management, prevención de impagos y recobro.</p>
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
