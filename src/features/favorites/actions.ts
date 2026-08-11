'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { getContentBySlug } from '@/features/content/service'
import { track } from '@/features/analytics/service'

const schema = z.object({ contentSlug: z.string().min(1) })

/** Alterna favorito. El id se resuelve desde el CMS, nunca del cliente. */
export async function toggleFavorite(
  raw: unknown,
): Promise<{ favorited?: boolean; error?: string }> {
  const { user } = await requireActiveMember()
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }

  const content = await getContentBySlug(parsed.data.contentSlug)
  if (!content) return { error: 'Contenido no encontrado' }
  const contentId = String(content.id)

  const existing = await db.favorite.findUnique({
    where: { userId_contentId: { userId: user.id, contentId } },
  })

  let favorited: boolean
  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } })
    favorited = false
  } else {
    await db.favorite.create({
      data: { userId: user.id, contentId, contentType: content.contentType },
    })
    favorited = true
  }
  track(favorited ? 'favorite_added' : 'favorite_removed', {
    userId: user.id,
    properties: { contentSlug: content.slug, contentType: content.contentType },
  })

  revalidatePath('/app/favorites')
  revalidatePath(`/app/contents/${content.slug}`)
  return { favorited }
}
