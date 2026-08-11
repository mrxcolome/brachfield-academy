import 'server-only'
import { db } from '@/lib/db'
import { getContentsByIds } from '@/features/content/service'
import { resolveFavorites, type ResolvedFavorite } from './resolve'
import type { Content } from '@/payload/payload-types'

/** ¿Tiene el usuario guardado este contenido? (para pintar el botón en la ficha) */
export async function isFavorited(userId: string, contentId: string): Promise<boolean> {
  const row = await db.favorite.findUnique({
    where: { userId_contentId: { userId, contentId } },
    select: { id: true },
  })
  return row !== null
}

export type FavoriteItem = ResolvedFavorite<Content>

/**
 * Favoritos del usuario resueltos contra el CMS, en orden de guardado (reciente primero).
 * Un favorito cuyo contenido fue despublicado simplemente no aparece.
 */
export async function getFavoriteContents(
  userId: string,
  contentType?: string,
): Promise<FavoriteItem[]> {
  const rows = await db.favorite.findMany({
    where: { userId, ...(contentType ? { contentType } : {}) },
    orderBy: { createdAt: 'desc' },
  })
  if (rows.length === 0) return []

  const contents = await getContentsByIds(rows.map((r) => Number(r.contentId)))
  return resolveFavorites(rows, contents)
}

/** Tipos de contenido presentes en los favoritos del usuario (para las chips de filtro). */
export async function getFavoriteTypes(userId: string): Promise<string[]> {
  const rows = await db.favorite.findMany({
    where: { userId },
    select: { contentType: true },
    distinct: ['contentType'],
  })
  return rows.map((r) => r.contentType)
}
