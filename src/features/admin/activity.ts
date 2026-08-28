// Cronología de actividad de un alumno para la ficha del admin.
// Separado de service.ts (solo Prisma, testeado): aquí sí se consulta el
// CMS para resolver títulos de contenidos, cursos y eventos.
import { cms } from '@/lib/cms'
import type { getStudentActivity } from './service'

export interface ActivityEntry {
  at: Date
  glyph: string
  text: string
}

type StudentActivity = NonNullable<Awaited<ReturnType<typeof getStudentActivity>>>

async function titlesByIds(
  collection: 'contents' | 'courses' | 'events',
  ids: number[],
): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map()
  const payload = await cms()
  const res = await payload.find({
    collection,
    where: { id: { in: ids } },
    depth: 0,
    limit: ids.length,
    pagination: false,
  })
  return new Map(res.docs.map((d) => [Number(d.id), (d as { title?: string }).title ?? `#${d.id}`]))
}

const num = (v: string): number => Number.parseInt(v, 10)

export async function buildStudentTimeline(data: StudentActivity): Promise<ActivityEntry[]> {
  const contentIds = [
    ...new Set([...data.downloads, ...data.favorites].map((d) => num(d.contentId))),
  ].filter(Number.isFinite)
  const courseIds = [
    ...new Set(data.progress.flatMap((p) => (p.courseId ? [num(p.courseId)] : []))),
  ].filter(Number.isFinite)
  const eventIds = [...new Set(data.reservations.map((r) => num(r.eventId)))].filter(
    Number.isFinite,
  )

  const [contentTitles, courseTitles, eventTitles] = await Promise.all([
    titlesByIds('contents', contentIds),
    titlesByIds('courses', courseIds),
    titlesByIds('events', eventIds),
  ])

  const entries: ActivityEntry[] = [
    ...data.sessions.map((s) => ({ at: s.createdAt, glyph: '⎆', text: 'Inició sesión' })),
    ...data.searches.map((s) => ({
      at: s.createdAt,
      glyph: '⌕',
      text: `Buscó «${s.query}» (${s.resultsCount} ${s.resultsCount === 1 ? 'resultado' : 'resultados'})`,
    })),
    ...data.downloads.map((d) => ({
      at: d.createdAt,
      glyph: '⭳',
      text: `Descargó «${contentTitles.get(num(d.contentId)) ?? 'una herramienta'}»`,
    })),
    ...data.favorites.map((f) => ({
      at: f.createdAt,
      glyph: '♥',
      text: `Guardó en favoritos «${contentTitles.get(num(f.contentId)) ?? 'un contenido'}»`,
    })),
    ...data.progress.map((p) => {
      const course = p.courseId ? (courseTitles.get(num(p.courseId)) ?? 'un curso') : 'un curso'
      return p.status === 'COMPLETED' && p.completedAt
        ? { at: p.completedAt, glyph: '✓', text: `Completó una lección de «${course}»` }
        : { at: p.updatedAt, glyph: '▶', text: `Avanzó en «${course}»` }
    }),
    ...data.reservations.map((r) => {
      const event = eventTitles.get(num(r.eventId)) ?? 'un evento'
      return r.status === 'CANCELED'
        ? { at: r.updatedAt, glyph: '▣', text: `Canceló su reserva de «${event}»` }
        : { at: r.createdAt, glyph: '▣', text: `Reservó plaza en «${event}»` }
    }),
  ]

  return entries.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 30)
}
