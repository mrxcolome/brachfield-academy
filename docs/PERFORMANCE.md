# Performance — Fase 17 (2026-08-12)

## Qué se hizo

1. **N+1 eliminado en /app/learning** — antes: 1 consulta de progreso POR curso
   (6 cursos = 6 consultas); ahora `getCoursesProgress` trae todo el progreso
   del usuario en UNA consulta y agrupa en memoria (briefing §11).
2. **Dedupe por petición (`React.cache`)** en las lecturas por slug del CMS
   (`getCourseBySlug`, `getContentBySlug`, `getCategories`): `generateMetadata`
   y la página compartían consulta duplicada — ahora es una.
3. **HSTS** añadido a las cabeceras (cierra el pendiente #3 del SECURITY_REVIEW;
   el resto de cabeceras existían desde la Fase 1).
4. Revisión de bundle y páginas estáticas (ya estaban bien, ver medidas).

## Medidas (build de producción, local)

| Métrica                              | Valor                               | Lectura                                                  |
| ------------------------------------ | ----------------------------------- | -------------------------------------------------------- |
| First Load JS compartido             | **101 kB**                          | Ligero: no hay librerías pesadas en el cliente           |
| Landing, /courses, /pricing          | **estáticas (SSG)** · TTFB 3–7 ms   | Se sirven pre-renderizadas desde el CDN de Vercel        |
| /app (dashboard, la página más cara) | **~240–320 ms** navegación completa | CMS + Prisma + personalización; sin consultas duplicadas |
| /app/learning                        | **~150–220 ms**                     | Con el fix N+1                                           |
| /app/library                         | **~160–250 ms**                     | Filtros server-side                                      |

En producción los tiempos absolutos varían (red del usuario, región), pero la
estructura es la que importa: público = estático en CDN; privado = dinámico
con consultas acotadas y sin N+1.

## Decisiones conscientes (no hacer de más)

- **Sin caché de datos del CMS entre peticiones** (p. ej. `unstable_cache`):
  el catálogo es pequeño y las consultas son de milisegundos; una capa de
  invalidación añadiría complejidad y el riesgo de contenido desactualizado
  tras publicar. Reevaluar si el catálogo crece x10.
- **Sin índice GIN para el buscador** todavía (documentado en DATABASE.md):
  el tsvector por consulta es instantáneo a este volumen.
- **Covers SVG generadas**: no hay imágenes pesadas que optimizar; cuando el
  CMS use thumbnails reales, pasarlas por `next/image`.
