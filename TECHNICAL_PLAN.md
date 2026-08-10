# TECHNICAL_PLAN.md — Brachfield Academy

> FASE 0 · Discovery. Documento de arquitectura previo a cualquier código de producto.
> Fuente de verdad del producto: el briefing del proyecto (100 secciones). Este plan lo traduce a decisiones técnicas concretas.
> Estado: **EN REVISIÓN** — no se inicia la Fase 1 hasta aprobar este plan y los ADRs de `DECISIONS.md`.

---

## 1. Resumen del producto

Plataforma de membresía por suscripción (39 €/mes, plan único "Profesional") sobre Credit Management, prevención de impagos y recobro, vinculada a Pere Brachfield. Público B2B profesional (CFO, Credit Manager, cobros, legal).

Tres trabajos que el producto debe resolver: **aprender** (cursos, itinerarios), **consultar** (buscador, herramientas, plantillas) y **actualizarse** (actualidad, eventos, contenido semanal). Es una herramienta profesional recurrente, no un LMS ni un infoproducto.

Prioridad de producto: `usabilidad > claridad > funcionalidad > diseño decorativo`. Arquitectura: **monolito modular** — sin microservicios, sin infraestructura enterprise.

## 2. Estado actual del repositorio

| Qué | Estado |
| --- | --- |
| Prototipo React 18 + Vite + TS (SPA, HashRouter) | Desplegado en Vercel, 32 pantallas |
| Contenido editorial en español (`src/data/content.ts`) | ~490 líneas, realista, reutilizable como seed |
| Sistema de arte SVG generativo (`src/components/art.tsx`) | Portadas, avatar, PDF preview — portable |
| Tokens de diseño (`src/styles/global.css`) | Paleta oklch, IBM Plex, radios, bordes — portables |
| Backend / BD / auth / pagos | No existe nada |

**Contradicciones detectadas con el briefing:**

1. El prototipo es Vite SPA; el briefing exige Next.js App Router → **el producto se construye de nuevo**; el prototipo pasa a `prototype/` como referencia visual y fuente de contenido.
2. HashRouter (`#/`) es incompatible con el SEO exigido (sección 42) → rutas reales de Next.js.
3. El prototipo tiene checkout propio con campo de tarjeta; el briefing (§74) manda Stripe Checkout y prohíbe guardar tarjetas → Stripe Checkout hospedado.
4. "Mi suscripción" del prototipo duplica lo que da Stripe Customer Portal (§38) → la página interna muestra estado y enlaza al Portal para tarjeta/facturas/cancelación.
5. El briefing pide Tailwind (§5); el prototipo usa CSS plano con variables → se migran los tokens a config de Tailwind (los valores oklch se conservan).

## 3. Stack tecnológico propuesto

