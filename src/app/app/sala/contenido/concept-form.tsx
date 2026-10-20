'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { crearContenido, guardarContenido } from '@/features/sala/actions'
import { SALA_CONCEPTS } from '@/features/sala/concepts'
import type { SalaContent } from '@/features/sala/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ConceptForm({
  categories,
  piece,
  initialConcept,
}: {
  categories: { id: number; name: string }[]
  piece?: Pick<SalaContent, 'id' | 'title' | 'excerpt' | 'categoryId' | 'conceptType'>
  /** Tipo elegido desde el botón de la Sala (?tipo=…): el selector queda plegado. */
  initialConcept?: string
}) {
  const router = useRouter()
  const [concept, setConcept] = useState<string>(piece?.conceptType ?? initialConcept ?? '')
  const [picking, setPicking] = useState(!concept)
  const chosen = SALA_CONCEPTS.find((c) => c.value === concept)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (!concept) return setError('Elige primero qué vas a publicar')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const payload = { ...data, conceptType: concept }
    startTransition(async () => {
      if (piece) {
        const res = await guardarContenido({ ...payload, id: piece.id })
        if (res.error) return setError(res.error)
        router.push(`/app/sala/contenido/${piece.id}?paso=2`)
      } else {
        const res = await crearContenido(payload)
        if (res.error || !res.id) return setError(res.error ?? 'No se pudo crear la pieza')
        router.push(`/app/sala/contenido/${res.id}?paso=2`)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {chosen && !picking ? (
        <div className="flex flex-wrap items-center gap-3 rounded-md bg-bg px-4 py-3">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-link"
          >
            {chosen.glyph}
          </span>
          <p className="text-sm">
            Tipo: <strong>{chosen.label}</strong>
          </p>
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="ml-auto text-[13px] font-semibold text-brand-link underline"
          >
            Cambiar tipo
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-[12.5px] font-semibold">¿Qué vas a publicar?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SALA_CONCEPTS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setConcept(c.value)
                  setPicking(false)
                }}
                aria-pressed={concept === c.value}
                className={`rounded-lg border p-3 text-left ${
                  concept === c.value
                    ? 'border-brand bg-brand-soft'
                    : 'border-border-input bg-surface hover:border-brand-link'
                }`}
              >
                <span className="flex items-center gap-2 text-[13.5px] font-bold">
                  <span aria-hidden className="text-brand-link">
                    {c.glyph}
                  </span>
                  {c.label}
                </span>
                <span className="mt-1 block text-[11.5px] leading-snug text-muted">{c.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Input
        name="title"
        label="Título"
        defaultValue={piece?.title}
        placeholder="Ej. Checklist antes de conceder crédito a un cliente nuevo"
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-excerpt" className="text-[12.5px] font-semibold">
          ¿Qué se lleva el alumno? (dos frases)
        </label>
        <textarea
          id="c-excerpt"
          name="excerpt"
          rows={3}
          defaultValue={piece?.excerpt}
          placeholder="Este texto aparece en la tarjeta y en el buscador."
          className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm placeholder:text-muted-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-link"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="c-cat" className="text-[12.5px] font-semibold">
            Área de conocimiento
          </label>
          <select
            id="c-cat"
            name="categoryId"
            defaultValue={piece?.categoryId ?? ''}
            className="rounded-sm border border-border-input bg-surface px-3 py-2.5 text-sm"
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
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Guardando…' : piece ? 'Guardar y seguir →' : 'Crear el borrador →'}
        </Button>
      </div>
      {!piece && (
        <p className="text-[12.5px] text-muted">
          Se crea como borrador, invisible para los alumnos, y se puede terminar otro día.
        </p>
      )}
    </form>
  )
}
