# Checklist de lanzamiento — Brachfield Academy

Estado a 2026-08-12 (Fase 18). Lo técnico está listo; los pasos marcados
🧑 son decisiones o gestiones del propietario. Orden recomendado.

## 1 · Infraestructura (hecho)

- [x] Producción desplegada en Vercel con CI (76 tests en cada cambio)
- [x] Base de datos Neon con migraciones automatizadas (workflow "DB migrate")
- [x] Ficheros en R2 con descargas firmadas; player de Stream integrado
- [x] Emails transaccionales (Resend) y recordatorios de eventos (cron + CRON_SECRET)
- [x] Analytics PostHog en producción (confirmado por el propietario)
- [x] Cabeceras de seguridad + HSTS; revisión de seguridad documentada
- [x] Sentry integrado en el código (se activa con las variables, ver paso 3)
- [x] Panel del CMS con la marca Brachfield Academy
- [x] Backups: Neon conserva point-in-time recovery (restauración a un instante)
      en su plan; revisar retención al pasar a plan de pago si se quiere más margen

## 1b · CORS del bucket R2 — 🧑 necesario para subir ficheros grandes (5 min)

Vercel corta cualquier petición de más de ~4,5 MB, así que las subidas del
CMS van directas del navegador a R2 con URL prefirmada (`clientUploads`).
Para que el navegador pueda hacer ese PUT, el bucket necesita una regla CORS:

1. dash.cloudflare.com → **R2** → tu bucket → **Settings** → **CORS policy** → Edit
2. Pegar (añadiendo el dominio definitivo a AllowedOrigins cuando exista):

```json
[
  {
    "AllowedOrigins": ["https://brachfield-academy-app.vercel.app"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

3. Guardar y probar a subir la imagen otra vez en /admin → Media.
   Sin esta regla el navegador bloquea la subida (error de CORS en consola).

## 2 · Staging (decisión tomada)

Cada rama/PR en GitHub genera un **preview deployment** en Vercel: esa es
nuestra staging, sin coste ni mantenimiento. ⚠️ Los previews comparten las
variables de producción: no probar en ellos flujos destructivos de datos.
Si algún día hace falta staging con datos aislados: Neon branching (5 min).

## 3 · Sentry — 🧑 crear cuenta (5 min, como PostHog)

1. sentry.io → Sign up → crear organización y proyecto (plataforma **Next.js**)
2. Copiar el **DSN** (una URL https://…ingest.de.sentry.io/… — elegir región UE si pregunta)
3. En Vercel → Environment Variables, añadir **las dos** con el mismo valor:
   `SENTRY_DSN` y `NEXT_PUBLIC_SENTRY_DSN` → Redeploy
4. Probar: visitar una URL rota no basta (404 es normal); Sentry captura errores
   reales. Se puede verificar esperando el primer error genuino o pidiendo a
   Claude una ruta de prueba temporal.

## 4 · Dominio definitivo — 🧑 decidir y conectar

1. Decidir el dominio (propuesta: `academy.perebrachfield.com`)
2. Vercel → proyecto brachfield-academy-app → Settings → **Domains** → Add →
   seguir las instrucciones (un registro CNAME en el DNS de perebrachfield.com)
3. Actualizar en Vercel las variables `NEXT_PUBLIC_APP_URL` y `BETTER_AUTH_URL`
   al dominio nuevo → Redeploy
4. Stripe → webhook: cambiar la URL del endpoint al dominio nuevo
5. Google: el sitemap se regenera solo con el dominio nuevo

## 5 · Emails con remitente propio — 🧑 tras el dominio

1. Resend → **Domains** → Add domain → el dominio elegido
2. Añadir los registros DNS que indica (SPF/DKIM) donde esté gestionado el DNS
3. Cuando verifique: cambiar en Vercel `EMAIL_FROM` a
   `Brachfield Academy <hola@academy.perebrachfield.com>` → Redeploy
4. Desde ese momento los emails llegan a cualquier destinatario (ahora, en
   modo sandbox, solo al email del dueño de la cuenta Resend)

## 6 · Stripe en modo real — 🧑 antes de cobrar de verdad

1. Decidir titularidad de la cuenta (¿empresa de Pere?) — se puede crear una
   cuenta nueva o completar la actual con los datos fiscales
2. Activar la cuenta (datos de empresa, banco) en dashboard.stripe.com
3. Crear en modo LIVE el producto/precio (39 €/mes) y el webhook (misma URL)
4. Sustituir en Vercel las 4 variables de Stripe por las versiones live
   (`sk_live_…`, `pk_live_…`, `price_…` live, `whsec_…` live) → Redeploy
5. Prueba real: una suscripción con tarjeta de verdad (se puede reembolsar)

## 7 · Contenido y últimos retoques — 🧑

- [ ] Sustituir el contenido de ejemplo por el definitivo (vídeos a Stream,
      PDFs reales en las herramientas, fechas reales de eventos)
- [ ] Revisar los textos legales (aviso legal, privacidad, condiciones,
      cookies si se añade marketing) con quien corresponda
- [ ] Vercel Pro (~20 $/mes) al abrir al público
- [ ] Borrar los usuarios demo de producción si los hubiera

## 8 · El día del lanzamiento

1. Verificar checkout live con una compra real
2. Vigilar PostHog (Activity) y Sentry las primeras horas
3. Los 76 tests + CI siguen protegiendo cada cambio posterior