| Capa | Elección | Alternativa considerada | Por qué |
| --- | --- | --- | --- |
| Framework | **Next.js 15 (App Router) + React + TS strict** | — (fijado por briefing) | SSR/SSG para SEO del área pública, Server Components para el dashboard, Server Actions para mutaciones |
| Estilos | **Tailwind CSS 4 + tokens propios** | CSS Modules | Fijado por briefing; tokens oklch del prototipo se portan a `@theme` |
| Base de datos | **PostgreSQL gestionado (Neon)** | Supabase, RDS | Serverless, branching de BD por preview deploy (encaja con Vercel), plan gratuito para arrancar |
| ORM | **Prisma** | Drizzle | Fijado por briefing salvo razón clara; migrations + tipos generados; equipo de una persona → DX gana |
| CMS/Admin | **Payload CMS 3** (embebido en la app Next, `/admin`) | Sanity, Strapi, Directus, admin propio | Ver ADR-002. Vive dentro del mismo repo/deploy, contenido en NUESTRO Postgres, editor Lexical estructurado (no HTML arbitrario), roles, media, relaciones, i18n, gratis self-hosted |
| Auth | **Better Auth** (self-hosted, Postgres) | Auth.js, Clerk, Supabase Auth | Ver ADR-001. Email+password con verificación y reset OUT OF THE BOX (Auth.js no lo trae), roles, social login futuro, sin coste por usuario ni lock-in |
| Pagos | **Stripe**: Checkout + Customer Portal + webhooks | — (fijado) | Ver §7 de este plan |
| Vídeo | **Cloudflare Stream** | Mux, Vimeo | Ver ADR-003. Signed URLs (protege contenido premium), HLS adaptativo, subtítulos, capítulos vía metadata, precio plano previsible (~5 $/1000 min almacenados + 1 $/1000 min servidos) |
| Audio + documentos | **Cloudflare R2** (S3-compatible) + CDN | S3, Supabase Storage | Mismo proveedor que Stream, sin coste de egress, URLs firmadas para premium |
| Búsqueda | **Postgres Full-Text Search** (config `spanish` + `unaccent`) tras un `SearchService` | Meilisearch, Typesense | Ver ADR-004. Cero infra extra en MVP; la capa de servicio permite migrar motor sin tocar UI |
| Analytics + feature flags | **PostHog** (EU cloud) | GA4, Plausible, Mixpanel | Ver ADR-005. Product analytics + feature flags (§83) + session replay en un solo proveedor, plan gratuito amplio, GDPR-friendly en región UE |
| Emails | **Resend + React Email** | Postmark | Templates en React (no HTML en handlers), dominio propio, DX excelente |
| Monitoring | **Sentry** | — | Front + back + performance, fijado por briefing como referencia |
| i18n | **next-intl**, `es` único al inicio | — | Textos de UI centralizados en `messages/es.json` desde el día 1; añadir `ca`/`en` después no exige refactor |
| Testing | **Vitest + Testing Library + Playwright** | Jest | Vitest es nativo del ecosistema Vite/moderno; Playwright para los 9 flujos E2E del briefing (§58) |
| Deploy | **Vercel** (app) + Neon (BD) + Cloudflare (media) | — | Fijado por preferencia; preview deploys con BD branch |

## 4. Diagrama conceptual

```
                    ┌─────────────────────────────────────────────┐
                    │              VERCEL (Next.js app)           │
                    │                                             │
 Visitante ──────▶  │  Área pública (SSG/ISR, SEO)                │
                    │  /  /pricing  /courses/[slug]  /login ...   │
                    │                                             │
 Miembro ────────▶  │  Área privada (RSC + Server Actions)        │
                    │  /app  /app/courses  /app/library ...       │
                    │                                             │
 Editor/Admin ───▶  │  Payload CMS  →  /admin                     │
                    │                                             │
                    │  API routes: /api/webhooks/stripe           │
                    │              /api/auth/[...all]             │
                    │  Servicios: SearchService, AnalyticsService,│
                    │             AccessService, EmailService     │
                    └──────┬──────────┬──────────┬────────────────┘
                           │          │          │
              ┌────────────┴───┐  ┌───┴────┐  ┌──┴──────────────┐
              │ Neon Postgres  │  │ Stripe │  │ Cloudflare      │
              │ (app + payload)│  │        │  │ Stream (vídeo)  │
              │                │  │Checkout│  │ R2 (audio/docs) │
              └────────────────┘  │Portal  │  └─────────────────┘
                                  │Webhooks│
                                  └────────┘
              PostHog (eventos+flags) · Resend (emails) · Sentry (errores)
```

Un solo deploy, una sola BD, módulos separados por dominio. Nada de colas ni servicios externos propios en MVP.

## 5. Modelo de datos inicial (conceptual)

Payload gestiona las colecciones de **contenido** (genera sus tablas); Prisma gestiona el dominio de **aplicación** (usuarios-app, progreso, billing). Ambos sobre el mismo Postgres, en schemas separados (`payload.*` / `public.*`).

### Dominio contenido (colecciones Payload)

- **content** — colección única con `contentType` discriminador: `VIDEO | AUDIO | ARTICLE | PDF | GUIDE | CHECKLIST | TEMPLATE | WEBINAR | CASE_STUDY | NEWS | TOOL | QUICK_LEARNING(tag)`. Campos: slug, title, subtitle, description, excerpt, thumbnail(media), author(rel), status(`DRAFT|REVIEW|SCHEDULED|PUBLISHED|ARCHIVED`), visibility(`public|premium`), level, duration, publishedAt, featured, premium, tags[], categories[], seo{}, relatedContent[] (manual > algorítmico), attachments[], body (Lexical estructurado), transcript[{ts,text}] para vídeo/audio, streamId/r2Key según tipo
- **courses** — title, slug, description, thumbnail, teacher, level, duration, objectives[], requirements[], certificateEnabled, status; **modules** (orden) → **lessons** (orden, tipo, duración, contentRef)
- **learning-paths** — title, description, level, duration, orderedItems[] (polimórfico a course/content)
- **events** — title, description, type(`WEBINAR|QA|MASTERCLASS|CASE|LEGAL_UPDATE`), startAt/endAt (UTC, §50), timezone, capacity, streamUrl, replayContentRef, speaker
- **categories**, **tags**, **media**

