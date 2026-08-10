// EmailService — único punto de salida de emails (briefing §46).
// Sin RESEND_API_KEY (desarrollo) los emails se imprimen en consola,
// para que los flujos de auth funcionen end-to-end sin proveedor.
import { render } from './email-render'
import type { EmailTemplate } from '@/emails/templates'

export async function sendEmail(to: string, template: EmailTemplate): Promise<void> {
  const { subject, html, text } = render(template)
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.info(`[email:dev] Para: ${to} · Asunto: ${subject}\n${text}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? 'Brachfield Academy <onboarding@resend.dev>',
      to,
      subject,
      html,
      text,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error(`[email] Fallo al enviar "${subject}" a ${to}: ${res.status} ${body}`)
    throw new Error(`Email provider error ${res.status}`)
  }
}
