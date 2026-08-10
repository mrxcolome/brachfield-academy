# DECISIONS.md — Architecture Decision Records

Formato: contexto → opciones → decisión → consecuencias. Estados: `PROPUESTO` (pendiente de OK del propietario), `ACEPTADO`, `SUSTITUIDO`.

---

## ADR-000 · El prototipo no es la base del producto — **ACEPTADO**

**Contexto.** Existe un prototipo Vite+React SPA (32 pantallas, HashRouter, datos mock) desplegado en Vercel. El briefing exige Next.js, SEO, BD, auth y pagos.
**Decisión.** El producto se construye de nuevo con Next.js App Router. El prototipo pasa a `/prototype/` como referencia visual. Se portan: tokens de diseño, sistema de arte SVG, contenido editorial (→ seed), arquitectura de información.
**Consecuencias.** El deploy público actual seguirá siendo el prototipo hasta que el producto alcance paridad visual (Fase 4).

## ADR-001 · Autenticación: Better Auth — **PROPUESTO**

**Opciones.** Auth.js/NextAuth (gratis, pero email+password con verificación/reset requiere construirlo a mano) · Clerk (gestionado, UI lista, coste por MAU, lock-in de identidad) · Supabase Auth (arrastra al ecosistema Supabase) · **Better Auth** (self-hosted sobre nuestro Postgres; email/password + verificación + reset integrados; social login activable; roles; sesiones en BD).
**Decisión propuesta.** Better Auth. La identidad es el núcleo de un membership y debe vivir en nuestra BD junto a Stripe; coste cero; sin lock-in.
**Consecuencias.** Mantenemos nosotros las pantallas de auth (el design system ya las tiene diseñadas). Si el mantenimiento pesara más de lo previsto, Clerk es la salida gestionada.

## ADR-002 · CMS: Payload 3 embebido — **PROPUESTO**

**Opciones.** Sanity (SaaS, buen editor, contenido fuera de nuestra BD, coste por seats) · Strapi/Directus (servidor separado que mantener) · WordPress headless (no encaja con contenido estructurado + roles finos) · admin propio (carísimo de construir bien) · **Payload 3** (vive dentro de la app Next en `/admin`, contenido en nuestro Postgres, editor Lexical estructurado, roles, media, relaciones, drafts+scheduling, tipos TS generados, gratis).
**Decisión propuesta.** Payload 3.
**Consecuencias.** Un solo deploy y una sola BD. Convivencia Payload(Drizzle)+Prisma se resuelve con schemas Postgres separados. Editor (Pere/equipo) trabaja en `/admin` con workflow DRAFT→REVIEW→SCHEDULED→PUBLISHED.

## ADR-003 · Vídeo: Cloudflare Stream — **PROPUESTO**

**Opciones.** Mux (mejor DX y analytics, ~más caro por minuto) · Vimeo (simple, embeds, control de acceso débil vía API) · **Cloudflare Stream** (HLS adaptativo, signed URLs para premium, subtítulos, precio plano previsible, sinergia con R2).
**Decisión propuesta.** Cloudflare Stream + R2 para audio/documentos (una sola cuenta Cloudflare para todo el media).
**Consecuencias.** Player propio (hls.js) con la UI del design system. Si la analítica de vídeo se queda corta, Mux es el upgrade natural.

## ADR-004 · Búsqueda: Postgres FTS tras SearchService — **PROPUESTO**

**Opciones.** Meilisearch/Typesense (excelentes, pero infra adicional desde el día 1) · Algolia (caro) · **Postgres FTS** (diccionario spanish + unaccent, tsvector ponderado título/extracto/cuerpo/transcript, cero infra extra).
**Decisión propuesta.** Postgres FTS en MVP, encapsulado en `SearchService` para poder migrar de motor sin tocar UI.
**Consecuencias.** Relevancia "suficientemente buena" para miles de contenidos; typo-tolerance limitada (mitigable con unaccent + prefijos). Se registran las búsquedas para decidir con datos si migrar.

## ADR-005 · Analytics: PostHog (EU) — **PROPUESTO**

**Opciones.** GA4 (marketing web, débil en producto, incómodo GDPR) · Plausible (privacidad, pero solo pageviews) · Mixpanel (bueno, caro al crecer) · **PostHog EU** (product analytics + feature flags + session replay, plan gratuito amplio, datos en la UE).
**Decisión propuesta.** PostHog tras `AnalyticsService` propio. Sus feature flags cubren también §83 del briefing.
**Consecuencias.** Un solo proveedor para eventos y flags. KPIs financieros (MRR, churn) salen de Stripe, no de PostHog.

## ADR-006 · Pagos: Stripe Checkout + Customer Portal — **ACEPTADO** (fijado por briefing §74/§38)

Checkout hospedado (nunca guardamos tarjeta), Customer Portal para tarjeta/facturas/cancelación, webhooks idempotentes (tabla StripeEvent), acceso premium validado siempre contra el estado local sincronizado.

## ADR-007 · Emails: Resend + React Email — **PROPUESTO**

Templates React versionados en el repo (no HTML en handlers), `EmailService` como único punto de salida. Alternativa equivalente: Postmark (más caro, deliverability excelente). Se elige Resend por DX e integración.

## ADR-008 · Hosting BD: Neon — **PROPUESTO**

Postgres serverless con branching (BD efímera por preview deploy de Vercel), plan gratuito para arrancar, PITR en pago. Alternativa: Supabase (arrastra su ecosistema), RDS (sobredimensionado para MVP).
