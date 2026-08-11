import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { getAdminKpis, getSearchStats } from '@/features/admin/service'

export const metadata = { title: 'Administración · Resumen' }

function Kpi({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-2xl font-bold text-brand">{value}</p>
      <p className="text-[12.5px] text-muted">{label}</p>
    </div>
  )
}

export default async function AdminOverviewPage() {
  await requireRole('ADMIN', 'EDITOR')
  const [kpis, searches] = await Promise.all([getAdminKpis(), getSearchStats()])

  return (
    <div>
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Kpi value={kpis.activeMembers} label="Miembros activos" />
        <Kpi value={kpis.newUsers30d} label="Altas (30 días)" />
        <Kpi value={kpis.downloads30d} label="Descargas (30 días)" />
        <Kpi value={kpis.upcomingReservations} label="Plazas reservadas" />
        <Kpi value={kpis.pendingQuestions} label="Preguntas pendientes" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-1 text-[13px] font-semibold text-ink-2">Búsquedas más frecuentes</h2>
          <p className="mb-3 text-[12.5px] text-muted">Últimos 30 días</p>
          {searches.top.length === 0 ? (
            <p className="text-[13px] text-muted">Aún no hay búsquedas registradas.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {searches.top.map((s) => (
                <li key={s.query} className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate">{s.query}</span>
                  <span className="font-mono text-[11px] text-muted">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-1 text-[13px] font-semibold text-ink-2">Búsquedas sin resultados</h2>
          <p className="mb-3 text-[12.5px] text-muted">
            Lo que la gente busca y no encuentra — ideas de contenido nuevo
          </p>
          {searches.noResults.length === 0 ? (
            <p className="text-[13px] text-muted">Ninguna búsqueda se quedó sin resultados. 🎉</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {searches.noResults.map((s) => (
                <li key={s.query} className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate">{s.query}</span>
                  <span className="font-mono text-[11px] text-muted">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-5 text-[12.5px] text-muted">
        Los indicadores completos de producto llegan en la fase de Analytics.{' '}
        <Link href="/app/admin/users" className="text-brand-link no-underline hover:underline">
          Ver usuarios →
        </Link>
      </p>
    </div>
  )
}
