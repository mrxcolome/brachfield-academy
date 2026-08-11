// Better Auth (ADR-001): email+password con verificación obligatoria,
// reset de contraseña y sesiones en BD. Los emails salen por EmailService.
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { resetPasswordEmail, verificationEmail } from '@/emails/templates'
import { track } from '@/features/analytics/service'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(user.email, resetPasswordEmail(user.name, url))
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(user.email, verificationEmail(user.name, url))
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },

  advanced: {
    database: { generateId: false }, // ids los pone Prisma (cuid)
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          track('user_signed_up', { userId: user.id })
        },
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
