// Conexión pg compartida por los scripts del workflow DB migrate.
// Neon exige TLS; en local (localhost) no se usa.
import pg from 'pg'

export async function connect() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL no definida')
  const local = /localhost|127\.0\.0\.1/.test(url)
  const client = new pg.Client({
    connectionString: url,
    ssl: local ? undefined : { rejectUnauthorized: true },
  })
  await client.connect()
  return client
}
