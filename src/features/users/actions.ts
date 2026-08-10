'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre'),
  lastName: z.string().trim().max(80).optional(),
  company: z.string().trim().max(120).optional(),
  jobTitle: z.string().trim().max(120).optional(),
})

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser()
  const parsed = profileSchema.safeParse({
    name: formData.get('name'),
    lastName: formData.get('lastName') || undefined,
    company: formData.get('company') || undefined,
    jobTitle: formData.get('jobTitle') || undefined,
  })
  if (!parsed.success) return

  await db.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      lastName: parsed.data.lastName ?? null,
      company: parsed.data.company ?? null,
      jobTitle: parsed.data.jobTitle ?? null,
    },
  })
  revalidatePath('/app/account')
}
