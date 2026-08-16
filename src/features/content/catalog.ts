// Catálogo público PROVISIONAL (Fase 4). Contenido editorial portado del
// prototipo. En la Fase 7 esta misma interfaz se sirve desde Payload CMS;
// las páginas no cambian.

export interface PublicCourse {
  slug: string
  title: string
  duration: string
  lessons: number
  description: string
  learn: string[]
  modules: { name: string; lessons: string[] }[]
}

export const courses: PublicCourse[] = [
  {
    slug: 'como-recuperar-un-impagado-paso-a-paso',
    title: 'Cómo recuperar un impagado paso a paso',
    duration: '2h 35min',
    lessons: 12,
    description:
      'Un recorrido completo, con casos reales, desde el diagnóstico inicial hasta la vía judicial: cómo reaccionar cuando un cliente deja de pagar y qué hacer en cada fase del proceso de recobro.',
    learn: [
      'Diagnosticar por qué un cliente no paga',
      'Escribir reclamaciones efectivas',
      'Negociar acuerdos de pago realistas',
      'Saber cuándo escalar a vía judicial',
    ],
    modules: [
      {
        name: 'Módulo 1 — Diagnóstico inicial',
        lessons: [
          'Por qué no paga un cliente',
          'Identificación del tipo de moroso',
          'Análisis previo de la deuda',
        ],
      },
      {
        name: 'Módulo 2 — Primeras acciones',
        lessons: ['Primer contacto', 'Email de reclamación', 'Llamada de cobro'],
      },
      {
        name: 'Módulo 3 — Negociación',
        lessons: ['Técnicas de negociación', 'Objeciones habituales', 'Acuerdos de pago'],
      },
      {
        name: 'Módulo 4 — Escalado',
        lessons: [
          'Requerimiento formal',
          'Reclamación extrajudicial',
          'Cuándo acudir a la vía judicial',
        ],
      },
    ],
  },
  {
    slug: 'gestion-y-prevencion-de-impagados',
    title: 'Gestión y prevención de impagados',
    duration: '3h 10min',
    lessons: 14,
    description:
      'El curso de base: cómo montar un sistema de prevención que reduzca la morosidad antes de que aparezca, desde la evaluación del cliente hasta las condiciones de venta.',
    learn: [
      'Evaluar la solvencia de un cliente nuevo',
      'Fijar límites de crédito prudentes',
      'Redactar condiciones de pago que protejan',
      'Detectar señales tempranas de impago',
    ],
    modules: [
      {
        name: 'Módulo 1 — Fundamentos',
        lessons: [
          'Qué es la morosidad y qué cuesta de verdad',
          'El ciclo del crédito comercial',
          'Mapa de riesgos de la cartera',
        ],
      },
      {
        name: 'Módulo 2 — Evaluación de clientes',
        lessons: [
          'Fuentes de información de solvencia',
          'La ficha de alta de cliente',
          'Fijar el límite de crédito inicial',
        ],
      },
      {
        name: 'Módulo 3 — Condiciones de venta',
        lessons: [
          'Condiciones de pago por escrito',
          'Medios de pago y su riesgo',
          'Garantías y reserva de dominio',
        ],
      },
      {
        name: 'Módulo 4 — Vigilancia',
        lessons: ['Señales tempranas de deterioro', 'Revisión periódica de límites'],
      },
    ],
  },
  {
    slug: 'negociacion-avanzada-con-deudores',
    title: 'Negociación avanzada con deudores',
    duration: '1h 50min',
    lessons: 9,
    description:
      'Técnicas de negociación aplicadas al cobro: psicología del deudor, manejo de objeciones y cierre de acuerdos de pago que se cumplen.',
    learn: [
      'Preparar una negociación de cobro',
      'Responder a las excusas más habituales',
      'Diseñar acuerdos con garantías',
      'Mantener la relación comercial mientras cobras',
    ],
    modules: [
      {
        name: 'Módulo 1 — Preparación',
        lessons: [
          'Perfil del deudor y estrategia',
          'Qué saber antes de la primera llamada',
          'Objetivos y límites de la negociación',
        ],
      },
      {
        name: 'Módulo 2 — La negociación',
        lessons: [
          'Estructura de la conversación de cobro',
          'Las siete excusas más frecuentes',
          'Técnicas de cierre de compromiso',
        ],
      },
      {
        name: 'Módulo 3 — El acuerdo',
        lessons: [
          'Documentar un acuerdo de pago',
          'Garantías que refuerzan el acuerdo',
          'Seguimiento y qué hacer si se incumple',
        ],
      },
    ],
  },
  {
    slug: 'organizacion-del-departamento-de-credit-management',
    title: 'Organización del departamento de Credit Management',
    duration: '2h 05min',
    lessons: 10,
    description:
      'Cómo estructurar la función de crédito en tu empresa: procesos, roles, indicadores y coordinación con ventas y finanzas.',
    learn: [
      'Definir la política de crédito de la empresa',
      'Organizar el flujo de trabajo de cobros',
      'Medir con los KPIs correctos (DSO, aging, morosidad)',
      'Alinear ventas y crédito sin fricciones',
    ],
    modules: [
      {
        name: 'Módulo 1 — La función de crédito',
        lessons: [
          'Roles y responsabilidades',
          'Dónde ubicar el departamento',
          'La política de crédito como documento',
        ],
      },
      {
        name: 'Módulo 2 — Procesos',
        lessons: [
          'Del pedido al cobro: el flujo completo',
          'Procedimiento interno de cobros',
          'Escalado de impagados',
        ],
      },
      {
        name: 'Módulo 3 — Indicadores',
        lessons: [
          'DSO y plazo medio de cobro',
          'Aging y provisiones',
          'Cuadro de mando del credit manager',
        ],
      },
      { name: 'Módulo 4 — Personas', lessons: ['Coordinación con ventas'] },
    ],
  },
  {
    slug: 'analisis-de-riesgo-de-clientes',
    title: 'Análisis de riesgo de clientes',
    duration: '1h 40min',
    lessons: 8,
    description:
      'Método práctico para analizar el riesgo de crédito comercial: fuentes de información, señales de alarma y decisión sobre límites.',
    learn: [
      'Leer informes comerciales y cuentas anuales',
      'Consultar ficheros de morosidad con criterio',
      'Puntuar clientes con una ficha de riesgo',
      'Revisar límites de forma periódica',
    ],
    modules: [
      {
        name: 'Módulo 1 — Información',
        lessons: [
          'Informes comerciales: qué mirar',
          'Cuentas anuales para no financieros',
          'Ficheros de morosidad',
        ],
      },
      {
        name: 'Módulo 2 — Análisis',
        lessons: [
          'Señales de alarma en el comportamiento de pago',
          'La ficha de evaluación de riesgo',
          'Scoring sencillo de clientes',
        ],
      },
      {
        name: 'Módulo 3 — Decisión',
        lessons: ['Fijar y revisar límites de crédito', 'Clientes que conviene rechazar'],
      },
    ],
  },
  {
    slug: 'marco-legal-de-la-morosidad-comercial',
    title: 'Marco legal de la morosidad comercial',
    duration: '2h 20min',
    lessons: 11,
    description:
      'Lo que todo Credit Manager necesita saber de derecho aplicado al cobro: prescripción, intereses de demora, requerimientos, monitorio y concurso.',
    learn: [
      'Plazos de prescripción y cómo interrumpirlos',
      'Reclamar intereses de demora correctamente',
      'Elegir entre burofax, monitorio y demanda',
      'Actuar cuando el deudor entra en concurso',
    ],
    modules: [
      {
        name: 'Módulo 1 — La deuda y el tiempo',
        lessons: [
          'Prescripción de deudas comerciales',
          'Cómo interrumpir la prescripción',
          'La prueba de la deuda',
        ],
      },
      {
        name: 'Módulo 2 — Reclamar bien',
        lessons: [
          'Intereses de demora (Ley 3/2004)',
          'El requerimiento fehaciente y el burofax',
          'Reclamación extrajudicial efectiva',
        ],
      },
      {
        name: 'Módulo 3 — La vía judicial',
        lessons: [
          'El proceso monitorio paso a paso',
          'Juicio verbal y ordinario',
          'Costas y ejecución',
        ],
      },
      {
        name: 'Módulo 4 — Situaciones especiales',
        lessons: ['El deudor en concurso de acreedores', 'Deudas de administraciones públicas'],
      },
    ],
  },
]

