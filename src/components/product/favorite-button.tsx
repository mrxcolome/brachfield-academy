'use client'

import { useState, useTransition } from 'react'
import { toggleFavorite } from '@/features/favorites/actions'
import { cn } from '@/lib/cn'

export function FavoriteButton({
  contentSlug,
  initialFavorited,
}: {
  contentSlug: string
  initialFavorited: boolean
}) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const target = !favorited
    setFavorited(target)
    startTransition(async () => {
      const res = await toggleFavorite({ contentSlug })
      if (res.error) setFavorited(!target)
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? 'Quitar de guardados' : 'Guardar'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60',
        favorited
          ? 'border-accent bg-accent/15 text-accent-ink'
          : 'border-border-chip bg-surface text-ink-2 hover:bg-bg',
      )}
    >
      <span aria-hidden>{favorited ? '♥' : '♡'}</span>
      {favorited ? 'Guardado' : 'Guardar'}
    </button>
  )
}
