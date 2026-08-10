# Briefing del producto — Brachfield Academy

> FUENTE PRINCIPAL DE VERDAD del producto (del propietario, agosto 2026).
> Si una decisión técnica entra en conflicto con la UX o los objetivos de negocio aquí descritos, señalarlo antes de implementar.

Rol esperado de Claude: Lead Developer, Software Architect, Product Engineer y Technical Product Manager. Construir paso a paso una plataforma SaaS/membership profesional, sólida, escalable y preparada para producción. Mantener visión global; no crear funcionalidades aisladas sin entender la arquitectura.

## 1. Contexto
Plataforma de formación y conocimiento profesional por suscripción, especializada en: Credit Management, prevención de impagos, morosidad, recobro, riesgo de crédito, negociación con deudores, gestión del crédito comercial, procedimientos de cobro, políticas de crédito, instrumentos de pago, legislación relacionada, gestión financiera de clientes y cobros. Vinculada a Pere Brachfield (perebrachfield.com). Usuario final B2B: CFO, Credit Manager, responsable de crédito/cobros, controller, director administrativo, treasury manager, AR manager, gerente, consultor financiero, abogado especializado, equipos financieros. Debe parecer: SaaS B2B + academia premium + biblioteca profesional. NO juvenil, NO infoproducto, NO web tradicional de cursos.

## 2. Modelo de negocio
Membership por suscripción. 39 €/mes. Un único plan inicial: "Profesional" (acceso completo). La arquitectura debe permitir después: plan anual, cupones, promociones, suscripciones corporativas, licencias múltiples, planes para equipos, niveles de membresía. Sin complejidad innecesaria inicial.

## 3. Objetivo del producto
No es solo un LMS. Tres necesidades: APRENDER (cursos, vídeos, podcasts, itinerarios), CONSULTAR (encontrar rápido la solución a un problema profesional), ACTUALIZARSE (cambios legales, prácticas, actualidad). Herramienta profesional recurrente: "Tengo este problema. Voy a consultar qué recomienda Brachfield."

## 4. Principios de producto
USABILIDAD > CLARIDAD > FUNCIONALIDAD > DISEÑO DECORATIVO. Fácil, rápido, limpio, profesional, responsive, accesible, escalable, mantenible. Evitar: overengineering, dependencias innecesarias, componentes gigantes, lógica duplicada, funcionalidades sin utilidad, complejidad prematura.

## 5. Stack tecnológico
Frontend: Next.js (App Router preferido), React, TypeScript, Tailwind CSS, componentes reutilizables. Backend: el de Next.js mientras sea razonable (API Routes / Server Actions), lógica de negocio bien separada. BD: PostgreSQL; ORM Prisma u otra alternativa moderna con razón técnica clara. Auth: segura; candidatos Auth.js/Clerk/Supabase Auth — analizar pros/contras antes de decidir; debe soportar email/password, recovery, verification, social login futuro, roles, sessions. Pagos: Stripe (mensual, luego anual, cancelación, reactivación, facturas, webhooks, failed payments, customer portal). Storage: multimedia fuera del servidor de la app — vídeo: Mux/Cloudflare Stream/Vimeo o similar; audio: storage/CDN; documentos: S3-compatible/R2/Supabase Storage. Deploy: Vercel + PostgreSQL gestionado + CDN. Proponer arquitectura concreta antes de implementar.

## 6. Arquitectura general
ÁREA PÚBLICA: landing, pricing, catálogo público parcial, ficha pública de curso, login, registro, checkout, blog enlazado desde perebrachfield.com. ÁREA PRIVADA: dashboard, explorar, cursos, biblioteca, herramientas, actualidad, eventos, favoritos, mi formación, perfil, suscripción.

## 7. Roles
VISITOR (no registrado), MEMBER (suscripción activa), ADMIN, EDITOR (gestiona contenidos). Futuro: COMPANY_ADMIN (no implementar en MVP salvo estructura mínima).

## 8. Modelo de usuario
id, nombre, apellidos, email, avatar, empresa, cargo, país, idioma, timezone, rol, fecha registro, último acceso, estado onboarding, tipo de perfil profesional, nivel, intereses, preferencias, configuración de notificaciones, estado de suscripción, Stripe customer id, Stripe subscription id.

## 9. Onboarding
Tras registro. Perfil: Director Financiero / Credit Manager / Administración-Cobros / Controller / Gerencia / Abogado / Consultor / Otro. Objetivos (multi): prevenir impagos, reducir morosidad, mejorar recobro, mejorar riesgo de clientes, organizar departamento de crédito, mejorar negociación, conocimientos legales, reducir plazo medio de cobro, formación Credit Management. Nivel: iniciación / intermedio / avanzado. Guardar y usar para personalización.

