import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { AdminTabs } from './admin-tabs'

export const metadata = { title: 'Administración' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRole('ADMIN', 'EDITOR')
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/app/sala" className="text-[13px] text-brand-link">
        ← Sala de profesores
      </Link>
      <div className="mt-2 mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">Administración</h1>
        <span className="flex flex-wrap gap-x-5 gap-y-1">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- /docs/* son HTML servidos por una ruta, no páginas */}
          <a
            href="/docs"
            className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
          >
            Documentación →
          </a>
          {role === 'ADMIN' && (
            <Link
              href="/admin"
              target="_blank"
              className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
            >
              Abrir el editor de contenido (CMS) ↗
            </Link>
          )}
        </span>
      </div>
      <p className="mb-5 text-sm text-muted">
        {role === 'ADMIN'
          ? 'Alumnos, preguntas y actividad. El contenido se publica desde la Sala de profesores.'
          : 'Preguntas de los alumnos, eventos y huecos del buscador.'}
      </p>
      <AdminTabs isAdmin={role === 'ADMIN'} />
      {children}
    </div>
  )
}
