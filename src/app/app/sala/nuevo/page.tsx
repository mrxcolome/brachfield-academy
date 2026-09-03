import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { getCategories } from '@/features/content/service'
import { BasicsForm } from '../basics-form'

export const metadata = { title: 'Sala de profesores · Nuevo curso' }

export default async function SalaNuevoCursoPage() {
  await requireRole('ADMIN', 'EDITOR')
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/app/sala" className="text-[13px] text-brand-link">
        ← Sala de profesores
      </Link>
      <div className="mt-4 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <p className="mb-1 font-mono text-[11px] tracking-wide text-muted uppercase">Paso 1 de 4</p>
        <h1 className="mb-2 text-xl font-bold">El curso</h1>
        <p className="mb-6 text-sm text-ink-2">
          Tres datos y existe. Todo lo demás — portada, lecciones, publicación — viene después, a su
          paso.
        </p>
        <BasicsForm categories={categories.map((c) => ({ id: Number(c.id), name: c.name }))} />
      </div>
    </div>
  )
}
