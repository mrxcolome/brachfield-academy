# CLAUDE.md — Brachfield Academy

Contexto operativo para sesiones de Claude Code. Leer antes de tocar código.

## Qué es este proyecto

Plataforma de membresía (39 €/mes, plan único) sobre Credit Management, prevención de impagos y recobro, de Pere Brachfield (perebrachfield.com). Público B2B profesional. Tres trabajos: **aprender** (cursos), **consultar** (buscador/herramientas), **actualizarse** (actualidad/eventos).

Prioridad de producto: `usabilidad > claridad > funcionalidad > diseño decorativo`. Idioma del producto y del contenido: **español**. Tono: profesional, claro, humano — nunca jerga tech ("Biblioteca", no "Content Library").

## Fuentes de verdad

1. **El briefing del producto** (100 secciones, en la conversación original / `docs/briefing.md` si existe) — manda sobre cualquier decisión técnica.
2. `TECHNICAL_PLAN.md` — arquitectura aprobada.
3. `DECISIONS.md` — ADRs; no revertir decisiones aceptadas sin nuevo ADR.
4. `ROADMAP.md` — fases; **no implementar funcionalidad de fases futuras**.

## Estado actual

- FASE 0 (Discovery) ✅ — ADRs aceptados el 2026-08-10.
- FASE 1 (Foundation) ✅ — Next.js 15 + TS strict + Tailwind 4, tokens portados, UI base, ESLint/Prettier/Vitest, CI.
- FASE 2 (Database) ✅ — schema aprobado, migración `init` validada contra Postgres 16, seed de usuarios demo, `src/lib/db.ts` (singleton con adapter pg). Neon creado (eu-central-1) pero INALCANZABLE desde el sandbox (red bloqueada): las migraciones a Neon se aplican con el workflow "DB migrate (Neon)" usando el secreto `DATABASE_URL` de GitHub.
- FASE 3 (Auth + Billing) ✅ código — Better Auth activo (signup/login/verificación/reset, rate limit), guards de 3 niveles (`src/features/auth/guards.ts`), Stripe Checkout + Customer Portal (server actions), webhook idempotente (`/api/webhooks/stripe`), EmailService con modo dev (sin RESEND_API_KEY imprime a consola), páginas auth/checkout/billing, middleware de /app. E2E verificado en local. VERIFICADO E2E en producción (2026-08-10): registro→verificación (Resend)→login→Stripe Checkout test→webhook→Subscription ACTIVE→acceso a /app, probado por el propietario con tarjeta 4242.
- DESPLIEGUE: dos proyectos Vercel sobre el mismo repo — `brachfield-academy` (Root Directory=prototype, la demo de diseño) y `brachfield-academy-app` (raíz, el producto real, https://brachfield-academy-app.vercel.app) con env vars: DATABASE_URL (Neon pooled), BETTER_AUTH__, NEXT_PUBLIC_APP_URL, RESEND_API_KEY (modo sandbox: solo entrega al email del dueño hasta verificar dominio), STRIPE__ (test mode; webhook en /api/webhooks/stripe).
- FASE 4 (Public Website) ✅ — layout público, landing 13 secciones, /pricing, /courses + /courses/[slug] (SSG), arte SVG portado (src/components/art), catálogo provisional tipado en src/features/content/catalog.ts (Fase 7 lo sustituye por Payload tras la misma interfaz), sitemap/robots/JSON-LD (FAQPage, Course), OG metadata, noindex en zonas privadas.
- FASE 5 (Onboarding) ✅ — /onboarding (4 pasos: bienvenida, perfil, objetivos multi, nivel), saveOnboarding con Zod, persistencia en User, flujo checkout/success→onboarding→/app (redirect si PENDING). Recomendaciones por reglas perfil→cursos en src/features/onboarding/recommendations.ts.
- FASE 6 (Application Shell) ✅ — layout /app con Sidebar (desktop), MobileNav (bottom, 5 tabs), Header (buscador global→/app/search, campana con badge de no leídas, UserMenu con logout), dashboard personalizado, centro de notificaciones con markAllRead, /app/account (editar perfil), búsqueda PROVISIONAL sobre catálogo (Fase 10 la sustituye por FTS), placeholders honestos en learning/explore/library/tools/updates/events/favorites, error.tsx + not-found.tsx, middleware sin dependencias Edge (warning eliminado).
- FASE 7 (Content Engine) ✅ — Payload CMS 3 embebido en /admin (requiere next@15.4, NO subir a 15.5 hasta que Payload lo soporte; package.json type=module). Colecciones: admins (auth propia del panel, roles admin/editor), categories, tags, media (disco local; adapter R2 pendiente de cuenta Cloudflare), contents (11 tipos, drafts+autosave+schedulePublish, transcript, relatedContent, SEO), courses (módulos→lecciones como arrays anidados ordenables), events. Schema Postgres `payload` con migraciones propias (src/migrations, la inicial crea el schema). Seed editorial en src/payload/seed.ts (idempotente, BORRA contenido; SEED_DEV_ADMIN=1 crea admin dev admin@brachfieldacademy.test/brachfield-dev-2026 SOLO en dev). CI valida payload migrate + seed. Workflow Neon ejecuta payload migrate y seed editorial opcional (input seed_editorial). En prod el primer usuario del panel se crea en /admin (pantalla create-first-user).
- FASE 8 (Courses) ✅ — src/lib/cms.ts (Local API singleton), src/features/content/service.ts (getPublishedCourses/getCourseBySlug/flattenLessons), src/features/learning/ (progress.ts puro + service.ts + actions.ts markLesson/saveLessonPosition con validación de pertenencia). /app/learning real (en progreso/por empezar/completados), /app/courses/[slug] (ficha con temario y ✓), /app/courses/[slug]/[lessonId] (sidebar temario, render Lexical vía @payloadcms/richtext-lexical/react, transcript, prev/next, botón completar optimista), dashboard con "continúa donde lo dejaste" real. PENDIENTE de Cloudflare: player de vídeo (placeholder en lecciones video/audio); "Recomendado para ti" aún usa el catálogo estático (se cambia a Payload en Fase 13).
- FASE 9 (Library) ✅ — servicio de contenidos ampliado (getPublishedContents con filtros tipo/categoría/nivel, getContentBySlug depth:1, getFeaturedContents, getContentsByIds, CONTENT_TYPE_META/LEVEL_META), /app/explore (destacados, temas, cursos, novedades), /app/library (filtros por query params con chips-enlace, sin JS cliente), /app/contents/[slug] (ficha genérica: player placeholder según formato, RichText, transcript, relacionados depth:1, botón Guardar), Favoritos REALES (src/features/favorites: actions toggleFavorite server-side resolviendo el id desde el CMS, service + resolve.ts puro testeado, /app/favorites con chips por formato usando contentType desnormalizado), ContentCard compartida. Seed editorial ahora marca 4 featured y relatedContent manual (briefing §80) — en PROD el editor puede marcarlos con la casilla featured en /admin sin re-seedear (re-seedear BORRA y recrea contenido → cambia ids y rompe favoritos/progreso existentes).
- FASE 10 (Search) ✅ — SearchService (src/features/search/service.ts): FTS Postgres con to_tsvector('spanish')+unaccent EN TIEMPO DE CONSULTA (sin índice GIN: catálogo pequeño; añadirlo en migración futura cuando crezca) sobre payload.contents (título A, subtítulo/excerpt B, transcripción C) y payload.courses (título A, descripción B, títulos de lecciones C), websearch_to_tsquery (input del usuario seguro), fallback a subcadena unaccent+ILIKE si el FTS no devuelve nada ("buro"→"burofax"), y logSearch → tabla search_query (solo búsquedas sin filtro, nunca rompe la búsqueda). Migración 20260811125641_search_unaccent (CREATE EXTENSION unaccent; el workflow Neon la aplica al hacer push). /app/search real con chips de formato (Cursos + tipos presentes en resultados). Tests de integración en tests/integration/search.test.ts — en CI corren DESPUÉS del seed editorial de Payload (orden cambiado en ci.yml).
- FASE 12 (Events) ✅ (adelantada a la 11 por decisión del propietario 2026-08-11: la 11 espera la cuenta Cloudflare) — src/features/events/: service.ts (lecturas CMS: upcoming/replays/bySlug), reservations.ts (SOLO Prisma, separado para que los tests de integración no carguen Payload: reserve con control de aforo no-atómico aceptado y documentado, cancelReservation, counts), format.ts (fechas Europe/Madrid "hora peninsular"), actions.ts (guards + email de confirmación no bloqueante). Migración event_reminder_sent_at (reminderSentAt anti-duplicados; OJO tras migrar: npx prisma generate). /app/events real (próximos con aforo restante + ReserveButton optimista, replays → /app/contents/[slug]). Recordatorios: /api/cron/event-reminders (Bearer CRON_SECRET, idempotente, verificado E2E en local) + vercel.json cron diario 07:00 UTC. PENDIENTE del propietario: crear env var CRON_SECRET en Vercel (sin ella el cron responde 401 y no se envían recordatorios). Emails nuevos en src/emails/templates.ts (eventReservedEmail, eventReminderEmail). Seed: 3 eventos (2 futuros + 1 pasado con replayContent).
- FASE 11 (Tools + Cloudflare) ✅ código (2026-08-11; cuenta Cloudflare del propietario creada) — @payloadcms/storage-s3 activo SOLO con env vars R2_* (dev sigue en disco local; el sandbox no alcanza R2). Descargas: src/features/tools/downloads.ts (downloadUrlFor: URL firmada R2, attachment 5min / inline 3h para audio; fallback dev a media.url), actions.ts requestDownload (guard + DownloadLog), /app/tools real (contador de descargas, badge "más usada"), DownloadButton en fichas. SEGURIDAD: media.access.read — con R2 activo solo imágenes públicas; documentos/audio SOLO por URL firmada. Player: StreamPlayer (iframe.videodelivery.net, sin token) en lecciones (rawLesson.streamId) y fichas VIDEO/WEBINAR; audio con <audio> y URL firmada inline. Seed: 4 PDFs de marca en src/payload/seed-assets/ subidos como media y vinculados como documentFile. Vars Vercel que el propietario añadió: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, CLOUDFLARE_STREAM_TOKEN (este último aún sin uso en código: reservado para signed playback / subida vía API). PENDIENTE verificar en prod: subida de media a R2 desde /admin y un vídeo real en Stream (pegar su UID en streamId).
- Siguiente: FASE 13 (Personalization). Después 14 (Admin) y 15 (Analytics).
- El prototipo vive en `/prototype/`. Deploy de Vercel: hasta la Fase 4, la demo pública es el prototipo — al hacer push del restructure hay que poner Root Directory=`prototype` en los ajustes de Vercel.
- Desarrollo en sandbox: Postgres 16 local (service postgresql start; BD brachfield_dev, user dev/dev).

## Stack (una vez aprobados los ADRs)

Next.js 15 App Router + TS strict + Tailwind 4 · PostgreSQL (Neon) + Prisma · Payload CMS 3 embebido (`/admin`) · Better Auth · Stripe (Checkout + Portal + webhooks idempotentes) · Cloudflare Stream (vídeo) + R2 (audio/docs) · Postgres FTS tras `SearchService` · PostHog (analytics + flags) · Resend + React Email · Sentry · Vitest + Playwright · next-intl (es).

## Convenciones

- **Dominios en `/src/features/<dominio>/`** (auth, billing, content, courses, learning, search, favorites, events, tools, notifications, analytics). Nada de lógica en `utils.ts`/`helpers.ts` genéricos.
- Mutaciones = **Server Actions** con schema **Zod** + guard de autorización (`requireUser` / `requireActiveMember` / `requireRole`). Toda autorización es server-side; ocultar UI no autoriza nada.
- Fechas en **UTC** en BD; render en timezone del usuario.
- Textos de UI en `messages/es.json` (next-intl) — no hardcodear strings dispersos.
- Acceso premium: validar SIEMPRE contra `Subscription.status` local (sincronizado por webhooks Stripe).
- Eventos analytics solo vía `AnalyticsService.track()` — nunca PostHog directo en componentes.
- Commits pequeños y claros; cambios estructurales grandes se explican ANTES de ejecutarlos.
- TS strict, sin `any`; tipos generados desde schema (Prisma/Payload) cuando existan.
- Una funcionalidad no está terminada sin: tipado, validación, autorización, loading/error/empty states, responsive, accesibilidad y tests de lo crítico (§97 del briefing).

## Definición de "hecho" por fase

Al cerrar cada fase: tests pasan, `npm run build` limpio, documentación afectada actualizada (README/ARCHITECTURE/DATABASE/ENVIRONMENT/DEPLOYMENT), resumen de cambios al propietario, y siguiente paso propuesto.

## Forma de trabajar con el propietario

Es el product owner; no asumas conocimientos técnicos profundos. Para cada fase: (1) objetivo, (2) qué se construye, (3) decisiones necesarias → preguntar, (4) implementar, (5) tests, (6) errores, (7) resumen, (8) docs, (9) siguiente paso. Ante un problema: problema → impacto → alternativas → recomendación. Sin sobreingeniería: monolito modular; nada de microservicios/Kafka/K8s.

## Comandos

```bash
npm run dev           # Next.js dev server (http://localhost:3000)
npm run build         # build de producción
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npm run format:check  # prettier
npm test              # vitest (tests/unit)
npm run db:migrate    # prisma migrate dev (Postgres local)
npm run db:seed       # seed de usuarios demo
# prototipo: cd prototype && npm run dev
```

## Git

- Remote: https://github.com/mrxcolome/brachfield-academy (deploy automático de `main` a Vercel).
- El entorno remoto de Claude NO tiene credenciales de push permanentes: pedir al propietario un fine-grained PAT (Contents: Read and write) cuando haya que subir, o que instale la GitHub App de Claude con write.
