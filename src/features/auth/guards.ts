// Guards server-side (briefing §39). Tres niveles:
//   requireUser → sesión válida
//   requireActiveMember → sesión + suscripción vigente
//   requireRole → sesión + rol concreto
// Ocultar botones en la UI NUNCA sustituye a estos guards.
import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { hasMemberAccess } from '@/features/billing/access'
import type { Role } from '@/generated/prisma/enums'

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return user
}

export async function requireActiveMember() {
  const user = await requireUser()
  const subscription = await db.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
  if (!hasMemberAccess(subscription?.status)) redirect('/checkout')
  return { user, subscription: subscription! }
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser()
  const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { role: true } })
  if (!dbUser || !roles.includes(dbUser.role)) redirect('/app')
  return { user, role: dbUser.role }
}
