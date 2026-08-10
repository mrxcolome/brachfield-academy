'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'

export async function markAllNotificationsRead(): Promise<void> {
  const user = await requireUser()
  await db.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  })
  revalidatePath('/app/notifications')
  revalidatePath('/app')
}
