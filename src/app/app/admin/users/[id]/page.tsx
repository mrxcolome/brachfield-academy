import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/features/auth/guards'
import { getStudentActivity } from '@/features/admin/service'
import { buildStudentTimeline } from '@/features/admin/activity'

export const metadata = { title: 'Administración · Actividad del alumno' }

const SUB_LABEL: Record<string, string> = {
  ACTIVE: 'Activa',
  TRIALING: 'Prueba',
  PAST_DUE: 'Pago pendiente',
  CANCELED: 'Cancelada',
  INCOMPLETE: 'Incompleta',
  EXPIRED: 'Expirada',
}

const dateTime = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Madrid',
})

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('ADMIN')
  const { id } = await params
  const data = await getStudentActivity(id)
  if (!data) notFound()

  const { user } = data
  const timeline = await buildStudentTimeline(data)
  const sub = user.subscriptions[0]

  return (
    <div>
      <Link href="/app/admin/users" className="text-[13px] text-brand-link">
        ← Volver a alumnos
      </Link>

      <div className="mt-4 mb-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-bold">
          {user.name} {user.lastName ?? ''}
        </h2>
        <p className="text-[13px] text-muted">{user.email}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-5">
          <div>
            <dt className="font-mono text-[11px] tracking-wide text-muted uppercase">Empresa</dt>
            <dd>{user.company ?? '—'}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-wide text-muted uppercase">
              Suscripción
            </dt>
            <dd className={sub?.status === 'ACTIVE' ? 'font-semibold text-success' : ''}>
              {sub ? (SUB_LABEL[sub.status] ?? sub.status) : 'Sin suscripción'}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-wide text-muted uppercase">Alta</dt>
            <dd className="font-mono text-[12px]">{dateTime.format(user.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-wide text-muted uppercase">
              Último acceso
            </dt>
            <dd className="font-mono text-[12px]">
              {user.lastLoginAt ? dateTime.format(user.lastLoginAt) : '—'}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-wide text-muted uppercase">Nº accesos</dt>
            <dd className="font-mono text-[12px]">{user.loginCount}</dd>
          </div>
        </dl>
      </div>

      <h3 className="mb-3 text-[15px] font-bold">Actividad reciente</h3>
      {timeline.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
          Todavía no hay actividad registrada para este alumno.
        </p>
      ) : (
        <ol className="rounded-lg border border-border bg-surface">
          {timeline.map((e, i) => (
            <li
              key={`${e.at.toISOString()}-${i}`}
              className="flex items-baseline gap-3 border-b border-border-soft px-4 py-2.5 text-[13px] last:border-0"
            >
              <span aria-hidden className="w-4 text-center text-brand-link">
                {e.glyph}
              </span>
              <span className="flex-1">{e.text}</span>
              <span className="font-mono text-[11.5px] whitespace-nowrap text-muted">
                {dateTime.format(e.at)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
