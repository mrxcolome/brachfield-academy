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

- **FASE 0 (Discovery) entregada** — pendiente de revisión del propietario.
- Existe un **prototipo** Vite+React en la raíz (pasará a `/prototype/` al arrancar Fase 1): 32 pantallas, contenido editorial real en `src/data/content.ts`, arte SVG en `src/components/art.tsx`, tokens en `src/styles/global.css`. Es **referencia visual y fuente del seed**, no base de código del producto.
- Deploy actual en Vercel = el prototipo (https://brachfield-academy.vercel.app).

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

## Comandos (prototipo, hasta Fase 1)

```bash
npm run dev        # Vite dev server
npm run build      # tsc + vite build
npm run preview    # servir dist/
```

(Con la Fase 1 esta sección se sustituye por los comandos del proyecto Next.)

## Git

- Remote: https://github.com/mrxcolome/brachfield-academy (deploy automático de `main` a Vercel).
- El entorno remoto de Claude NO tiene credenciales de push permanentes: pedir al propietario un fine-grained PAT (Contents: Read and write) cuando haya que subir, o que instale la GitHub App de Claude con write.
