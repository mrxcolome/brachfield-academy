// Retira la marca 'dev' de payload.payload_migrations antes de migrar.
// Esa fila la deja Payload al arrancar en modo dev contra la BD y bloquea
// `payload migrate` con una pregunta interactiva (que en CI cuelga el job).
// Retirarla es seguro: es solo un marcador, no una migración real.
import { connect } from './db-connect.mjs'

const client = await connect()
try {
  const r = await client.query(`DELETE FROM payload.payload_migrations WHERE name = 'dev'`)
  console.log(`Filas 'dev' retiradas: ${r.rowCount}`)
} catch (e) {
  // Base nueva sin schema payload todavía: no hay nada que retirar.
  if (e?.code === '42P01')
    console.log('Sin tabla payload.payload_migrations (base nueva): nada que retirar.')
  else throw e
} finally {
  await client.end()
}
