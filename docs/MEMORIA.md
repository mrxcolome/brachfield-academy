# Memoria del proyecto — Brachfield Academy

> **Para qué sirve este documento.** Es el seguro de vida del proyecto. Si el propietario (Xavi)
> pierde su cuenta de Claude, cambia de asistente de IA o incorpora a un desarrollador humano,
> este archivo + el repositorio contienen TODO lo necesario para continuar sin perder contexto.
> Última actualización: 19 de septiembre de 2026.

## 0 · Instrucción de arranque para un asistente nuevo

1. Clona `https://github.com/mrxcolome/brachfield-academy` y **lee `CLAUDE.md` entero**: es la
   bitácora oficial, con cada fase, decisión e incidente desde el primer día. Manda sobre todo.
2. Lee después `DECISIONS.md` (ADRs), `docs/LAUNCH_CHECKLIST.md` (camino al estreno) y este archivo.
3. Respeta la **forma de trabajo** (sección 2). No es opcional: es la mitad del valor del proyecto.

## 1 · Qué es

- **Producto**: https://brachfieldacademy.com — membresía B2B (39 €/mes, plan único, IVA incl.) de
  formación en credit management, prevención de impagos y recobro, de **Pere Brachfield**
  (perebrachfield.com). En **prelanzamiento**: web pública sin indexar, Stripe en modo test.
- **Personas**: Xavi (propietario y director del proyecto, no técnico, mr.xcolome@gmail.com),
  Pere Brachfield (el autor y profesor), Cristina (editora).
- **Documentos públicos**: el dossier (/dossier) y la guía de estilos (/guia-estilos.html),
  ambos sin indexar, servidos desde `public/`.

## 2 · Forma de trabajo con el propietario (imprescindible)

- Comunicación **en español** (o catalán si él lo usa), sin jerga técnica; instrucciones de
  interfaz **clic a clic** cuando tiene que hacer algo él.
- Estructura de propuesta: **problema → impacto → alternativas → recomendación**. Para cambios de
  diseño grandes: **maqueta primero**, implementación después de su OK. Los cambios los aprueba
  uno a uno y con capturas.
- **Cada unidad de trabajo terminada se sube** (push a `main` = deploy automático en Vercel).
  Verificar SIEMPRE antes: typecheck + tests + `npm run build` **sin enmascarar el código de
  salida** (un lint rojo tumbó los deploys durante horas una vez).
- Sin sobre-ingeniería. Prioridad: usabilidad > claridad > funcionalidad > decoración.
- Honestidad ante todo: nada de contenido inventado presentado como real (los testimonios de
  ejemplo están señalizados y bloqueados en el checklist de lanzamiento; el «redactor gemelo de
  Pere» se construyó y se retiró por decisión suya: «no es creíble»).

## 3 · Inventario de cuentas y servicios (sin secretos)

| Servicio       | Qué es                                                                                                                                                                                | Dónde                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **GitHub**     | Código + bitácora. Repo `mrxcolome/brachfield-academy`, rama `main`.                                                                                                                  | github.com            |
| **Vercel**     | Hosting. Proyecto `brachfield-academy-app` (producto, raíz del repo) y `brachfield-academy` (prototipo antiguo, Root=prototype). Plan Hobby. Las **variables de entorno viven aquí**. | vercel.com            |
| **Neon**       | Postgres de producción (eu-central-1). Inalcanzable desde sandboxes: migraciones vía workflow.                                                                                        | neon.tech             |
| **Cloudflare** | Registrador del dominio, DNS, R2 (archivos), Stream (vídeo; subdominio de player en `stream-player.tsx`).                                                                             | cloudflare.com        |
| **Stripe**     | Cobros. EN MODO TEST hasta el estreno. Webhook en `/api/webhooks/stripe`.                                                                                                             | stripe.com            |
| **Resend**     | Emails transaccionales, remitente hola@brachfieldacademy.com (dominio verificado).                                                                                                    | resend.com            |
| **PostHog**    | Analítica server-side sin cookies (proyecto en eu.posthog.com).                                                                                                                       | posthog.com           |
| **Anthropic**  | API de Claude para el curador del tablón de noticias.                                                                                                                                 | console.anthropic.com |
| **Sentry**     | Errores (pendiente de DSN — checklist).                                                                                                                                               | sentry.io             |
| **Magnific**   | Generación/edición de imágenes (conector MCP de la cuenta de Xavi).                                                                                                                   | magnific.com          |

Variables de entorno en Vercel (nombres, nunca valores en el repo): `DATABASE_URL`,
`BETTER_AUTH_*`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `STRIPE_*`, `R2_*`,
`CLOUDFLARE_STREAM_TOKEN`, `POSTHOG_API_KEY`, `ANTHROPIC_API_KEY`, `CRON_SECRET`.
**Regla de oro**: los secretos jamás pasan por el chat ni por el repo — se pegan directamente en
Vercel (una API key se quemó una vez por pegarla en el chat; se revocó al instante).

## 4 · Arquitectura en una página