### Dominio aplicación (Prisma)

- **User** — id, name, lastName, email, avatar, company, jobTitle, country, locale, timezone, role(`VISITOR|MEMBER|ADMIN|EDITOR`; `COMPANY_ADMIN` reservado en el enum, sin lógica), createdAt, lastLoginAt, onboardingStatus, professionalProfile, level, interests[], preferences json, notificationSettings json, stripeCustomerId
- **Subscription** — userId, stripeSubscriptionId, status(`ACTIVE|TRIALING|PAST_DUE|CANCELED|INCOMPLETE|EXPIRED`), plan, currentPeriodEnd, cancelAtPeriodEnd
- **StripeEvent** — eventId único (idempotencia §37), type, processedAt, payload, error
- **UserProgress** — userId, contentId|lessonId, status, progressPct, lastPositionSec, completedAt, updatedAt · índice compuesto (userId, contentId)
- **Favorite** — userId, contentId, createdAt · unique(userId, contentId)
- **EventRegistration** — userId, eventId, status(`RESERVED|CANCELED|ATTENDED`), createdAt
- **Question** — userId, question, category, consentToPublish, status(`PENDING|SELECTED|ANSWERED|PUBLISHED`), answer, answerType
- **Notification** — userId, type, title, message, url, read, createdAt
- **Certificate** — userId, courseId, certificateNumber, issuedAt, pdfUrl
- **DownloadLog** — userId, contentId, createdAt (registro de descargas §20)
- **SearchQuery** — query, userId?, resultsCount, createdAt (analytics de búsqueda)

Convenciones: `createdAt/updatedAt` en todo, soft delete solo en User y Content (papelera editorial), UUIDs, índices revisados en la Fase 2 con el schema Prisma real delante. **El schema completo se diseña y se te presenta antes de la primera migración (§59).**

## 6. Autenticación (ADR-001, propuesto)

**Better Auth** self-hosted sobre nuestro Postgres.

- Email + password con **verificación de email y reset integrados** (Auth.js/NextAuth los deja a medias en credentials); social login (Google/LinkedIn) activable después; sesiones en BD; campos custom en el user; middleware para roles.
- vs **Clerk**: Clerk da UI pulida y cero mantenimiento, pero cuesta por MAU, es lock-in fuerte y la identidad del usuario es el corazón de un membership — mejor tenerla en nuestra BD junto a Stripe.
- vs **Supabase Auth**: obliga a gravitar hacia Supabase entero; no aporta nada que Better Auth no tenga aquí.
- Guards server-side en tres niveles (§39): `requireUser` → `requireActiveMember` → `requireRole(ADMIN|EDITOR)`. Nunca solo ocultar botones; toda Server Action valida sesión + suscripción + rol.

## 7. Suscripciones Stripe

Flujo: registro → email verificado → **Stripe Checkout** (subscription mode) → webhook `checkout.session.completed` → crear `Subscription` local `ACTIVE` → onboarding → `/app`.

- Acceso a contenido premium: **siempre** contra `Subscription.status` local (sincronizado por webhooks), server-side.
- Webhooks (§37): los 6 del briefing, firma verificada, idempotencia por `StripeEvent.eventId`, log de errores a Sentry.
- **Customer Portal** para tarjeta, facturas, cancelar, reactivar. La página `/app/account/billing` muestra estado + botón al Portal.
- Preparado para evolución: `plan` como campo desde el día 1; cupones/anual = configuración Stripe, no código nuevo.
- Orden registro→pago→onboarding: pagar antes de personalizar reduce abandono entre pago y valor; el onboarding retiene al recién pagado. Si en el futuro hay trial, se revisa.

## 8. CMS (ADR-002, propuesto)

**Payload CMS 3** embebido: `/admin` en el mismo deploy.

