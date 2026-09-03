import Link from 'next/link'
import { requireRole } from '@/features/auth/guards'
import { getCategories } from '@/features/content/service'
import { ConceptForm } from '../concept-form'

export const metadata = { title: 'Sala de profesores · Nueva pieza' }

export default async function SalaNuevoContenidoPage() {
  await requireRole('ADMIN', 'EDITOR')
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/sala" className="text-[13px] text-brand-link">
        ← Sala de profesores
      </Link>
      <div className="mt-4 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <p className="mb-1 font-mono text-[11px] tracking-wide text-muted uppercase">Paso 1 de 4</p>
        <h1 className="mb-2 text-xl font-bold">La pieza</h1>
        <p className="mb-6 text-sm text-ink-2">
          Elige el concepto — la promesa que le haces al alumno — y ponle nombre. El material viene
          en el paso siguiente.
        </p>
        <ConceptForm categories={categories.map((c) => ({ id: Number(c.id), name: c.name }))} />
      </div>
    </div>
  )
}