## 10. Personalización
Dashboard adapta recomendaciones por perfil (CFO: estrategia/KPIs/riesgo/políticas/gestión; Credit Manager: prevención/riesgo/procesos/recobro; Cobros: negociación/scripts/procedimientos/casos; Abogado: legislación/procedimientos/jurisprudencia). Sistema sencillo por tags/categorías/perfil/intereses/nivel/historial. Sin ML inicial.

## 11. Dashboard (/app)
Saludo personalizado, buscador global, continuar donde lo dejaste, itinerario activo, recomendados, nuevo esta semana, herramienta destacada, pregunta del mes, próximo evento, últimos análisis. Rápido: queries optimizadas, no 20 consultas independientes.

## 12. Navegación
Desktop sidebar: Inicio, Mi formación, Explorar, Biblioteca, Herramientas, Actualidad, Eventos, Favoritos, Perfil. Mobile bottom nav: Inicio, Explorar, Buscar, Mi formación, Perfil.

## 13. Motor de contenidos (central)
Tipos: COURSE, VIDEO, AUDIO, ARTICLE, PDF, GUIDE, CHECKLIST, TEMPLATE, WEBINAR, CASE_STUDY, NEWS, LEARNING_PATH, TOOL. Campos: id, slug, title, subtitle, description, excerpt, thumbnail, author, contentType, status, visibility, level, duration, publishedAt, updatedAt, featured, premium, tags, categories, SEO metadata, related content, attachments.

## 14. Taxonomía
CATEGORY: Credit Management, Prevención de impagos, Riesgo de crédito, Recobro, Negociación, Legislación, Gestión financiera, Organización de crédito, Clientes morosos, Instrumentos de cobro, Casos prácticos. TAGS granulares: factura vencida, burofax, prescripción, DSO, moroso, pago, negociación, riesgo, crédito, cliente, SEPA, confirming, factoring, judicial.

## 15. Cursos
Course → Module (orden) → Lesson (orden, tipo de contenido, duración, vídeo/audio/texto/documentos). Course: title, description, thumbnail, teacher, level, duration, modules, learning objectives, requirements, status, certificate.

## 16. Progreso
UserProgress: userId, contentId, status, progressPercentage, lastPosition, completedAt, updatedAt. Vídeo/audio: timestamp. Continuar donde lo dejó; marcar lección completada; progreso total del curso.

## 17. Vídeo
Player: play/pause, seek, volumen, fullscreen, PiP, velocidad 0.75/1/1.25/1.5/2, subtítulos, capítulos, progreso. Guardar posición periódicamente con debounce/throttle (no petición por segundo).

## 18. Transcripciones
Vídeos y podcasts con transcript {timestamp, texto}. Click → saltar al segundo. Indexable por buscador interno.

## 19. Audio/Podcast
Player: play/pause, ±15s, velocidad, progreso, reproductor persistente al navegar dentro de la app.

## 20. Documentos
PDFs, guías, checklists, plantillas: preview web, descarga, registro de descarga, relacionados, versionado opcional.

## 21. Herramientas (/app/tools)
Tipos: templates, checklists, scripts, calculators, models. Ejemplos: email primer recordatorio, email factura vencida, carta formal, política de crédito, ficha de evaluación, procedimiento de cobros, acuerdo de pago, checklist prevención, checklist escalado, script telefónico.

## 22. Calculadoras
Arquitectura para calculadoras interactivas futuras: DSO, intereses de demora, coste financiero del retraso, impacto de morosidad, periodo medio de cobro. Componentes reutilizables. No implementarlas inicialmente salvo indicación.

## 23. Learning Paths
LearningPath: title, description, level, duration, orderedItems (→ Course/Video/Article/Podcast/Checklist/Template/CaseStudy). Progreso total calculado.

## 24. Buscador (/app/search) — muy importante
Busca: títulos, descripciones, artículos, transcripts, cursos, lecciones, PDF metadata, podcasts, herramientas, casos, tags. Inicio: PostgreSQL Full Text Search. Migrable a Algolia/Meilisearch/Typesense/Elastic/Vector sin rehacer UI → capa SearchService; no acoplar frontend al motor.

## 25. Filtros
Tipo, categoría, nivel, duración, fecha, autor, estado. Orden: relevancia, reciente, popular, duración.

