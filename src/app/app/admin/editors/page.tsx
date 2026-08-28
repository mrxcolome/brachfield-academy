import { requireRole } from '@/features/auth/guards'
import { getEditorialActivity } from '@/features/admin/service'

export const metadata = { title: 'Administración · Editores' }

const ACTION_LABEL: Record<string, string> = {
  LOGIN: 'Inició sesión',
  CREATE: 'Creó',
  UPDATE: 'Publicó cambios en',
  DELETE: 'Eliminó',
}

const COLLECTION_LABEL: Record<string, string> = {
  contents: 'el contenido',
  courses: 'el curso',
  events: 'el evento',
  media: 'el archivo',
}

const dateTime = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Madrid',
})

export default async function AdminEditorsPage() {
  await requireRole('ADMIN')
  const { recent, summary } = await getEditorialActivity()

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Actividad del equipo editorial en el CMS: accesos y cambios de contenido. Se registra desde
        el 28/08/26.
      </p>

      {summary.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface p-5 text-sm text-muted">
          Aún no hay actividad editorial registrada. Aparecerá aquí en cuanto un editor entre en el
          CMS o publique un cambio.
        </p>
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.map((e) => (
              <div key={e.email} className="rounded-lg border border-border bg-surface p-4">
                <p className="font-semibold">{e.name}</p>
                <p className="mb-3 text-[12px] text-muted">{e.email}</p>
                <dl className="flex flex-col gap-1 text-[12.5px]">
                  <div className="flex justify-between">
                    <dt className="text-muted">Último acceso</dt>
                    <dd className="font-mono text-[11.5px]">
                      {e.lastLogin ? dateTime.format(e.lastLogin) : '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Cambios últimos 30 días</dt>
                    <dd className="font-semibold">{e.changes30d}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <h3 className="mb-3 text-[15px] font-bold">Actividad reciente</h3>
          <ol className="rounded-lg border border-border bg-surface">
            {recent.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border-soft px-4 py-2.5 text-[13px] last:border-0"
              >
                <span className="font-semibold">{a.editorName}</span>
                <span className="flex-1">
                  {ACTION_LABEL[a.action] ?? a.action}
                  {a.collection ? ` ${COLLECTION_LABEL[a.collection] ?? a.collection}` : ''}
                  {a.docTitle ? ` «${a.docTitle}»` : ''}
                </span>
                <span className="font-mono text-[11.5px] whitespace-nowrap text-muted">
                  {dateTime.format(a.createdAt)}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
