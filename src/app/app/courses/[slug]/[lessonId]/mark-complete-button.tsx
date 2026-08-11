'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markLesson } from '@/features/learning/actions'
import { cn } from '@/lib/cn'

export function MarkCompleteButton({
  courseSlug,
  lessonId,
  initialCompleted,
  nextHref,
}: {
  courseSlug: string
  lessonId: string
  initialCompleted: boolean
  nextHref: string
}) {
  const [completed, setCompleted] = useState(initialCompleted)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function toggle() {
    const target = !completed
    setCompleted(target) // optimista
    startTransition(async () => {
      const res = await markLesson({ courseSlug, lessonId, completed: target })
      if (res.error) {
        setCompleted(!target)
        return
      }
      if (target) router.push(nextHref)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={completed}
      className={cn(
        'rounded-sm px-3.5 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60',
        completed ? 'bg-border-faint text-success' : 'bg-success text-white hover:opacity-90',
      )}
    >
      {completed ? '✓ Completada' : '✓ Marcar como completada'}
    </button>
  )
}
