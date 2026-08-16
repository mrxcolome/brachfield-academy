import Link from 'next/link'
import { BrandLogo } from '@/components/brand/logo'

function Topbar() {
  return (
    <header className="border-b border-border-soft bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="no-underline" aria-label="Brachfield Academy — inicio">
          {/* Más grande en móvil y aún más en desktop (pedido del propietario). */}
          <span className="sm:hidden">
            <BrandLogo height={26} />
          </span>
          <span className="hidden sm:inline">
            <BrandLogo height={38} />
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
      <div className="mx-auto max-w-6xl px-5 py-8 text-[13px] text-muted">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <BrandLogo height={22} />
            <p className="mt-2">La escuela del ciclo completo del crédito comercial B2B.</p>
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
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border-soft pt-4 text-[12.5px]">
          <Link href="/legal/aviso-legal" className="text-inherit">
            Aviso legal
          </Link>
          <Link href="/legal/privacidad" className="text-inherit">
            Privacidad
          </Link>
          <Link href="/legal/condiciones" className="text-inherit">
            Condiciones
          </Link>
          <Link href="/legal/cookies" className="text-inherit">
            Cookies
          </Link>
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
