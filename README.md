# Brachfield Academy

Plataforma de membresía (39 €/mes) sobre Credit Management, prevención de impagos y recobro, de Pere Brachfield.

## Documentación

| Documento           | Qué contiene                                    |
| ------------------- | ----------------------------------------------- |
| `docs/briefing.md`  | Briefing del producto — **fuente de verdad**    |
| `TECHNICAL_PLAN.md` | Arquitectura, stack y estrategia técnica        |
| `DECISIONS.md`      | ADRs (decisiones de arquitectura)               |
| `ROADMAP.md`        | Fases de desarrollo MVP → V1 → V2               |
| `DATABASE.md`       | Diseño de la base de datos                      |
| `CLAUDE.md`         | Contexto operativo para sesiones de Claude Code |

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS 4 · PostgreSQL (Neon) + Prisma 7 · Payload CMS · Better Auth · Stripe · Cloudflare Stream + R2 · PostHog · Resend · Sentry.

## Desarrollo

```bash
npm install
cp .env.example .env    # rellenar según la fase (ver comentarios)
npm run db:migrate      # requiere Postgres (local o Neon)
npm run db:seed         # usuarios demo
npm run dev             # http://localhost:3000
```

Verificación completa (lo mismo que ejecuta CI):

```bash
npm run typecheck && npm run lint && npm run format:check && npm test && npm run build
```

## Estructura

```
src/app/            rutas (App Router)
src/components/ui/  design system
src/features/       lógica por dominio (auth, billing, content, courses, …)
src/lib/            clientes e infraestructura compartida (db, i18n, …)
messages/es.json    textos de UI (next-intl)
prisma/             schema, migraciones y seed
tests/              unit / integration / e2e
prototype/          prototipo Vite original (referencia visual, no se despliega)
```

## Prototipo

El diseño navegable original vive en `prototype/` (`cd prototype && npm run dev`). Es la referencia visual del producto; su contenido editorial alimenta el seed del CMS (Fase 7).
