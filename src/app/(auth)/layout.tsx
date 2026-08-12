import Link from 'next/link'
import { BrandLogo } from '@/components/brand/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex justify-center no-underline"
          aria-label="Brachfield Academy — inicio"
        >
          <BrandLogo height={30} />
        </Link>
        <div className="rounded-xl border border-border bg-surface p-8">{children}</div>
      </div>
    </main>
  )
}
