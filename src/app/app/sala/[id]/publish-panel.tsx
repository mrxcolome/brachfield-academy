'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { despublicarCurso, publicarCurso } from '@/features/sala/actions'
import { Button } from '@/components/ui/button'

export function PublishPanel({
  courseId,
  status,
  slug,
}: {
  courseId: number
  status: 'draft' | 'published'
  slug?: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function run(fn: () => Promise<{ error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) setError(res.error)
      else router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {status === 'published' ? (
        <>
          <p className="text-sm text-success">
            ✓ Este curso está <strong>publicado</strong>: los alumnos ya lo ven.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {slug && (
              <a
                href={`/app/courses/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-border-input px-4 py-2.5 text-[13px] font-semibold text-ink no-underline hover:bg-bg"
              >
                Verlo como alumno ↗
              </a>
            )}
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => run(() => despublicarCurso(courseId))}
            >
              {pending ? 'Un momento…' : 'Retirar a borrador'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-ink-2">
            Al publicar, el curso aparece al instante en la zona de alumnos y en la web pública.
            Podrás seguir editándolo cuando quieras.
          </p>
          <Button
            type="button"
            size="lg"
            disabled={pending}
            onClick={() => run(() => publicarCurso(courseId))}
          >
            {pending ? 'Publicando…' : 'Publicar el curso'}
          </Button>
        </>
      )}
      {error && (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
