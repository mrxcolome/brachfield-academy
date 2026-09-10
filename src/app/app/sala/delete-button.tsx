'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { borrarCurso, borrarContenido } from '@/features/sala/actions'

/** Borrar un curso o una pieza desde la Sala, con doble red: confirmación
 *  siempre, y si hay alumnos afectados (progreso / favoritos), un segundo
 *  aviso con la cifra — mismo criterio que el borrado de lecciones. */
export function BorrarButton({
  kind,
  id,
  title,
}: {
  kind: 'curso' | 'pieza'
  id: number
  title: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function run(confirm: boolean) {
    setError(null)
    startTransition(async () => {
      const action = kind === 'curso' ? borrarCurso : borrarContenido
      const res = await action({ id, confirm })
      if (res.warning) {
        const detail =
          kind === 'curso'
            ? `${res.warning} ${res.warning === 1 ? 'alumno tiene' : 'alumnos tienen'} progreso en este curso y lo perderán`
            : `${res.warning} ${res.warning === 1 ? 'alumno la tiene' : 'alumnos la tienen'} en favoritos`
        if (window.confirm(`Ojo: ${detail}. ¿Borrar «${title}» igualmente?`)) run(true)
        return
      }
      if (res.error) {
        setError(res.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm(`¿Borrar «${title}» definitivamente? No se puede deshacer.`))
            run(false)
        }}
        className="cursor-pointer rounded-sm px-2.5 py-2 text-[13px] font-semibold text-danger hover:bg-danger/10 disabled:opacity-60"
      >
        {pending ? 'Borrando…' : 'Borrar'}
      </button>
      {error && (
        <span role="alert" className="text-[12px] text-danger">
          {error}
        </span>
      )}
    </span>
  )
}
