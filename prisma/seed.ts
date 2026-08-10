// Seed del dominio de aplicación (Fase 2b).
// Usuarios demo con estados de suscripción variados para desarrollar y
// probar guards, dashboard y billing sin depender de Stripe real.
// El contenido editorial se seedea en Payload (Fase 7).
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

const DAY = 24 * 60 * 60 * 1000

async function main() {
  // Idempotente: limpia solo los usuarios demo
  await db.user.deleteMany({ where: { email: { endsWith: '@demo.brachfieldacademy.test' } } })

  // ── Javier: miembro activo con actividad (el usuario del prototipo) ──
  const javier = await db.user.create({
    data: {
      name: 'Javier',
      lastName: 'Soler',
      email: 'javier@demo.brachfieldacademy.test',
      emailVerified: true,
      company: 'Industrias Soler S.L.',
      jobTitle: 'Responsable de Cobros',
      country: 'ES',
      onboardingStatus: 'COMPLETED',
      professionalProfile: 'COLLECTIONS',
      level: 'INTERMEDIATE',
      interests: ['recobro', 'negociación', 'prevención de impagos'],
      lastLoginAt: new Date(),
      subscriptions: {
        create: {
          stripeSubscriptionId: 'sub_demo_javier',
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 30 * DAY),
        },
      },
      progress: {
        create: [
          {
            contentId: 'leccion-primer-contacto',
            courseId: 'curso-recuperar-impagado',
            status: 'COMPLETED',
            progressPct: 100,
            completedAt: new Date(Date.now() - 2 * DAY),
          },
          {
            contentId: 'leccion-email-reclamacion',
            courseId: 'curso-recuperar-impagado',
            status: 'IN_PROGRESS',
            progressPct: 67,
            lastPositionSec: 154,
          },
        ],
      },
      favorites: {
        create: [
          { contentId: 'video-cuando-enviar-burofax', contentType: 'VIDEO' },
          { contentId: 'plantilla-email-factura-vencida', contentType: 'TEMPLATE' },
        ],
      },
      questions: {
        create: {
          question:
            'Un cliente me debe una factura desde hace 120 días y sigue haciendo pedidos. ¿Debo bloquear el suministro?',
          category: 'Recobro de impagados',
          consentToPublish: true,
        },
      },
      notifications: {
        create: {
          type: 'EVENT',
          title: 'Próximo directo',
          message: 'La masterclass de reclamación de deuda empieza mañana a las 17:00.',
          url: '/app/events',
        },
      },
    },
  })

  // ── Marta: canceló la suscripción (para probar bloqueo de acceso) ──
  await db.user.create({
    data: {
      name: 'Marta',
      lastName: 'Vidal',
      email: 'marta@demo.brachfieldacademy.test',
      emailVerified: true,
      jobTitle: 'Controller',
      onboardingStatus: 'COMPLETED',
      professionalProfile: 'CONTROLLER',
      level: 'ADVANCED',
      subscriptions: {
        create: {
          stripeSubscriptionId: 'sub_demo_marta',
          status: 'CANCELED',
          currentPeriodEnd: new Date(Date.now() - 15 * DAY),
          canceledAt: new Date(Date.now() - 45 * DAY),
        },
      },
    },
  })

  // ── Pago fallido (dunning): acceso aún activo, aviso visible ──
  await db.user.create({
    data: {
      name: 'Andreu',
      lastName: 'Ferrer',
      email: 'andreu@demo.brachfieldacademy.test',
      emailVerified: true,
      jobTitle: 'Director Financiero',
      onboardingStatus: 'COMPLETED',
      professionalProfile: 'CFO',
      level: 'BEGINNER',
      subscriptions: {
        create: {
          stripeSubscriptionId: 'sub_demo_andreu',
          status: 'PAST_DUE',
          currentPeriodEnd: new Date(Date.now() + 5 * DAY),
        },
      },
    },
  })

  // ── Equipo de plataforma ──
  await db.user.create({
    data: {
      name: 'Admin',
      email: 'admin@demo.brachfieldacademy.test',
      emailVerified: true,
      role: 'ADMIN',
      onboardingStatus: 'COMPLETED',
    },
  })
  await db.user.create({
    data: {
      name: 'Editora',
      email: 'editor@demo.brachfieldacademy.test',
      emailVerified: true,
      role: 'EDITOR',
      onboardingStatus: 'COMPLETED',
    },
  })

  const users = await db.user.count()
  console.log(`Seed OK — ${users} usuarios (activo: ${javier.email})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
