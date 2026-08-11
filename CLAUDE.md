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
- Siguiente: FASE 9 (Library — Explorar + Biblioteca desde Payload) y FASE 10 (Search FTS). Cloudflare (Stream+R2) desbloquea el player y los uploads persistentes.
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