export function getCourse(slug: string): PublicCourse | undefined {
  return courses.find((c) => c.slug === slug)
}

export const knowledgeAreas = [
  {
    l: 'Credit Management',
    img: '/landing/area-credit-management.webp',
    d: 'Fundamentos y organización de la gestión del crédito comercial en la empresa.',
  },
  {
    l: 'Prevención de impagos',
    img: '/landing/area-prevencion.webp',
    d: 'Cómo evaluar clientes y fijar políticas que reduzcan el riesgo antes de vender.',
  },
  {
    l: 'Riesgo de crédito',
    img: '/landing/area-riesgo.webp',
    d: 'Análisis de solvencia, scoring y límites de crédito por cliente.',
  },
  {
    l: 'Recobro de impagados',
    img: '/landing/area-recobro.webp',
    d: 'Estrategias y procedimientos para recuperar deuda vencida.',
  },
  {
    l: 'Negociación',
    img: '/landing/area-negociacion.webp',
    d: 'Técnicas de negociación con deudores para cobrar sin romper la relación.',
  },
  {
    l: 'Legislación',
    img: '/landing/area-legislacion.webp',
    d: 'Marco legal de la morosidad, plazos de pago y vía judicial.',
  },
  {
    l: 'Gestión financiera',
    img: '/landing/area-financiera.webp',
    d: 'Impacto del crédito y la morosidad en la tesorería de la empresa.',
  },
  {
    l: 'Organización del departamento',
    img: '/landing/area-organizacion.webp',
    d: 'Cómo estructurar y dimensionar el área de Credit Management.',
  },
] as const

