import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireActiveMember } from '@/features/auth/guards'
import { db } from '@/lib/db'
import { BrandLogo } from '@/components/brand/logo'
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-10">
      <Link
        href="/"
        className="mb-7 flex justify-center no-underline"
        aria-label="Brachfield Academy — inicio"
      >
        <BrandLogo height={34} />
      </Link>
      <OnboardingForm firstName={dbUser.name.split(' ')[0] ?? dbUser.name} />
    </main>
  )
}
