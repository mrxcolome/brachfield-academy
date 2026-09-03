import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { AdminTabs } from './admin-tabs'

export const metadata = { title: 'Administración' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRole('ADMIN', 'EDITOR')
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">Administración</h1>
        {role === 'ADMIN' && (
          <Link
            href="/admin"
            target="_blank"
            className="text-[13px] font-semibold text-brand-link no-underline hover:underline"
          >
            Abrir el editor de contenido (CMS) ↗
          </Link>
        )}
      </div>
      <p className="mb-5 text-sm text-muted">
        {role === 'ADMIN'
          ? 'Miembros, preguntas y actividad. El contenido se publica desde el CMS.'
          : 'Preguntas de los alumnos, eventos y huecos del buscador.'}
      </p>
      <AdminTabs isAdmin={role === 'ADMIN'} />
      {children}
    </div>
  )
}
