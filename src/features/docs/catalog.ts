// Documentación interna (/docs): el catálogo de documentos y a quién va cada uno.
// Los HTML viven en content/docs/<slug>.html (fuera de public/: solo se sirven tras el guard).

export interface DocEntry {
  slug: string
  title: string
  audience: string
  summary: string
  href: string
}

export const DOCS: DocEntry[] = [
  {
    slug: 'descubre',
    title: 'Descubre la Academy',
    audience: 'Para quien llega nuevo',
    summary:
      'El proyecto de principio a fin: por qué existe, para quién, qué ve el alumno, cómo se crea el contenido y en qué punto estamos.',
    href: '/docs/descubre',
  },
  {
    slug: 'manual-editor',
    title: 'Manual del editor',
    audience: 'Para Pere y Cristina',
    summary:
      'Cómo publicar en la Sala de profesores, paso a paso y con capturas: las seis tipologías, los formatos, la portada con IA y los cursos.',
    href: '/docs/manual-editor',
  },
  {
    slug: 'playbook',
    title: 'Playbook del propietario',
    audience: 'Para el propietario',
    summary:
      'El manual de operaciones: qué hay construido, las tareas del día a día, tus cuentas y claves, y lo que queda hasta el lanzamiento.',
    href: '/docs/playbook',
  },
  {
    slug: 'sala-de-maquinas',
    title: 'La sala de máquinas',
    audience: 'Para el propietario y el equipo',
    summary:
      'Los servicios que hacen funcionar la plataforma, sin tecnicismos: qué hace cada uno, cuánto cuesta y dónde se gestiona.',
    href: '/docs/sala-de-maquinas',
  },
  {
    slug: 'guia-estilos',
    title: 'Guía de estilos',
    audience: 'Para quien diseña o escribe',
    summary:
      'La identidad visual: paleta con sus reglas, la escala tipográfica, botones, sellos y reglas rápidas de uso.',
    href: '/guia-estilos.html',
  },
]

export const SERVED_SLUGS = new Set(
  DOCS.filter((d) => d.href === `/docs/${d.slug}`).map((d) => d.slug),
)