export const whatsInside = [
  {
    g: '▶',
    l: 'Cursos',
    img: '/landing/formato-cursos.webp',
    k: 'curso',
    d: 'Itinerarios estructurados en módulos y lecciones, de los fundamentos a la práctica.',
  },
  {
    g: '▶',
    l: 'Vídeos',
    img: '/landing/formato-videos.webp',
    k: 'video',
    d: 'Lecciones breves y directas sobre situaciones concretas de crédito y cobro.',
  },
  {
    g: '◑',
    l: 'Podcasts',
    img: '/landing/formato-podcasts.webp',
    k: 'podcast',
    d: 'Conversaciones y análisis en audio para escuchar mientras trabajas o te desplazas.',
  },
  {
    g: '▤',
    l: 'Guías',
    img: '/landing/formato-guias.webp',
    k: 'guia',
    d: 'Documentos de referencia sobre legislación, procedimientos y buenas prácticas.',
  },
  {
    g: '✓',
    l: 'Checklists',
    img: '/landing/formato-checklists.webp',
    k: 'checklist',
    d: 'Listas de verificación rápidas para no olvidar ningún paso crítico.',
  },
  {
    g: '▦',
    l: 'Plantillas',
    img: '/landing/formato-plantillas.webp',
    k: 'plantilla',
    d: 'Modelos editables listos para adaptar a tu empresa en minutos.',
  },
  {
    g: '▣',
    l: 'Casos prácticos',
    img: '/landing/formato-casos.webp',
    k: 'caso',
    d: 'Situaciones reales analizadas paso a paso, con lo que funcionó y lo que no.',
  },
  {
    g: '◉',
    l: 'Webinars',
    img: '/landing/formato-webinars.webp',
    k: 'webinar',
    d: 'Sesiones en directo con Pere Brachfield y turno de preguntas.',
  },
  {
    g: '◈',
    l: 'Actualizaciones',
    img: '/landing/formato-actualizaciones.webp',
    k: 'articulo',
    d: 'Cambios legislativos y de mercado, explicados de forma ejecutiva.',
  },
  {
    g: '▥',
    l: 'Recursos',
    img: '/landing/formato-recursos.webp',
    k: 'plantilla',
    d: 'Calculadoras, scripts y otras herramientas de uso diario.',
  },
] as const

export const personas = [
  'Director/a Financiero',
  'Credit Manager',
  'Responsable de Cobros',
  'Controller',
  'Gerencia de pyme',
  'Abogado/a de reclamación de deuda',
  'Consultor/a financiero',
]

export const sampleTools = [
  {
    l: 'Política de crédito comercial',
    img: '/landing/recurso-politica.webp',
    d: 'Documento marco para fijar condiciones y límites de crédito por tipo de cliente.',
  },
  {
    l: 'Ficha de evaluación de cliente',
    img: '/landing/recurso-ficha.webp',
    d: 'Plantilla para analizar solvencia y riesgo antes de conceder crédito.',
  },
  {
    l: 'Procedimiento interno de cobros',
    img: '/landing/recurso-procedimiento.webp',
    d: 'Protocolo paso a paso para tu equipo desde el primer día de retraso.',
  },
  {
    l: 'Plan de acción frente a la morosidad',
    img: '/landing/recurso-plan.webp',
    d: 'Guía de escalado: del primer recordatorio amistoso a la vía judicial.',
  },
] as const

