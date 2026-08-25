import Link from 'next/link'
import { BrandLogo } from '@/components/brand/logo'

function Topbar() {
  return (
    <header>
      {/* Móvil: banda azul superior con el acceso, y el logo con su propia
          fila entera (diseño del propietario, 2026-08-20). */}
      <div className="bg-brand sm:hidden">
        <div className="mx-auto flex max-w-6xl justify-end px-5 py-1.5">
          <Link
            href="/login"
            className="whitespace-nowrap text-[13px] font-medium text-white no-underline"
          >
            Acceso alumnos
          </Link>
        </div>
      </div>
      <div className="border-b border-border-soft bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="no-underline" aria-label="Brachfield Academy — inicio">
            <span className="sm:hidden">
              <BrandLogo height={32} />
            </span>
            <span className="hidden sm:inline">
              <BrandLogo height={38} />
            </span>
          </Link>
          {/* Desktop: enlace discreto — el protagonismo es del CTA de alta. */}
          <Link
            href="/login"
            className="hidden whitespace-nowrap text-[13.5px] font-medium text-ink-2 underline decoration-border-input underline-offset-4 hover:text-brand-link hover:decoration-brand-link sm:inline"
          >
            Acceso alumnos
          </Link>
        </div>
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
