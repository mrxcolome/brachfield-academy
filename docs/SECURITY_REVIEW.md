# Revisión de seguridad — Fase 16 (2026-08-12)

Revisión sistemática de las superficies de ataque del MVP. Cada punto indica
la defensa implementada y dónde vive. Los pendientes van al final.

## Autenticación y sesiones

| Riesgo                                | Defensa                                                                                                                                                                  | Dónde                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| Robo de credenciales por fuerza bruta | Rate limit de Better Auth (global 20/min + reglas estrictas en sign-in/sign-up: 3/10s). Verificado por E2E: el flag que lo desactiva solo existe en el servidor de tests | `src/lib/auth.ts`                 |
| Cuentas con emails falsos             | Verificación de email obligatoria antes del primer login                                                                                                                 | `requireEmailVerification: true`  |
| CSRF en endpoints de auth             | Better Auth exige cabecera `Origin` válida (descubierto en E2E: peticiones sin Origin → 403)                                                                             | Better Auth core                  |
| Cookies de sesión                     | httpOnly + `__Secure-` prefix en producción; sesión en BD revocable                                                                                                      | Better Auth + `src/middleware.ts` |

## Autorización (la UI nunca autoriza)

| Riesgo                                              | Defensa                                                                                                                                             | Dónde                           |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Acceso sin pagar al contenido premium               | `requireActiveMember` en CADA página/action privada; el estado viene de la tabla `subscription` local sincronizada por webhooks — nunca del cliente | `src/features/auth/guards.ts`   |
| Escalada a admin                                    | `requireRole('ADMIN','EDITOR')` server-side en layout Y en cada page/action del admin; probado por E2E (miembro → expulsado de /app/admin)          | `src/app/app/admin/*`           |
| Un admin quitándose el rol / cambiándose a sí mismo | Bloqueado en la action                                                                                                                              | `src/features/admin/actions.ts` |
| IDs manipulados desde el cliente                    | Las actions NUNCA aceptan ids: reciben slugs y resuelven contra el CMS server-side (favoritos, descargas, reservas, lecciones)                      | actions de cada feature         |

## Pagos

| Riesgo                         | Defensa                                                        | Dónde                                  |
| ------------------------------ | -------------------------------------------------------------- | -------------------------------------- |
| Webhooks falsificados          | Verificación de firma de Stripe con el secreto del endpoint    | `src/app/api/webhooks/stripe/route.ts` |
| Reenvío/duplicado de webhooks  | Idempotencia: unique `stripeEventId`, claim-then-process       | `src/features/billing/webhooks.ts`     |
| Acceso decidido por el cliente | El acceso se decide contra `subscription.status` en NUESTRA BD | `src/features/billing/access.ts`       |

## Ficheros y contenido premium

| Riesgo                                 | Defensa                                                                                                                                                                                  | Dónde                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Descarga directa de documentos premium | En producción (R2 activo) la ruta pública de media solo sirve imágenes; documentos/audio SOLO con URL firmada que caduca (5 min descarga / 3 h audio) emitida tras `requireActiveMember` | `src/payload/collections/media.ts`, `src/features/tools/downloads.ts` |
| Inyección SQL en el buscador           | Consultas parametrizadas (`$queryRaw` template) + `websearch_to_tsquery`; testeado con input malicioso en integración                                                                    | `src/features/search/service.ts`                                      |
| XSS desde contenido del CMS            | El richtext se renderiza con el componente oficial de Lexical (sin `dangerouslySetInnerHTML` propio)                                                                                     | fichas y lecciones                                                    |

## Infraestructura

| Riesgo                                      | Defensa                                                                                                    | Dónde                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Cron de recordatorios invocado por terceros | `Authorization: Bearer CRON_SECRET` obligatorio (401 sin él)                                               | `src/app/api/cron/event-reminders/route.ts` |
| Secretos en el repositorio                  | Todos los secretos viven en Vercel/GitHub Secrets; `.env` gitignored; `.env.example` sin valores           | —                                           |
| Borrado GDPR                                | `onDelete: Cascade` desde User purga todo el rastro; soft-delete con `deletedAt` para el periodo de gracia | `prisma/schema.prisma`                      |

## Pendientes conocidos (aceptados, con plan)

1. **Reproducción de vídeo sin firma** — los embeds de Stream usan URL pública
   no listada. Suficiente pre-lanzamiento; endurecer con signed playback
   tokens de Stream en Fase 18 si se considera necesario.
2. **Payload `/admin`** — protegido por su propia auth (colección admins).
   Activar 2FA para los admins cuando Payload lo facilite o al crecer el equipo.
3. **Cabeceras de seguridad** (CSP, HSTS…) — revisar en Fase 17/18 con
   `next.config` headers.
