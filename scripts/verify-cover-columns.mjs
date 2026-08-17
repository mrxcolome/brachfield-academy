// Verificación post-migración (workflow DB migrate): imprime si las columnas
// de portadas existen en la BD y qué migraciones de Payload constan aplicadas.
// Sale con error si falta alguna de las 4 columnas, para que el workflow
// quede en rojo cuando la BD no está como el código espera.
import pg from 'pg'

const EXPECTED = [
  ['contents', 'cover_image_id'],
  ['_contents_v', 'version_cover_image_id'],
  ['courses', 'cover_image_id'],
  ['_courses_v', 'version_cover_image_id'],
]

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  const { rows } = await client.query(
    `SELECT table_name, column_name FROM information_schema.columns
     WHERE table_schema = 'payload'
       AND column_name IN ('cover_image_id', 'version_cover_image_id')
     ORDER BY table_name`,
  )
  const found = new Set(rows.map((r) => `${r.table_name}.${r.column_name}`))
  let ok = true
  for (const [table, column] of EXPECTED) {
    const has = found.has(`${table}.${column}`)
    console.log(`${has ? 'OK  ' : 'FALTA'} payload.${table}.${column}`)
    if (!has) ok = false
  }
  const { rows: migs } = await client.query(
    `SELECT name FROM payload.payload_migrations ORDER BY name`,
  )
  console.log('Migraciones Payload registradas:', migs.map((m) => m.name).join(', ') || '(ninguna)')
  if (!ok) {
    console.error('ERROR: faltan columnas de portadas en la base de datos.')
    process.exit(1)
  }
} finally {
  await client.end()
}