- Contenido estructurado con editor **Lexical** (headings, listas, quotes, tablas, embeds, callouts, uploads — §41), no HTML arbitrario.
- Roles nativos (ADMIN/EDITOR) con access control por colección; workflow de estados con drafts + publicación programada (§81).
- Media library con R2 como storage adapter.
- Relaciones (related content, categorías, tags) nativas; tipos TypeScript generados del schema.
- Contenido vive en **nuestro** Postgres (vs Sanity/Contentful: SaaS externo, coste por seat, contenido fuera).
- Coste: 0 €. Riesgo: convivencia Payload(Drizzle)+Prisma en una BD → mitigado con schemas Postgres separados y FKs lógicas (ids) entre dominios.

## 9. Vídeo y audio

- **Vídeo — Cloudflare Stream** (ADR-003): upload desde Payload admin (signed upload URL), HLS adaptativo, **signed playback URLs** con expiración para premium, subtítulos VTT, thumbnails. Player propio sobre `hls.js`/`<mux-player>`-equivalente con: play/pause, seek, volumen, fullscreen, PiP, velocidades 0.75–2×, capítulos (metadata JSON del content), subtítulos, guardado de posición con throttle (cada 10 s o al pausar/salir — §17, nunca cada segundo).
- **Audio**: MP3/AAC en R2 tras URL firmada; player persistente global (estado en un store ligero tipo Zustand en el layout raíz del área privada) que sobrevive a la navegación (§19).
- **Transcripciones** (§18): array `{ts, text}` en el content; render clicable → `player.seekTo(ts)`; indexadas en el tsvector de búsqueda.

## 10. Storage

R2 con dos buckets: `media-public` (thumbnails, og-images — CDN público) y `media-premium` (PDFs, plantillas DOCX, audio — solo URL firmada emitida server-side tras validar suscripción). Descargas premium pasan por endpoint que registra `DownloadLog` y redirige a URL firmada de 60 s.

## 11. Búsqueda (ADR-004, propuesto)

- MVP: **Postgres FTS** — columna `tsvector` generada (title A, subtitle/excerpt B, body/transcript C) con diccionario `spanish` + `unaccent`; ranking `ts_rank`; filtros por tipo/categoría/nivel/duración/fecha como WHERE normales; orden relevancia/reciente/popular.
- Toda la búsqueda pasa por `SearchService.search(query, filters, sort)` → la UI no conoce el motor; migrar a Meilisearch/Typesense después es reimplementar una clase.
- UX: "¿Qué necesitas resolver hoy?", sugerencias, búsquedas recientes (localStorage), registro en `SearchQuery`.

## 12. Analytics (ADR-005, propuesto)

**PostHog EU** tras un `AnalyticsService.track(event, props)` propio (§44 — sin dependencia directa en componentes). Los ~17 eventos del briefing tipados en un union TS. Feature flags de PostHog cubren §83 (AI, community, teams…). KPIs (§45): MRR/churn/ARPU salen de Stripe; activación/WAU/consumo salen de PostHog; sin BI propio en MVP.

## 13. Emails

Resend + React Email. Templates en `/src/emails/`: verificación, bienvenida, reset, suscripción confirmada, pago rechazado, cancelación, evento reservado, recordatorio evento, certificado. `EmailService.send(template, to, props)` único punto de salida; logging de envíos.

## 14. Seguridad

- Validación **Zod en toda Server Action y route handler** (schemas compartidos con el cliente, §65).
- Autorización en cada mutación (guards §6); rate limiting en auth y búsqueda (Upstash Ratelimit o similar ligero); secure cookies (Better Auth); CSP y security headers en `next.config`; secrets solo en env vars (Vercel); sanitización del rich text al render (el Lexical estructurado ya lo acota); webhooks Stripe con verificación de firma.
- GDPR (§55): exportación y borrado de cuenta como Server Actions desde el perfil; consentimiento analytics antes de cargar PostHog; banner de cookies mínimo y veraz (solo las cookies reales: sesión + analytics opt-in).

## 15. Testing

