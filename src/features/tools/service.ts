// Herramientas (Fase 11): plantillas, checklists y herramientas de trabajo.
import { cms } from '@/lib/cms'
import { db } from '@/lib/db'
import type { Content } from '@/payload/payload-types'

export const TOOL_TYPES: Content['contentType'][] = ['TEMPLATE', 'CHECKLIST', 'TOOL']

/** Herramientas publicadas, con documentFile resuelto (depth 1). */
export async function getTools(): Promise<Content[]> {
  const payload = await cms()
  const res = await payload.find({
    collection: 'contents',
    where: {
      and: [{ _status: { equals: 'published' } }, { contentType: { in: TOOL_TYPES } }],
    },
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
  })
  return res.docs
}

/** Nº de descargas por contenido (la herramienta "más usada"). */
export async function getDownloadCounts(contentIds: string[]): Promise<Map<string, number>> {
  if (contentIds.length === 0) return new Map()
  const rows = await db.downloadLog.groupBy({
    by: ['contentId'],
    where: { contentId: { in: contentIds } },
    _count: { _all: true },
  })
  return new Map(rows.map((r) => [r.contentId, r._count._all]))
}
