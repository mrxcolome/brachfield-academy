// Plantillas de email transaccional (briefing §46).
// Cada plantilla devuelve subject + cuerpo; el layout lo pone email-render.

export interface EmailTemplate {
  subject: string
  bodyHtml: string
  bodyText: string
}

const button = (url: string, label: string) =>
  `<p style="margin:22px 0"><a href="${url}" style="background:#25355e;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;display:inline-block">${label}</a></p>
   <p style="font-size:12.5px;color:#8b8f9c">Si el botón no funciona, copia este enlace:<br>${url}</p>`

export function verificationEmail(name: string, url: string): EmailTemplate {
  return {
    subject: 'Confirma tu correo — Brachfield Academy',
    bodyHtml: `<h2 style="margin:0 0 12px;font-size:19px">Hola, ${name}</h2>
      <p style="line-height:1.6">Gracias por crear tu cuenta en Brachfield Academy. Confirma tu dirección de correo para continuar:</p>
      ${button(url, 'Confirmar mi correo')}
      <p style="font-size:13px;color:#5c6170">Si no has creado esta cuenta, puedes ignorar este mensaje.</p>`,
    bodyText: `Hola, ${name}\n\nConfirma tu correo para activar tu cuenta de Brachfield Academy:\n${url}\n\nSi no has creado esta cuenta, ignora este mensaje.`,
  }
}

export function resetPasswordEmail(name: string, url: string): EmailTemplate {
  return {
    subject: 'Restablece tu contraseña — Brachfield Academy',
    bodyHtml: `<h2 style="margin:0 0 12px;font-size:19px">Hola, ${name}</h2>
      <p style="line-height:1.6">Hemos recibido una solicitud para restablecer tu contraseña. Este enlace caduca en 1 hora:</p>
      ${button(url, 'Crear nueva contraseña')}
      <p style="font-size:13px;color:#5c6170">Si no lo has pedido tú, tu cuenta sigue segura: no hace falta hacer nada.</p>`,
    bodyText: `Hola, ${name}\n\nPara crear una nueva contraseña (caduca en 1 hora):\n${url}\n\nSi no lo has pedido tú, ignora este mensaje.`,
  }
}

export function welcomeEmail(name: string): EmailTemplate {
  return {
    subject: 'Bienvenido a Brachfield Academy',
    bodyHtml: `<h2 style="margin:0 0 12px;font-size:19px">Bienvenido, ${name}</h2>
      <p style="line-height:1.6">Tu suscripción está activa. Ya tienes acceso completo a los cursos, herramientas, eventos en directo y toda la biblioteca de conocimiento sobre Credit Management, prevención de impagos y recobro.</p>
      <p style="line-height:1.6">Un buen primer paso: completa tu perfil profesional para que las recomendaciones se ajusten a tu trabajo.</p>`,
    bodyText: `Bienvenido, ${name}\n\nTu suscripción a Brachfield Academy está activa. Ya tienes acceso completo a cursos, herramientas y eventos.\n\nPrimer paso recomendado: completa tu perfil profesional.`,
  }
}

export function paymentFailedEmail(name: string, portalHint: string): EmailTemplate {
  return {
    subject: 'No hemos podido procesar tu pago — Brachfield Academy',
    bodyHtml: `<h2 style="margin:0 0 12px;font-size:19px">Hola, ${name}</h2>
      <p style="line-height:1.6">El último cobro de tu suscripción no se ha podido completar. Tu acceso sigue activo de momento; reintentaremos el cobro automáticamente.</p>
      <p style="line-height:1.6">Para revisar o actualizar tu tarjeta: ${portalHint}</p>`,
    bodyText: `Hola, ${name}\n\nEl último cobro de tu suscripción no se ha podido completar. Tu acceso sigue activo; reintentaremos el cobro.\n\nPuedes actualizar tu tarjeta desde "Mi suscripción": ${portalHint}`,
  }
}
