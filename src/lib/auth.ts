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
    // AUTH_RATE_LIMIT_DISABLED=1 SOLO en el servidor de tests E2E
    // (playwright.config.ts): el setup crea varios usuarios seguidos.
    enabled: process.env.AUTH_RATE_LIMIT_DISABLED !== '1',
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
          track('user_signed_up', {
            userId: user.id,
            person: { email: user.email, name: user.name },
          })
        },
      },
    },
    session: {
      create: {
        // Cada sesión nueva = un login (incluido el auto-login tras verificar
        // el correo). Registra lastLoginAt para el panel y el evento analytics.
        after: async (session) => {
          try {
            const u = await db.user.update({
              where: { id: session.userId },
              data: { lastLoginAt: new Date() },
              select: { email: true, name: true },
            })
            track('user_logged_in', {
              userId: session.userId,
              person: { email: u.email, name: u.name },
            })
          } catch (e) {
            console.error('[auth] no se pudo registrar lastLoginAt', e)
          }
        },
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
