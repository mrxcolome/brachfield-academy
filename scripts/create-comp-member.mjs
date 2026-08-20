// Alta de cortesía de un miembro (equipo e invitados): crea la cuenta contra
// la API real de la web (así la contraseña queda con el hash correcto), marca
// el email como verificado (Resend aún no entrega a otros dominios) y activa
// una suscripción de cortesía de larga duración sin pasar por Stripe.
// Lo ejecuta el workflow "Alta de miembro (cortesía)" con sus inputs.
import { connect } from './db-connect.mjs'

const APP_URL = (process.env.APP_URL ?? 'https://brachfield-academy-app.vercel.app').replace(
  /\/$/,
  '',
)
const email = process.env.MEMBER_EMAIL?.trim().toLowerCase()
const name = process.env.MEMBER_NAME?.trim()
const password = process.env.MEMBER_PASSWORD
if (!email || !name || !password)
  throw new Error('Faltan MEMBER_EMAIL / MEMBER_NAME / MEMBER_PASSWORD')
if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres')

// 1) Alta vía API pública (usuario + credenciales)
const res = await fetch(`${APP_URL}/api/auth/sign-up/email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: APP_URL },
  body: JSON.stringify({ email, name, password }),
})
if (res.ok) {
  console.log(`Cuenta creada en ${APP_URL}`)
} else {
  const body = await res.text()
  if (/exist|ya existe/i.test(body)) {
    console.log('La cuenta ya existía: sigo con la verificación y la suscripción.')
  } else {
    throw new Error(`Alta fallida (${res.status}): ${body.slice(0, 300)}`)
  }
}

// 2) Email verificado + suscripción de cortesía (10 años)
const client = await connect()
try {
  const u = await client.query(
    'UPDATE "user" SET "emailVerified" = true WHERE email = $1 RETURNING id',
    [email],
  )
  if (u.rowCount === 0) throw new Error('El usuario no aparece en la base de datos tras el alta')
  const userId = u.rows[0].id
  const end = new Date(Date.now() + 10 * 365 * 24 * 3600 * 1000)
  const sub = await client.query('SELECT id FROM subscription WHERE "userId" = $1 LIMIT 1', [
    userId,
  ])
  if (sub.rowCount > 0) {
    await client.query(
      `UPDATE subscription SET status = 'ACTIVE', "currentPeriodEnd" = $2, "updatedAt" = now() WHERE id = $1`,
      [sub.rows[0].id, end],
    )
    console.log('Suscripción existente reactivada (cortesía) hasta', end.toISOString().slice(0, 10))
  } else {
    await client.query(
      `INSERT INTO subscription (id, "userId", "stripeSubscriptionId", status, "currentPeriodEnd", "createdAt", "updatedAt")
       VALUES ($1, $2, $1, 'ACTIVE', $3, now(), now())`,
      [`comp_${userId}`, userId, end],
    )
    console.log('Suscripción de cortesía activa hasta', end.toISOString().slice(0, 10))
  }
  console.log(`LISTO: ${email} ya puede entrar por /login (su primer paso será el onboarding).`)
} finally {
  await client.end()
}
