'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'

/** El alumno terminó (o saltó) el tour de navegación: no volver a mostrarlo. */
export async function marcarTourVisto(): Promise<{ ok: true }> {
  const user = await requireUser()
  await db.user.update({ where: { id: user.id }, data: { tourSeenAt: new Date() } })
  revalidatePath('/app')
  return { ok: true }
}

/** El alumno pulsó play en la bienvenida de Pere: paso 1 de la checklist. */
export async function marcarVideoBienvenidaVisto(): Promise<{ ok: true }> {
  const user = await requireUser()
  await db.user.update({ where: { id: user.id }, data: { welcomeVideoSeenAt: new Date() } })
  revalidatePath('/app')
  return { ok: true }
}
