import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { updateProfile } from '@/features/users/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const metadata = { title: 'Mi perfil' }

const PROFILE_LABEL: Record<string, string> = {
  CFO: 'Director/a Financiero',
  CREDIT_MANAGER: 'Credit Manager',
  COLLECTIONS: 'Administración / Cobros',
  CONTROLLER: 'Controller',
  MANAGEMENT: 'Gerencia',
  LAWYER: 'Abogado/a',
  CONSULTANT: 'Consultor/a',
  OTHER: 'Otro',
}

export default async function AccountPage() {
  const user = await requireUser()
  const dbUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      name: true,
      lastName: true,
      email: true,
      company: true,
      jobTitle: true,
      professionalProfile: true,
      level: true,
      interests: true,
    },
  })

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Mi perfil</h1>

      <form action={updateProfile} className="mb-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-[13px] font-semibold text-ink-2">Datos personales</h2>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <Input name="name" label="Nombre" defaultValue={dbUser.name} required />
          <Input name="lastName" label="Apellidos" defaultValue={dbUser.lastName ?? ''} />
          <Input name="company" label="Empresa" defaultValue={dbUser.company ?? ''} />
          <Input name="jobTitle" label="Cargo" defaultValue={dbUser.jobTitle ?? ''} />
        </div>
        <p className="mb-4 text-[12.5px] text-muted">Correo: {dbUser.email}</p>
        <Button type="submit" size="sm">
          Guardar cambios
        </Button>
      </form>

      <div className="mb-4 rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-3 text-[13px] font-semibold text-ink-2">Preferencias de aprendizaje</h2>
        <p className="text-[13.5px] text-ink-3">
          <span className="font-semibold">Perfil:</span>{' '}
          {dbUser.professionalProfile ? PROFILE_LABEL[dbUser.professionalProfile] : 'Sin definir'} ·{' '}
          <span className="font-semibold">Nivel:</span>{' '}
          {dbUser.level === 'BEGINNER'
            ? 'Iniciación'
            : dbUser.level === 'INTERMEDIATE'
              ? 'Intermedio'
              : dbUser.level === 'ADVANCED'
                ? 'Avanzado'
                : 'Sin definir'}
        </p>
        {dbUser.interests.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {dbUser.interests.map((i) => (
              <span
                key={i}
                className="rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-medium text-brand"
              >
                {i}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-2 text-[13px] font-semibold text-ink-2">Suscripción</h2>
        <Link href="/app/account/billing" className="text-sm font-semibold">
          Gestionar mi suscripción →
        </Link>
      </div>
    </div>
  )
}
