'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearCurso, guardarCurso } from '@/features/sala/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface CategoryOption {
  id: number
  name: string
}

export function BasicsForm({
  categories,
  course,
}: {
  categories: CategoryOption[]
  course?: { id: number; title: string; description: string; categoryId: number | null }
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    startTransition(async () => {
      if (course) {
        const res = await guardarCurso({ ...data, id: course.id })
        if (res.error) return setError(res.error)
        setSaved(true)
        router.push(`/app/sala/${course.id}?paso=2`)
      } else {
        const res = await crearCurso(data)
        if (res.error || !res.id) return setError(res.error ?? 'No se pudo crear el curso')
        router.push(`/app/sala/${res.id}?paso=2`)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        name="title"
        label="Título del curso"
        placeholder="Ej. Recobro de impagados paso a paso"
        defaultValue={course?.title}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sala-desc" className="text-[12.5px] font-semibold">
          ¿De qué va? (dos o tres frases)
        </label>
        <textarea
          id="sala-desc"
          name="description"
          rows={4}
          defaultValue={course?.description}
          placeholder="Lo que el alumno sabrá hacer al terminar. Este texto aparece en la tarjeta del curso."
          className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sala-cat" className="text-[12.5px] font-semibold">
          Área de conocimiento
        </label>
        <select
          id="sala-cat"
          name="categoryId"
          defaultValue={course?.categoryId ?? ''}
          className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        >
          <option value="" disabled>
            Elige el área…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : course ? 'Guardar y seguir →' : 'Crear el borrador →'}
        </Button>
        {saved && <span className="text-[13px] text-success">Guardado ✓</span>}
      </div>
      {!course && (
        <p className="text-[12.5px] text-muted">
          Se crea como borrador, invisible para los alumnos. Podrás dejarlo a medias y volver cuando
          quieras.
        </p>
      )}
    </form>
  )
}