## 26. Brachfield AI
NO implementar en v1. Preparar arquitectura conceptual: /api/ai futuro, RAG sobre artículos/cursos/transcripciones/documentos/contenido premium, solo contenido autorizado, mostrar fuentes, enlazar relacionados, nunca inventar recomendaciones legales. Preparar IDs/metadata/estructura para indexación vectorial futura.

## 27. Favoritos
Favorite: userId, contentId, createdAt. /app/favorites con filtros.

## 28. Historial
Guardar contenido visto, última visualización, progreso. Separar progreso actual de eventos analíticos; no guardar eventos ilimitados sin estrategia.

## 29. Actualidad (/app/updates)
Tipos: actualización legal, jurisprudencia, normativa, estadística, estudio, noticia. Estructura: qué ha cambiado / cómo te afecta / qué deberías hacer / relacionados. Destacados: NEW, UPDATED, IMPORTANT.

## 30. Eventos
Event: title, description, type (webinar/Q&A/masterclass/caso práctico/actualización legal), startAt, endAt, timezone, capacity, registration status, stream URL, replay URL, speaker. Miembros: reservar, cancelar, ver pasados, ver replay.

## 31. Pregunta a Pere (/app/ask)
Question: userId, question, category, status, createdAt, answer, answerType. Consentimiento para publicar. Admin: revisar, seleccionar, responder, publicar.

## 32. Casos prácticos
CaseStudy: problem, context, data, question, analysis, solution, recommendations, mistakes, related. Interacción: mostrar caso → botón "Ver análisis de Pere" → mostrar solución. Evento: case_solution_revealed.

## 33. Contenido corto
QuickLearning: 5–15 min. Content con tag quick-learning. Colección "Aprende en 10 minutos".

## 34. Certificados
Certificate: userId, courseId, certificateNumber, issuedAt, PDF URL. Solo si se cumplen requisitos. No presentar como acreditación oficial salvo configuración específica.

## 35. Comunidad
NO inicialmente. Solo arquitectura extensible. Prioridad v1: contenidos, preguntas a Pere, eventos, casos, herramientas.

## 36. Suscripciones
Flujo: plan → Stripe Checkout → payment → webhook → crear/activar membership. Acceso según estado local sincronizado. Estados: ACTIVE, TRIALING, PAST_DUE, CANCELED, INCOMPLETE, EXPIRED. Autorización SIEMPRE server-side.

## 37. Webhooks Stripe
checkout.session.completed, customer.subscription.created/updated/deleted, invoice.paid, invoice.payment_failed. Verificar signature, idempotencia por event ID, log de errores.

## 38. Customer Portal
Stripe Customer Portal: cambiar tarjeta, facturas, cancelar, reactivar.

## 39. Control de acceso
Middleware/guards server-side. Niveles: público, login requerido, suscripción activa, admin, editor. Nunca confiar en esconder botones.

## 40. Administración (/admin)
Dashboard, usuarios, cursos, contenidos, categorías, tags, learning paths, herramientas, eventos, preguntas, actualidad, configuración. Evaluar Sanity/Payload/Directus/Strapi/WP headless/admin propio valorando: facilidad de edición, multimedia, SEO, relaciones, roles, mantenibilidad, integración Next.js. Recomendar antes de desarrollar.

## 41. Editor de contenidos
Rich text: headings, links, listas, quotes, tablas, embeds, callouts, vídeo, audio, downloads, relacionados. Contenido estructurado; evitar HTML arbitrario.

## 42. SEO
Área pública: metadata, OpenGraph, Twitter cards, canonical, sitemap.xml, robots.txt, structured data (Course/Breadcrumb/Article schema). No indexar /app, /account, /admin, checkout, contenido premium.

## 43. Blog
perebrachfield.com tiene mucho contenido; no migrar sin análisis. Relación Post público → Academy content (relatedAcademyContent): cada artículo puede recomendar curso/vídeo/guía/herramienta/membership.

## 44. Analytics
AnalyticsService (sin dependencia directa en componentes). Eventos: signup_started, signup_completed, subscription_started, onboarding_completed, content_viewed, video_started, video_completed, audio_started, lesson_completed, course_started, course_completed, tool_downloaded, search_performed, favorite_added, event_registered, question_submitted, certificate_generated. Proveedores candidatos: GA4, PostHog, Plausible, Mixpanel — recomendar uno.

## 45. KPIs
MRR, suscriptores activos, churn, ARPU, conversion rate, activación 7 días, WAU, MAU, cursos iniciados/completados, horas consumidas, herramientas descargadas, retención, búsquedas, eventos. Sin BI avanzado; recoger datos bien desde el inicio.

