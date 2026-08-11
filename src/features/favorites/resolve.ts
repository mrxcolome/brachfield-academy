// Lógica pura de Favoritos: casar las filas de BD (orden de guardado) con los
// contenidos que el CMS aún publica. Separada del servicio para poder testearla.

export interface FavoriteRow {
  contentId: string
  createdAt: Date
}

export interface ResolvedFavorite<C> {
  content: C
  savedAt: Date
}

/**
 * Devuelve los favoritos en orden de guardado (reciente primero), descartando
 * los que apuntan a contenido despublicado o borrado en el CMS.
 */
export function resolveFavorites<C extends { id: number | string }>(
  rows: FavoriteRow[],
  contents: C[],
): ResolvedFavorite<C>[] {
  const byId = new Map(contents.map((c) => [String(c.id), c]))
  return rows.flatMap((r) => {
    const content = byId.get(r.contentId)
    return content ? [{ content, savedAt: r.createdAt }] : []
  })
}
