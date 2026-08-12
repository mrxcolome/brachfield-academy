// Utilidades de BD para los E2E: preparar/limpiar usuarios de prueba.
// Acceso directo con pg (sin cargar Prisma ni Payload en Playwright).
import { Client } from 'pg'

export const E2E_PASSWORD = 'E2e-Password-2026!'
export const MEMBER_EMAIL = 'e2e-member@e2e.brachfieldacademy.test'
export const FRESH_EMAIL = 'e2e-fresh@e2e.brachfieldacademy.test'
export const ADMIN_EMAIL = 'e2e-admin@e2e.brachfieldacademy.test'

export async function withDb<T>(fn: (c: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

/** Registra un usuario vía API (idempotente: un "ya existe" es aceptable). */
export async function signUpViaApi(baseURL: string, name: string, email: string): Promise<void> {
  const res = await fetch(`${baseURL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: baseURL },
    body: JSON.stringify({ name, email, password: E2E_PASSWORD }),
  })
  if (!res.ok && res.status !== 422) {
    throw new Error(`signup ${email} → ${res.status}: ${await res.text()}`)
  }
}

/** Deja el estado de los usuarios E2E exactamente como cada flujo lo espera. */
export async function prepareE2eState(): Promise<void> {
  await withDb(async (c) => {
    // Verificación + roles + onboarding
    await c.query(
      `update "user" set "emailVerified" = true where email like '%@e2e.brachfieldacademy.test'`,
    )
    await c.query(
      `update "user" set "onboardingStatus"='COMPLETED', "professionalProfile"='COLLECTIONS',
         level='INTERMEDIATE', interests=ARRAY['Mejorar el recobro'], role='MEMBER'
       where email = $1`,
      [MEMBER_EMAIL],
    )
    await c.query(
      `update "user" set "onboardingStatus"='PENDING', "professionalProfile"=null,
         level=null, interests=ARRAY[]::text[] where email = $1`,
      [FRESH_EMAIL],
    )
    await c.query(
      `update "user" set "onboardingStatus"='COMPLETED', role='ADMIN' where email = $1`,
      [ADMIN_EMAIL],
    )

    // Suscripción ACTIVE para los tres (upsert por stripeSubscriptionId)
    for (const [email, subId] of [
      [MEMBER_EMAIL, 'sub_e2e_member'],
      [FRESH_EMAIL, 'sub_e2e_fresh'],
      [ADMIN_EMAIL, 'sub_e2e_admin'],
    ] as const) {
      await c.query(
        `insert into subscription (id, "userId", "stripeSubscriptionId", status, plan, "currentPeriodEnd", "createdAt", "updatedAt")
         select 'sube2e_' || md5($2), id, $2, 'ACTIVE', 'profesional-mensual', now() + interval '30 days', now(), now()
         from "user" where email = $1
         on conflict ("stripeSubscriptionId") do update set status='ACTIVE', "currentPeriodEnd" = now() + interval '30 days'`,
        [email, subId],
      )
    }

    // Estado limpio de actividad del miembro (los flujos parten de cero)
    await c.query(
      `delete from user_progress where "userId" in (select id from "user" where email = $1)`,
      [MEMBER_EMAIL],
    )
    await c.query(
      `delete from favorite where "userId" in (select id from "user" where email = $1)`,
      [MEMBER_EMAIL],
    )
    await c.query(
      `delete from event_registration where "userId" in (select id from "user" where email = $1)`,
      [MEMBER_EMAIL],
    )

    // Una pregunta PENDING para el flujo de admin
    await c.query(
      `delete from question where "userId" in (select id from "user" where email like '%@e2e.brachfieldacademy.test')`,
    )
    await c.query(
      `insert into question (id, "userId", question, category, status, "createdAt", "updatedAt")
       select 'q_e2e_1', id, '¿Puedo cobrar intereses de demora sin pacto expreso?', 'legal', 'PENDING', now(), now()
       from "user" where email = $1`,
      [MEMBER_EMAIL],
    )

    // Usuarios residuales del spec de signup
    await c.query(`delete from "user" where email like 'e2e-signup-%'`)
  })
}
