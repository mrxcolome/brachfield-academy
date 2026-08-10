import { redirect } from 'next/navigation'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { OnboardingForm } from './onboarding-form'

export const metadata = { title: 'Personaliza tu experiencia', robots: { index: false } }

export default async function OnboardingPage() {
  const { user } = await requireActiveMember()
  const dbUser = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { onboardingStatus: true, name: true },
  })
  if (dbUser.onboardingStatus === 'COMPLETED') redirect('/app')

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <OnboardingForm firstName={dbUser.name.split(' ')[0] ?? dbUser.name} />
    </main>
  )
}
