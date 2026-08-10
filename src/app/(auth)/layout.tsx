import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 block text-center text-base font-bold text-ink no-underline">
          Brachfield <span className="text-brand-link">Academy</span>
        </Link>
        <div className="rounded-xl border border-border bg-surface p-8">{children}</div>
      </div>
    </main>
  )
}