- **Unit (Vitest)**: cálculo de progreso, AccessService (matriz rol×suscripción×visibilidad), recomendaciones, SearchService, mapeo de webhooks.
- **Integration**: webhooks Stripe (fixtures de eventos reales + idempotencia), auth flows, queries de dashboard.
- **E2E (Playwright)**: los 9 flujos del §58 — registro, login, suscripción (Stripe test mode), onboarding, ver curso, progreso, buscar, favoritos, cancelar.
- CI (GitHub Actions): typecheck + lint + unit en cada PR; E2E contra preview deploy en main.

## 16. Deployment y entornos

| Entorno | App | BD | Stripe | Dominio |
| --- | --- | --- | --- | --- |
| development | local | Neon branch dev | test mode | localhost |
| preview | Vercel preview por PR | Neon branch efímero | test mode | *.vercel.app |
| production | Vercel prod | Neon main | live mode | academy.perebrachfield.com (por confirmar) |

Migraciones Prisma en el build de producción con gate manual; backups automáticos Neon (PITR); release checklist en `DEPLOYMENT.md` (Fase 18).

## 17. Estructura del repositorio

```
/prototype/            ← prototipo Vite actual (referencia visual, no se despliega)
/src/
  /app/                ← rutas Next: (public)/ (app)/ (auth)/ admin/ api/
  /components/ui/      ← design system (Button, Input, Modal, …)
  /components/product/ ← CourseCard, Player, Transcript, FilterBar, …
  /features/           ← dominios: auth/ billing/ content/ courses/ learning/
                          search/ favorites/ events/ tools/ notifications/ analytics/
     (cada dominio: actions.ts, service.ts, queries.ts, schemas.ts, components/)
  /lib/                ← clientes: db, stripe, r2, stream, posthog, resend
  /emails/
  /payload/            ← config Payload: collections, access, fields
  /styles/             ← tokens (portados del prototipo)
  /types/
/messages/es.json      ← textos de UI (next-intl)
/prisma/               ← schema + migrations + seed
/tests/                ← unit / integration / e2e
/docs/decisions/       ← ADRs
```

Regla §63: la lógica vive en su dominio de `/features`, no en `utils.ts`.

## 18. Roadmap técnico

Ver `ROADMAP.md`. Resumen: Fases 1–3 (fundación, BD, auth+billing) son el esqueleto crítico; 4–6 (público, onboarding, shell); 7–12 (motor de contenidos → cursos → biblioteca → búsqueda → herramientas → eventos); 13–18 (personalización, admin fino, analytics, testing, performance, producción). MVP = §90 del briefing.

## 19. Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| Payload+Prisma sobre la misma BD | Medio | Schemas separados; si roza, Payload puede absorber más dominio (tiene auth/roles propios) — decisión reversible en Fase 2 |
| Vídeo premium filtrado (URLs compartidas) | Medio | Signed URLs cortas + dominio restringido en Stream |
| Contenido real no listo al lanzar | Alto (producto vacío) | El seed editorial ya escrito llena la plataforma; plan de carga de contenido real en paralelo a Fases 7–8 |
| Stripe mal sincronizado (accesos incorrectos) | Alto | Idempotencia + tests de integración de webhooks + reconciliación diaria (cron ligero) |
| Una sola persona operando el CMS | Medio | Payload con workflow simple y validaciones; documentación de uso en `docs/` |
| SEO: dominio/subdominios vs perebrachfield.com | Medio | Decidir dominio antes de Fase 4; canonical + sitemap desde el primer deploy público |

## 20. Decisiones a tomar antes de empezar (necesito tu OK)

1. **ADR-001 Auth**: Better Auth (recomendado) vs Clerk (gestionado, de pago).
2. **ADR-002 CMS**: Payload embebido (recomendado) vs Sanity (SaaS).
3. **ADR-003 Vídeo**: Cloudflare Stream (recomendado) vs Mux (mejor DX, más caro) vs Vimeo (simple, menos control).
4. **ADR-005 Analytics**: PostHog (recomendado) vs Plausible+nada de product analytics.
5. **Dominio**: ¿`academy.perebrachfield.com`, dominio propio nuevo, u otro?
6. **Repositorio**: reconstruir en este mismo repo (prototipo → `/prototype/`, recomendado) vs repo nuevo.
7. **Cuentas a crear por ti**: Stripe, Cloudflare, Neon, PostHog, Resend, Sentry (todas tienen plan gratuito o test mode para empezar; te guiaré una a una cuando toque).