## 46. Emails
Transaccionales con Resend/Postmark o similar: verificación, bienvenida, reset, suscripción confirmada, pago rechazado, cancelación, evento reservado, recordatorio evento, certificado. Templates, no HTML hardcodeado en handlers.

## 47. Notificaciones
Notification: userId, type, title, message, url, read, createdAt. Tipos: nuevo contenido, evento, actualización, curso, sistema. Notification center sencillo.

## 48. Newsletter semanal
"Brachfield Academy Weekly" — integración futura con CRM/email. No construir plataforma de marketing.

## 49. i18n
Inicial: español. Arquitectura preparada para catalán, inglés, otros. No hardcodear textos dispersos; sistema i18n si no supone sobreingeniería.

## 50. Timezones
Eventos en UTC; mostrar en timezone del usuario; nunca strings ambiguos.

## 51. Responsive
Desktop, tablet, mobile con diseño real (no solo reducir). Atención: vídeo, audio, lectura, buscador, navegación.

## 52. Accesibilidad
WCAG, HTML semántico, teclado, focus, ARIA, labels, contraste, subtítulos, alt text, errores accesibles.

## 53. Performance
Lighthouse alto, LCP, CLS mínimo, lazy load, imágenes optimizadas, code splitting, Server Components donde aporten, cache apropiada (nunca cachear privado incorrectamente).

## 54. Seguridad
Validación server-side, sanitización, CSRF cuando aplique, rate limiting, secure cookies, CSP, security headers, secrets en env. Nunca exponer Stripe secret / DB credentials / API keys. Autorización en todas las mutaciones.

## 55. Privacidad
GDPR: política privacidad, cookies, consentimiento, exportación de datos, eliminación de cuenta, gestión de comunicaciones. Banner de cookies acorde a cookies reales.

## 56. Logging
Estructurado (info/warning/error), sin datos sensibles innecesarios. Atención: webhooks Stripe, auth, emails, uploads.

## 57. Monitoring
Sentry o equivalente: errores front, back, performance.

## 58. Testing
UNIT: lógica de negocio, progreso, suscripciones, permisos. INTEGRATION: webhooks Stripe, auth, BD. E2E (Playwright): registro, login, suscripción, onboarding, ver curso, guardar progreso, buscar, favoritos, cancelar suscripción.

## 59. Database
Diseñar schema y ENSEÑARLO antes de migrar. Explicar relaciones, revisar índices, evitar duplicidad. createdAt/updatedAt donde tenga sentido. Soft delete solo donde aporte.

## 60. Seed
Datos realistas, NO Lorem Ipsum. 6 cursos (Prevención de impagos: sistema completo · Cómo recuperar una deuda paso a paso · Credit Management para Directores Financieros · Negociación profesional con clientes morosos · Análisis del riesgo de crédito · Gestión avanzada del departamento de cobros), 30 vídeos cortos, 10 podcasts, 20 guías/PDF, 15 plantillas, 10 checklists, 10 casos prácticos, eventos, actualizaciones, usuarios demo.

## 61. Contenido demo
Debe parecer real: "Cómo detectar señales de riesgo antes del impago", "Las siete excusas más frecuentes de un moroso", "Cuándo dejar de negociar una deuda", "Cómo diseñar una política de crédito", "Qué hacer con una factura vencida hace 90 días", "Cómo calcular el coste real de la morosidad", "Errores frecuentes en llamadas de cobro", "Cuándo utilizar un burofax", "Cómo documentar un acuerdo de pago".

## 62–63. Estructura y dominios
Estructura limpia (/app /components /features /lib /services /actions /hooks /types /config /db /emails /tests). Agrupar por dominio: auth, users, billing, content, courses, learning, search, favorites, events, tools, notifications, admin, analytics. Evitar utils.ts/helpers.ts/api.ts como cajón de sastre.

## 64–65. TypeScript y validación
Strict, sin any ni assertions innecesarias, tipos desde schema. Zod o equivalente, schemas compartidos, nunca confiar solo en frontend.

## 66. API
Convenciones consistentes, errores estándar, HTTP correcto, autorización, validación, observabilidad. Server Actions antes que REST cuando estemos dentro de Next.

## 67–68. Componentes
Design System: Button, Input, Select, Checkbox, Radio, Textarea, SearchInput, Badge, Tag, Tabs, Accordion, Dropdown, Modal, Dialog, Toast, Progress, Avatar, Tooltip, Skeleton, EmptyState, ErrorState, Pagination, Breadcrumb. Producto: CourseCard, ContentCard, ToolCard, EventCard, LearningPathCard, ContinueLearningCard, RecommendationSection, Player, AudioPlayer, Transcript, CourseSidebar, LessonNavigation, SearchResults, FilterBar, FavoriteButton, DownloadButton.

