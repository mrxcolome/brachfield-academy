import type { EmailTemplate } from '@/emails/templates'

/** Render mínimo y consistente: layout de marca + contenido de la plantilla. */
export function render(t: EmailTemplate): { subject: string; html: string; text: string } {
  const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#f5f4f0;font-family:system-ui,-apple-system,sans-serif;color:#1d2130">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">
    <div style="font-weight:700;font-size:17px;margin-bottom:20px">Brachfield <span style="color:#3d548f">Academy</span></div>
    <div style="background:#ffffff;border:1px solid #e3e1da;border-radius:12px;padding:28px">
      ${t.bodyHtml}
    </div>
    <p style="font-size:12px;color:#8b8f9c;margin-top:16px">Brachfield Academy · Credit Management, prevención de impagos y recobro</p>
  </div>
</body></html>`
  return { subject: t.subject, html, text: t.bodyText }
}
