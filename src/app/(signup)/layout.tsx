import Link from 'next/link'
import { BrandLogo } from '@/components/brand/logo'

// El alta tiene su propio lienzo, más ancho que el de login/recuperación:
// el formulario convive con el panel de beneficios en desktop.
export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-bg px-4 py-8 sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/"
          className="mb-7 flex justify-center no-underline sm:mb-9"
          aria-label="Brachfield Academy — inicio"
        >
          <BrandLogo height={34} />
        </Link>
        {children}
      </div>
    </main>
  )
}
