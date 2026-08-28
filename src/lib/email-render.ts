import type { EmailTemplate } from '@/emails/templates'

/** Render mínimo y consistente: layout de marca + contenido de la plantilla. */
export function render(t: EmailTemplate): { subject: string; html: string; text: string } {
  // Logo oficial servido desde el dominio (PNG 2x); alt para clientes que bloquean imágenes.
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://brachfieldacademy.com'
  const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#f5f4f0;font-family:system-ui,-apple-system,sans-serif;color:#1d2130">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <img src="${base}/brand/email-logo.png" alt="Brachfield Academy" width="180" style="display:block;margin-bottom:20px;border:0">
    <div style="background:#ffffff;border:1px solid #e3e1da;border-radius:12px;padding:28px">
      ${t.bodyHtml}
    </div>
    <p style="font-size:12px;color:#8b8f9c;margin-top:16px">Brachfield Academy · Credit Management, prevención de impagos y recobro</p>
  </div>
</body></html>`
  return { subject: t.subject, html, text: t.bodyText }
}
