// Registro de actividad del equipo editorial (pedido del propietario
// 2026-08-28): cada login y cada cambio de contenido en el CMS queda en
// la tabla editorial_activity (Prisma) y en PostHog, y se muestra en
// /app/admin (tab Editores). Nunca rompe la operación editorial.
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
} from 'payload'
import { db } from '@/lib/db'
import { track } from '@/features/analytics/service'

type PanelUser = { email?: unknown; name?: unknown } | null | undefined
type DocRecord = Record<string, unknown>

function titleFrom(doc: DocRecord, field: string): string | undefined {
  const v = doc[field] ?? doc.filename ?? doc.name
  return typeof v === 'string' ? v : undefined
}

async function log(
  editor: PanelUser,
  action: 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE',
  collection?: string,
  docTitle?: string,
): Promise<void> {
  const email = typeof editor?.email === 'string' ? editor.email : null
  if (!email) return // operaciones sin usuario del panel (seed, Local API) no se registran
  const name = typeof editor?.name === 'string' ? editor.name : email
  try {
    await db.editorialActivity.create({
      data: { editorEmail: email, editorName: name, action, collection, docTitle },
    })
  } catch (e) {
    console.error('[editorial] no se pudo registrar la actividad', e)
  }
  track(action === 'LOGIN' ? 'editor_logged_in' : 'editorial_change', {
    userId: `editor:${email}`,
    properties: { action, collection: collection ?? null, docTitle: docTitle ?? null },
    person: { email, name },
  })
}

export const editorialAfterLogin: CollectionAfterLoginHook = async ({ user }) => {
  await log(user as PanelUser, 'LOGIN')
  return user
}

/**
 * Hooks afterChange/afterDelete para una colección editorial.
 * OJO autosave: contents/courses guardan borradores cada pocos segundos y
 * afterChange se dispara en cada uno — solo registramos creaciones y los
 * guardados PUBLICADOS (doc._status !== 'draft') para no inundar el registro.
 */
export function editorialHooks(collection: string, titleField = 'title') {
  const afterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
    const record = doc as DocRecord
    const status = typeof record._status === 'string' ? record._status : undefined
    if (operation !== 'create' && status === 'draft') return doc
    await log(
      req.user as PanelUser,
      operation === 'create' ? 'CREATE' : 'UPDATE',
      collection,
      titleFrom(record, titleField),
    )
    return doc
  }
  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    await log(req.user as PanelUser, 'DELETE', collection, titleFrom(doc as DocRecord, titleField))
  }
  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}
