// TEMPORAL — diagnóstico del incidente de producción (2026-08-17): informa de
// qué base de datos ve la aplicación, si existen las columnas de portadas y el
// error exacto de la consulta de cursos. Retirar cuando el incidente se cierre.
import { NextResponse } from 'next/server'
import { sql } from '@payloadcms/db-postgres'
import { cms } from '@/lib/cms'

export const dynamic = 'force-dynamic'

function maskedHost(): string {
  try {
    return `${new URL(process.env.DATABASE_URL ?? '').hostname.slice(0, 14)}…`
  } catch {
    return '(ilegible)'
  }
}

export async function GET() {
  const host = maskedHost()
  try {
    const payload = await cms()
    const db = payload.db.drizzle
    const cols = await db.execute(sql`
      SELECT table_name, column_name FROM information_schema.columns
      WHERE table_schema = 'payload'
        AND column_name IN ('cover_image_id', 'version_cover_image_id')
      ORDER BY table_name`)
    const migs = await db.execute(sql`SELECT name FROM payload.payload_migrations ORDER BY name`)
    let coursesQuery = 'ok'
    try {
      await payload.find({ collection: 'courses', limit: 1, depth: 0 })
    } catch (e) {
      coursesQuery = String(e).slice(0, 600)
    }
    return NextResponse.json({
      ok: coursesQuery === 'ok',
      host,
      coverColumns: cols.rows.map((r) => `${String(r.table_name)}.${String(r.column_name)}`),
      payloadMigrations: migs.rows.map((m) => String(m.name)),
      coursesQuery,
    })
  } catch (e) {
    return NextResponse.json({ ok: false, host, error: String(e).slice(0, 600) }, { status: 500 })
  }
}