export const faqs: { q: string; a: string }[] = [
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. La suscripción es mensual y sin permanencia: puedes cancelarla en cualquier momento desde "Mi suscripción" y mantendrás el acceso hasta el final del periodo ya pagado. No hay penalizaciones ni letra pequeña.',
  },
  {
    q: '¿Tengo acceso a todo el contenido desde el primer día?',
    a: 'Sí. La membresía incluye acceso completo desde el primer minuto: todos los cursos, vídeos, podcasts, guías, plantillas, casos prácticos y replays de sesiones anteriores. No hay niveles ni contenido bloqueado.',
  },
  {
    q: '¿Se publican contenidos nuevos con regularidad?',
    a: 'Cada semana se publica contenido nuevo: vídeos cortos, análisis de actualidad o herramientas. Además hay una masterclass mensual en directo y una sesión mensual de "Pregunta a Pere".',
  },
  {
    q: '¿Puedo utilizarlo para formar a mi equipo?',
    a: 'La suscripción es individual. Si quieres formar a varias personas de tu equipo, escríbenos: estamos preparando Brachfield Academy for Teams con licencias múltiples y seguimiento del progreso del equipo.',
  },
  {
    q: '¿Se entregan certificados?',
    a: 'Sí. Al completar un curso o un itinerario formativo obtienes un certificado de finalización descargable en PDF, firmado por Pere Brachfield, con las horas de formación realizadas.',
  },
  {
    q: '¿Puedo descargar los documentos y plantillas?',
    a: 'Sí. Todas las guías, checklists y plantillas se pueden descargar en PDF o DOCX y utilizar directamente en tu empresa. Es uno de los pilares de la membresía.',
  },
  {
    q: '¿Puedo acceder desde el móvil?',
    a: 'Sí. La plataforma funciona en cualquier dispositivo con navegador: ordenador, tablet y móvil. Los vídeos, podcasts y artículos están especialmente optimizados para consumo móvil.',
  },
  {
    q: '¿Hay permanencia mínima?',
    a: 'No. Pagas mes a mes y puedes darte de baja cuando quieras. Creemos que la mejor forma de retenerte es publicar contenido útil, no atarte con un contrato.',
  },
  {
    q: '¿Cómo funcionan las sesiones en directo con Pere?',
    a: 'Cada mes hay al menos dos citas en directo: una masterclass temática y un Q&A abierto ("Pregunta a Pere"). Reservas plaza desde la sección Eventos y recibes recordatorio por email. Si no puedes asistir, el replay queda disponible en la plataforma a las 24 horas.',
  },
]

// Texto "Sobre Pere" redactado por el propio Pere Brachfield (2026-08-16).
export const aboutPere = {
  short:
    'Abogado, profesor universitario, conferenciante y especialista en credit management y gestión de la morosidad, con más de 35 años de experiencia en la prevención de impagos, la gestión del crédito comercial y la recuperación de deudas.',
  long: [
    'Pere Brachfield es abogado, profesor universitario, conferenciante y especialista en credit management y gestión de la morosidad, con más de 35 años de experiencia en la prevención de impagos, la gestión del crédito comercial y la recuperación de deudas.',
    'Fundador de Brachfield Credit & Risk Consultants, ha asesorado y formado a cientos de empresas y profesionales de distintos sectores en la prevención y gestión de los riesgos de crédito, la organización de departamentos de crédito, las estrategias de recobro y la reclamación de deudas, tanto por vía extrajudicial como judicial.',
    'Autor de 32 libros y cientos de artículos sobre gestión del crédito, lucha contra la morosidad y reclamación de deudas, ha desarrollado una amplia labor docente, combinando el conocimiento jurídico con la experiencia práctica de la gestión del crédito empresarial.',
    'En Brachfield Academy ponemos toda esta experiencia al alcance de profesionales y empresas mediante formación práctica, conocimiento especializado y herramientas para prevenir impagos, gestionar el crédito y mejorar la recuperación de las deudas.',
  ],
}

// El ciclo completo del crédito comercial (pedido de Pere: posicionar la
// academia como escuela de todo el ciclo, no como una simple web de cursos).
export const creditProcess = [
  'Concesión del crédito',
  'Prevención',
  'Gestión',
  'Negociación',
  'Recobro',
  'Reclamación judicial',
  'Recuperación de la deuda',
]

export const trainingAreas = [
  'Credit Management',
  'Prevención de impagos',
  'Morosidad',
  'Recobro',
  'Negociación',
  'Reclamación judicial B2B',
]

export const pricingIncludes = [
  'Biblioteca completa de cursos y vídeos',
  'Todas las herramientas y plantillas descargables',
  'Podcasts y guías legales actualizadas',
  'Sesiones mensuales en directo con Pere',
  'Pregunta a Pere ilimitada',
  'Certificados de finalización',
  'Acceso desde cualquier dispositivo',
]
