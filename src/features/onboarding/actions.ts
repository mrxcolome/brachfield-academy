'use server'

import { redirect } from 'next/navigation'
import { requireUser } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { onboardingSchema } from './schemas'
import { track } from '@/features/analytics/service'

export async function saveOnboarding(raw: unknown): Promise<{ error?: string }> {
  const user = await requireUser()
  const parsed = onboardingSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Revisa tus respuestas' }
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      professionalProfile: parsed.data.professionalProfile,
      interests: [...parsed.data.interests],
      level: parsed.data.level,
      onboardingStatus: 'COMPLETED',
    },
  })

  track('onboarding_completed', {
    userId: user.id,
    properties: {
      professionalProfile: parsed.data.professionalProfile,
      level: parsed.data.level,
      interestsCount: parsed.data.interests.length,
    },
  })
  redirect('/app')
}
