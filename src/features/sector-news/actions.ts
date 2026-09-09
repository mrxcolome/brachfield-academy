'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/features/auth/guards'
import { refreshSectorNews, type RefreshResult } from './service'

/** Botón «Actualizar ahora» del panel: refresca el tablón bajo demanda. */
export async function actualizarTablon(): Promise<RefreshResult> {
  await requireRole('ADMIN', 'EDITOR')
  const result = await refreshSectorNews()
  revalidatePath('/app/updates')
  revalidatePath('/app/admin')
  return result
}
