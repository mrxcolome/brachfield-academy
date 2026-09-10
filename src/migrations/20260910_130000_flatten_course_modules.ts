import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import type { Course } from '../payload/payload-types'

// Decisión del propietario 10/09: los cursos son LINEALES (lecciones, sin
// bloques ni módulos). Se aplanan los cursos multi-módulo del contenido demo
// al módulo técnico único de la Sala, CONSERVANDO los ids de las lecciones
// (el progreso de los alumnos referencia esos ids). Con esto todos los
// cursos pasan a ser editables desde la Sala y la «fase 2» queda cancelada.
const HIDDEN_MODULE = 'Contenido'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'courses',
    depth: 0,
    limit: 200,
    draft: true,
    overrideAccess: true,
  })
  for (const doc of docs as Course[]) {
    const modules = doc.modules ?? []
    if (modules.length <= 1) continue
    const lessons = modules.flatMap((m) => m.lessons ?? [])
    await payload.update({
      collection: 'courses',
      id: doc.id,
      depth: 0,
      overrideAccess: true,
      data: { modules: [{ name: HIDDEN_MODULE, lessons }] },
    })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Sin vuelta atrás: la agrupación original por módulos no se conserva.
}
