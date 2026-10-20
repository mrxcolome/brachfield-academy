import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { notFound } from 'next/navigation'
import { requireRole } from '@/features/auth/guards'
import { SERVED_SLUGS } from '@/features/docs/catalog'

// Documentación interna: solo para el equipo (ADMIN/EDITOR). El HTML está fuera de public/.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await requireRole('ADMIN', 'EDITOR')
  const { slug } = await params
  if (!SERVED_SLUGS.has(slug)) notFound()
  const html = await readFile(
    path.join(process.cwd(), 'content/docs', `${slug}.html`),
    'utf8',
  ).catch(() => null)
  if (html === null) notFound()
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
