import { requireActiveMember } from '@/features/auth/guards'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata = { title: 'Mi formación' }

export default async function Page() {
  await requireActiveMember()
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Mi formación</h1>
      <EmptyState
        icon="▤"
        title="Esta sección está en construcción"
        description="Estamos preparando el contenido. Muy pronto la encontrarás aquí — te avisaremos."
      />
    </div>
  )
}