## 69. Estados
loading, empty, error, success, disabled, locked, completed, expired, payment failed, no results, event full, offline si procede.

## 70. Design system desde diseños
Si llegan diseños (Claude Design/Stitch/Figma): NO copiar CSS individual; extraer spacing, font scale, colors, radius, shadows, containers, breakpoints, components → tokens.

## 71–75. Páginas clave
Landing (hero, propuesta de valor, qué incluye, áreas, preview, herramientas, formación, actualidad, eventos, Pere, target, pricing, FAQ, CTA). /login (email, password, remember, forgot; sin filtrar info sensible en errores). /signup (email, password, nombre; después checkout u onboarding — analizar orden con menor fricción). Checkout: Stripe Checkout salvo razón clara; nunca guardar tarjeta. /app/learning: en progreso, itinerarios, completados, certificados, historial.

## 76–78. Explorar vs Biblioteca
/app/explore: descubrimiento editorial (collections, categories, featured, latest, quick learning, paths, filtros). /app/library: consulta y búsqueda estructurada, buscador prioritario. Si tras diseñar conviene unirlos, proponerlo antes de implementar.

## 79–80. Búsqueda UX y relacionados
Input destacado "¿Qué necesitas resolver hoy?", ejemplos (prescripción, factura vencida, cliente moroso, burofax), sugerencias, recientes, trending futuro. relatedContent por tags/categoría/manual; manual > algorítmico.

## 81–83. Workflow, versionado, flags
Status: DRAFT, REVIEW, SCHEDULED, PUBLISHED, ARCHIVED; no publicar borradores. Documentos legales: updatedAt visible ("Actualizado el…"), version history futuro. Feature flags sencillas para AI/community/teams/certificates/advanced search.

## 84–86. Entornos, git, documentación
development / preview-staging / production con variables separadas. Commits pequeños y claros; antes de cambios estructurales grandes, explicar. Mantener README, ARCHITECTURE, DATABASE, ENVIRONMENT, DEPLOYMENT actualizados.

## 87–89. CLAUDE.md, decisiones, backlog
CLAUDE.md en raíz (visión, arquitectura, stack, convenciones, decisiones, comandos, estructura, reglas). DECISIONS.md / docs/decisions con ADRs. ROADMAP.md con MVP/V1/V2/Future; no implementar futuro antes del MVP.

## 90–92. Alcance
MVP: landing, auth, Stripe, onboarding, dashboard, cursos, vídeos, documentos, biblioteca, buscador, favoritos, progreso, herramientas, eventos, perfil, suscripción, admin/CMS, analytics básicos, emails. V1: podcasts avanzados, learning paths, certificados, Pregunta a Pere, casos interactivos, actualidad avanzada, personalización. V2: Brachfield AI, teams, company admin, community, calculadoras avanzadas, app móvil si procede.

## 93. Orden de desarrollo
FASE 0 Discovery (TECHNICAL_PLAN.md) → 1 Foundation → 2 Database → 3 Auth+Billing → 4 Public Website → 5 Onboarding → 6 App Shell → 7 Content Engine → 8 Courses → 9 Library → 10 Search → 11 Tools → 12 Events → 13 Personalization → 14 Admin → 15 Analytics → 16 Testing → 17 Performance → 18 Production.

## 94–97. Forma de trabajo y calidad
Por fase: objetivo → qué se construye → decisiones → implementar → tests → errores → resumen → docs → siguiente paso. Ante problemas: problema, impacto, alternativas, recomendación. Sin sobreingeniería (monolito modular; nada de Netflix/microservicios/K8s/Kafka/event sourcing). "Terminado" = tipado + validación + autorización + loading/error/empty + responsive + a11y + analytics cuando toque + tests críticos.

## 98–100. Diseño, objetivo final y primera tarea
Diseños de herramientas visuales: analizar, extraer tokens/componentes, no copiar código sin revisar. Objetivo: un CFO puede registrarse, pagar, entrar, encontrar contenido relevante, hacer un curso, continuar, buscar, descargar plantilla, asistir a webinar, guardar, consultar novedades y gestionar su suscripción — rápido y profesional. Primera tarea: inspeccionar repo → TECHNICAL_PLAN.md (20 apartados) → CLAUDE.md, ROADMAP.md, DECISIONS.md → no empezar Fase 1 hasta revisión.
