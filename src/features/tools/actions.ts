'use server'

import { z } from 'zod'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { getContentBySlug } from '@/features/content/service'
import { downloadUrlFor } from './downloads'
import type { Media } from '@/payload/payload-types'

const schema = z.object({ contentSlug: z.string().min(1) })

/**
 * Descarga autorizada: solo miembros activos, el contenido se resuelve
 * server-side desde el CMS y cada descarga queda en download_log.
 */
export async function requestDownload(raw: unknown): Promise<{ url?: string; error?: string }> {
  const { user } = await requireActiveMember()
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { error: 'Solicitud no válida' }

  const content = await getContentBySlug(parsed.data.contentSlug)
  if (!content) return { error: 'Contenido no encontrado' }

  const media =
    typeof content.documentFile === 'object' && content.documentFile !== null
      ? (content.documentFile as Media)
      : null
  if (!media) return { error: 'Este contenido aún no tiene fichero descargable.' }

  const url = await downloadUrlFor(media)
  if (!url) return { error: 'El fichero no está disponible ahora mismo.' }

  await db.downloadLog.create({
    data: { userId: user.id, contentId: String(content.id) },
  })

  return { url }
}
