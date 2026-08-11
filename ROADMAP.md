# ROADMAP.md — Brachfield Academy

Fases de desarrollo (orden vinculante, del briefing §93). No se implementa funcionalidad de una fase futura antes de completar la actual.

## MVP (briefing §90)

Landing · Auth · Stripe · Onboarding · Dashboard · Cursos · Vídeos · Documentos · Biblioteca · Buscador · Favoritos · Progreso · Herramientas · Eventos · Perfil · Suscripción · Admin/CMS · Analytics básicos · Emails.

| Fase                      | Contenido                                                                                                                                                                                                                            | Estado                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| **0 — Discovery**         | TECHNICAL_PLAN, CLAUDE.md, ROADMAP, DECISIONS                                                                                                                                                                                        | ✅                                                          |
| **1 — Foundation**        | Proyecto Next.js 15 + TS strict + Tailwind, lint/format, env, Neon + Prisma, Better Auth base, layouts, tokens portados del prototipo, componentes UI básicos, CI (typecheck+lint+unit)                                              | ✅                                                          |
| **2 — Database**          | Schema completo (presentar y revisar ANTES de migrar, §59), migraciones, seed realista desde el contenido del prototipo (6 cursos, 30 vídeos, 10 podcasts, 20 guías, 15 plantillas, 10 checklists, 10 casos, eventos, usuarios demo) | ✅                                                          |
| **3 — Auth + Billing**    | Signup/login/reset/verificación, Stripe Checkout, webhooks idempotentes, guards de membership, página billing + Customer Portal                                                                                                      | ✅ (Stripe test verificado E2E en producción el 2026-08-10) |
| **4 — Public Website**    | Landing, pricing, catálogo público parcial, ficha pública de curso, SEO completo (metadata, OG, sitemap, robots, schema.org)                                                                                                         | ✅                                                          |
| **5 — Onboarding**        | Perfil profesional, objetivos, nivel; persistencia y uso en personalización                                                                                                                                                          | ✅                                                          |
| **6 — Application Shell** | Sidebar desktop, bottom nav mobile, header, buscador global, notificaciones, perfil                                                                                                                                                  | ✅                                                          |
| **7 — Content Engine**    | Payload CMS: colecciones content/categorías/tags/media, workflow DRAFT→PUBLISHED, R2, publicación                                                                                                                                    | ✅ (R2 pendiente de cuenta Cloudflare)                      |
| **8 — Courses**           | Cursos/módulos/lecciones, player Cloudflare Stream (velocidades, subtítulos, capítulos, PiP), progreso con throttle, continuar donde lo dejaste, transcript clicable                                                                 | ✅ (player de vídeo pendiente de Cloudflare)                |
| **9 — Library**           | Explorar (descubrimiento editorial) + Biblioteca (consulta estructurada), categorías, filtros, relacionados                                                                                                                          | ✅ (incluye Favoritos reales)                               |
| **10 — Search**           | Postgres FTS (spanish+unaccent) tras SearchService, filtros, orden, registro de búsquedas                                                                                                                                            | ⬜                                                          |
| **11 — Tools**            | Plantillas/checklists/scripts, preview, descarga con URL firmada + DownloadLog                                                                                                                                                       | ⬜                                                          |
| **12 — Events**           | Eventos, reserva/cancelación, recordatorios por email, replays                                                                                                                                                                       | ⬜                                                          |
| **13 — Personalization**  | Recomendaciones por perfil/intereses/tags (reglas, sin ML), bloques del dashboard, nuevo esta semana                                                                                                                                 | ⬜                                                          |
| **14 — Admin**            | Gestión fina: usuarios, preguntas, eventos, publicación, configuración                                                                                                                                                               | ⬜                                                          |
| **15 — Analytics**        | Los ~17 eventos de producto vía AnalyticsService, validación de tracking, KPIs básicos                                                                                                                                               | ⬜                                                          |
| **16 — Testing**          | Unit + integration (webhooks/auth) + E2E Playwright de los 9 flujos críticos + revisión seguridad y accesibilidad                                                                                                                    | ⬜                                                          |
| **17 — Performance**      | Lighthouse, queries del dashboard (sin N+1, §11), imágenes, caching, bundles                                                                                                                                                         | ⬜                                                          |
| **18 — Production**       | Staging, env de producción, migraciones, Sentry, backups, release checklist, dominio definitivo                                                                                                                                      | ⬜                                                          |

## V1 (post-MVP)

Podcasts avanzados (player persistente completo) · Learning Paths con progreso · Certificados PDF · Pregunta a Pere · Casos prácticos interactivos (case_solution_revealed) · Actualidad avanzada (NEW/UPDATED/IMPORTANT) · Personalización fina.

## V2

Brachfield AI (RAG sobre contenido propio, con fuentes, sin inventar recomendaciones legales) · Teams / COMPANY_ADMIN · Comunidad · Calculadoras avanzadas (DSO, intereses de demora, coste del retraso) · App móvil si tiene sentido.

## Preparado desde el MVP para el futuro (sin implementarlo)

- Enum de roles incluye `COMPANY_ADMIN` (sin lógica).
- `plan` en Subscription (anual/cupones = config Stripe).
- Metadata e IDs de contenido listos para indexación vectorial (AI).
- Feature flags (PostHog) para AI/community/teams/certificates/advanced search.
- i18n estructural (es → ca/en sin refactor).
