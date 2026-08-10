# DATABASE.md — Brachfield Academy

Diseño de la base de datos (Fase 2). Schema aprobado por el propietario el 2026-08-10; primera migración (`20260810153744_init`) creada y validada contra PostgreSQL 16.

## Los dos dominios y por qué no se cruzan con FKs

Un solo Postgres (Neon), dos schemas:

- **`public`** (Prisma) — dominio de **aplicación**: identidad, billing, progreso, favoritos, reservas, preguntas, notificaciones. Lo que el producto escribe.
- **`payload`** (Payload CMS, Fase 7) — dominio de **contenido**: cursos, módulos, lecciones, vídeos, guías, eventos editoriales, categorías, tags, media. Lo que el equipo editorial escribe.

Entre dominios se referencia por **id lógico** (`contentId`, `courseId`, `eventId` como `String`), sin foreign key física. Motivo: Payload gestiona sus tablas con su propio migrador (Drizzle); una FK física acoplaría los dos ciclos de migración y rompería restores parciales. La integridad se garantiza en la capa de servicio (los ids vienen siempre de consultas a Payload, nunca de input del usuario).

## Mapa de relaciones (dominio aplicación)

```
User 1─┬─n Session            (Better Auth)
       ├─n Account            (Better Auth: credenciales + social futuro)
       ├─n Subscription ──────  Stripe (stripeSubscriptionId único)
       ├─n UserProgress ─────→  contentId / courseId (Payload, lógico)
       ├─n Favorite ─────────→  contentId (Payload, lógico)
       ├─n EventRegistration →  eventId (Payload, lógico)
       ├─n Question           (Pregunta a Pere)
       ├─n Notification
       ├─n Certificate ──────→  courseId (Payload, lógico)
       └─n DownloadLog ──────→  contentId (Payload, lógico)

StripeEvent   (sin relación: log idempotente de webhooks)
Verification  (sin relación: tokens de verificación/reset de Better Auth)
SearchQuery   (userId opcional: búsquedas anónimas del área pública)
```

Todas las relaciones a User llevan `onDelete: Cascade`: el borrado GDPR de una cuenta purga automáticamente todo su rastro.

## Decisiones de diseño

1. **Better Auth dicta User/Session/Account/Verification.** Sus campos base son contrato del adapter; nuestros campos de perfil (briefing §8) se añaden al mismo modelo User — sin tabla Profile separada, porque la relación sería 1:1 sin beneficio.
2. **Una fila por suscripción de Stripe, no por usuario.** Un usuario que cancela y vuelve acumula historial; "¿es miembro activo?" = existe Subscription con status `ACTIVE|TRIALING|PAST_DUE` (PAST_DUE mantiene acceso durante el dunning de Stripe). Índice `(userId, status)` hace esa pregunta O(1).
3. **Progreso por pieza, curso agregado.** `UserProgress` guarda una fila por lección/vídeo/guía con `lastPositionSec` para reanudar. El % de un curso se calcula (lecciones completadas/total) — no se desnormaliza, para que nunca diverja. El índice `(userId, updatedAt DESC)` alimenta "continúa donde lo dejaste" sin scan.
4. **`StripeEvent` = idempotencia.** El handler inserta el `stripeEventId` (único) antes de procesar; si ya existe, ignora el reenvío. `error != null` marca eventos reprocesables.
5. **`Favorite.contentType` desnormalizado** a propósito: los filtros de la página Guardados ("Cursos / Vídeos / Herramientas") no deben pagar un viaje a Payload por fila.
6. **Soft delete solo en User** (`deletedAt`, periodo de gracia GDPR). El resto se borra de verdad — briefing §59: soft delete solo donde aporta.
7. **Enums de BD para estados** (roles, suscripción, progreso, preguntas…): integridad en la capa más baja + tipos TS generados. `COMPANY_ADMIN` existe en el enum (briefing §7) sin lógica asociada.
8. **Fechas siempre `timestamptz` UTC** (Prisma `DateTime`); el render aplica `User.timezone` (briefing §50).

## Índices (resumen del porqué)

| Índice                                        | Sirve a                                     |
| --------------------------------------------- | ------------------------------------------- |
| `user_progress (userId, updatedAt DESC)`      | "Continúa donde lo dejaste" del dashboard   |
| `user_progress (userId, courseId)`            | % de progreso de un curso                   |
| `subscription (userId, status)`               | Guard `requireActiveMember` en cada request |
| `favorite (userId, contentType)`              | Filtros de Guardados                        |
| `event_registration (eventId, status)`        | Control de aforo (contar reservas)          |
| `notification (userId, read, createdAt DESC)` | Campana de no leídas                        |
| `question (status, createdAt)`                | Cola de revisión del admin                  |
| `download_log (contentId, createdAt)`         | "Herramienta más descargada"                |
| `search_query (userId, createdAt DESC)`       | Búsquedas recientes del usuario             |

## Qué NO está aquí (y dónde vivirá)

| Concepto                                                       | Dónde                                          | Cuándo  |
| -------------------------------------------------------------- | ---------------------------------------------- | ------- |
| Cursos, módulos, lecciones, contenido, categorías, tags, media | Colecciones Payload (schema `payload`)         | Fase 7  |
| Learning paths                                                 | Colección Payload                              | V1      |
| Transcripciones + índice FTS (tsvector spanish+unaccent)       | Migración SQL manual sobre tablas de contenido | Fase 10 |
| Eventos analíticos de producto                                 | PostHog (no BD propia)                         | Fase 15 |
| Aforo/contadores derivados                                     | Calculados, no almacenados                     | —       |

## Entornos y flujo de migraciones

| Entorno                        | BD                                                                       | Cómo se migra                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sandbox de desarrollo (Claude) | Postgres 16 local (`postgresql://dev:dev@localhost:5432/brachfield_dev`) | `npm run db:migrate` — la red del sandbox no alcanza Neon                                                                                                         |
| CI (cada push/PR)              | Postgres 16 efímero (service container)                                  | `prisma migrate deploy` + `prisma db seed` — valida schema y seed reales                                                                                          |
| Producción                     | Neon (`eu-central-1`)                                                    | Workflow `DB migrate (Neon)`: automático al tocar `prisma/migrations/**` en main, o manual (Actions → Run workflow). Requiere el secreto `DATABASE_URL` en GitHub |

- Prisma 7: conexión en `prisma.config.ts` (`DATABASE_URL` en env), cliente generado en `src/generated/prisma` (gitignored, se regenera en `postinstall`).
- Runtime: `src/lib/db.ts` exporta el singleton `db` (adapter `@prisma/adapter-pg`).

## Seed

`prisma/seed.ts` (idempotente, dominio `@demo.brachfieldacademy.test`): Javier (miembro ACTIVE con progreso, favoritos, pregunta y notificación), Marta (CANCELED), Andreu (PAST_DUE), Admin y Editora. Cubre todos los estados que los guards y el dashboard deben distinguir. El contenido editorial (6 cursos, 30 vídeos…) se seedea en Payload en la Fase 7 desde `prototype/src/data/content.ts`.
