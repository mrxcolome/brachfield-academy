import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { listUsers } from '@/features/admin/service'
import { RoleSelect } from './role-select'
import { DeleteUserButton } from './delete-user-button'

export const metadata = { title: 'Administración · Usuarios' }

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Activa', className: 'text-success' },
  TRIALING: { label: 'Prueba', className: 'text-success' },
  PAST_DUE: { label: 'Pago pendiente', className: 'text-accent-ink' },
  CANCELED: { label: 'Cancelada', className: 'text-muted' },
  INCOMPLETE: { label: 'Incompleta', className: 'text-muted' },
  EXPIRED: { label: 'Expirada', className: 'text-muted' },
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { user: me } = await requireRole('ADMIN')
  const { q = '' } = await searchParams
  const users = await listUsers(q.trim() || undefined)

  return (
    <div>
      <form action="/app/admin/users" className="mb-4">
        <label htmlFor="user-q" className="sr-only">
          Buscar usuario
        </label>
        <input
          id="user-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Buscar por nombre, email o empresa…"
          className="w-full max-w-md rounded-full border border-border-input bg-surface px-4 py-2.5 text-sm placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </form>

      <p className="mb-3 font-mono text-xs text-muted">
        {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
        {users.length === 100 ? ' (mostrando los 100 más recientes)' : ''}
      </p>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border-soft text-left">
              <th className="px-4 py-2.5 font-semibold text-ink-2">Usuario</th>
              <th className="px-4 py-2.5 font-semibold text-ink-2">Empresa</th>
              <th className="px-4 py-2.5 font-semibold text-ink-2">Suscripción</th>
              <th className="px-4 py-2.5 font-semibold text-ink-2">Alta</th>
              <th className="px-4 py-2.5 font-semibold text-ink-2">Último acceso</th>
              <th className="px-4 py-2.5 font-semibold text-ink-2">Rol</th>
              <th className="px-4 py-2.5">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const sub = u.subscriptions[0]
              const status = sub ? STATUS_LABEL[sub.status] : null
              return (
                <tr key={u.id} className="border-b border-border-soft last:border-0">
                  <td className="px-4 py-2.5">
                    <Link href={`/app/admin/users/${u.id}`} className="no-underline">
                      <p className="font-semibold text-brand-link hover:underline">
                        {u.name} {u.lastName ?? ''}
                      </p>
                    </Link>
                    <p className="text-[12px] text-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-2.5 text-ink-2">{u.company ?? '—'}</td>
                  <td className="px-4 py-2.5">
                    {status ? (
                      <span className={`font-semibold ${status.className}`}>{status.label}</span>
                    ) : (
                      <span className="text-muted">Sin suscripción</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-muted">
                    {new Intl.DateTimeFormat('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    }).format(u.createdAt)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-muted">
                    {u.lastLoginAt
                      ? new Intl.DateTimeFormat('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Europe/Madrid',
                        }).format(u.lastLoginAt)
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    {u.id === me.id ? (
                      <span className="font-mono text-[11.5px] text-muted">{u.role} (tú)</span>
                    ) : (
                      <RoleSelect userId={u.id} initialRole={u.role} />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {u.id !== me.id && (
                      <DeleteUserButton userId={u.id} label={`${u.name} (${u.email})`} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