Next.js 15.4 (App Router, **no subir a 15.5** hasta que Payload lo soporte), TypeScript estricto
y Tailwind 4. Postgres con **dos capas**: Prisma (usuarios, suscripciones, progreso, favoritos,
noticias…, migraciones en `prisma/migrations`) y **Payload CMS 3** embebido en `/admin` (contenido
editorial, schema `payload`, migraciones en `src/migrations`). Auth con Better Auth. La **Sala de
profesores** (`/app/sala`) es una capa guiada sobre la Local API de Payload. El código de producto
vive en `src/features/*` (un directorio por dominio) y las páginas en `src/app`.

Piezas singulares:

- **Tablón «El sector, al día»** (`src/features/sector-news/`): cron diario 05:30 UTC lee 5 RSS de
  prensa, Claude (`claude-opus-5`) elige ≤2 noticias POR DÍA con etiqueta, «la clave para ti» y
  contenido relacionado; autocura imágenes y etiquetas; nada anterior a sept. 2026 (guardarraíl
  en código). La landing enseña las 3 últimas (ISR 1h).
- **Workflows GitHub**: `db-deploy` (migra Neon al tocar `prisma/migrations/**` o
  `src/migrations/**` — con verificación que impide verdes mentirosos) y `fetch-landing-images`
  (puente para traer imágenes de CDNs inalcanzables desde sandboxes: se escriben URLs temporales
  en `docs/landing-image-urls.json` y el workflow las commitea optimizadas).
- **Cron jobs Vercel**: recordatorios de directos (07:00 UTC) y tablón de noticias (05:30 UTC),
  ambos con Bearer `CRON_SECRET` y `maxDuration=60`.

## 5 · Reglas de diseño (resumen; la referencia es /guia-estilos.html)

- Paleta: azul marca `#172B49` (acción), granate `#A21E26` y naranja `#E88800` (acentos del logo),
  naranja fuerte `#A85C00` para sellos con texto blanco (AA), papel cálido de fondo.
- **Escala tipográfica cerrada de 4 tamaños**: 36 / 24 / 14 / 11 (mono). Ningún tamaño nuevo sin
  decisión del propietario.
- El logo se usa tal cual, siempre. Fotos: la serie de marca cálida + el retrato de estudio de
  Pere (`public/landing/pere-hero.webp`, generado de su foto real). Contraste AA en todo; única
  excepción pactada: «Nuevo este mes» del menú en naranja puro.
- Un solo CTA protagonista por pantalla: «Quiero ser alumno».

## 6 · Operaciones del día a día

- **Desplegar**: push a `main` → Vercel construye y publica (2-3 min). El build DEBE pasar lint.
- **Migraciones a producción**: se commitean y el workflow `db-deploy` las aplica en Neon.
  Cuidado histórico: una fila `dev` en `payload.payload_migrations` cuelga `payload migrate`
  (borrarla); tras migrar Prisma, `npx prisma generate`.
- **Contenido**: Pere/Cristina usan la Sala (`/app/sala`); el CMS `/admin` es el modo experto.
  NUNCA borrar contenido por SQL directo (deja versiones huérfanas; se sufrió).
- **Entorno local de desarrollo** (para asistentes): Postgres 16 local (`brachfield_dev`,
  dev/dev), `npx prisma migrate deploy` + `npx payload migrate` + seeds (`SEED_DEV_ADMIN=1
npx tsx src/payload/seed.ts`). Tests: `npm test` (unit), `npx playwright test` (E2E, 19).
  Usuarios de prueba en CLAUDE.md.
- **Día del estreno** (todo en `docs/LAUNCH_CHECKLIST.md`): contenido real, vídeo de bienvenida
  de Pere, testimonios reales (o apagar `TESTIMONIALS_LIVE`), Stripe live, legales,
  `PRELAUNCH=false` (activa indexación), Google Search Console, Vercel Pro.

## 7 · Dónde está cada documento

| Documento               | Ruta                                             | Qué contiene                                          |
| ----------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| **Bitácora completa**   | `CLAUDE.md`                                      | Toda la historia, decisiones e incidentes. LA fuente. |
| ADRs                    | `DECISIONS.md`                                   | Decisiones de arquitectura formales.                  |
| Briefing original       | `docs/briefing.md`                               | Las 100 secciones fundacionales del producto.         |
| Plan técnico / roadmap  | `TECHNICAL_PLAN.md`, `ROADMAP.md`                | Arquitectura y fases.                                 |
| Checklist de estreno    | `docs/LAUNCH_CHECKLIST.md`                       | Pasos del propietario, con avisos.                    |
| Seguridad / rendimiento | `docs/SECURITY_REVIEW.md`, `docs/PERFORMANCE.md` | Revisiones.                                           |
| Guía de estilos         | `public/guia-estilos.html` → /guia-estilos.html  | Identidad visual con ejemplos.                        |
| Dossier                 | `public/dossier/` → /dossier                     | El proyecto explicado con capturas.                   |
| Esta memoria            | `docs/MEMORIA.md`                                | El manual de arranque y el inventario.                |

## 8 · Pendientes vivos a fecha de hoy

Del propietario: contenido real de Pere, vídeo de bienvenida (pegar UID en
`src/features/welcome/config.ts`), 3 testimonios reales, Stripe live, legales, Sentry DSN,
Vercel Pro, fotos adicionales si las quiere. Del producto (solo si se pide): email mensual
«Este mes en la Academia» (diseñar antes de enviar nada), portadas de libros en alta resolución
si aparecen los originales.
