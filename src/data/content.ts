// Contenido mock de Brachfield Academy.
// Extraído del prototipo de Claude Design (renderVals) — contenido realista, sin Lorem Ipsum.

export interface Course {
  t: string
  lvl: 'Iniciación' | 'Intermedio' | 'Avanzado'
  dur: string
  les: string
}

export const courses: Course[] = [
  { t: 'Cómo recuperar un impagado paso a paso', lvl: 'Intermedio', dur: '2h 35min', les: '12 lecciones' },
  { t: 'Gestión y prevención de impagados', lvl: 'Iniciación', dur: '3h 10min', les: '14 lecciones' },
  { t: 'Negociación avanzada con deudores', lvl: 'Avanzado', dur: '1h 50min', les: '9 lecciones' },
  { t: 'Organización del departamento de Credit Management', lvl: 'Avanzado', dur: '2h 05min', les: '10 lecciones' },
  { t: 'Análisis de riesgo de clientes', lvl: 'Intermedio', dur: '1h 40min', les: '8 lecciones' },
  { t: 'Marco legal de la morosidad comercial', lvl: 'Intermedio', dur: '2h 20min', les: '11 lecciones' },
]

export const videos = [
  { t: 'Cómo responder a “la factura está pendiente de aprobación”', dur: '8 min' },
  { t: 'Cuándo enviar un burofax', dur: '6 min' },
  { t: 'Cómo calcular intereses de demora', dur: '9 min' },
  { t: 'Qué hacer si el cliente pide otro aplazamiento', dur: '7 min' },
  { t: 'Primer contacto con un cliente moroso', dur: '11 min' },
  { t: 'Objeciones habituales en la negociación de cobro', dur: '10 min' },
  { t: 'Errores frecuentes al evaluar un nuevo cliente', dur: '8 min' },
  { t: 'Cuándo dejar de negociar y pasar a vía legal', dur: '9 min' },
]

export const podcasts = [
  { t: 'Ep. 12 · El coste real de la morosidad en las pymes', dur: '34 min' },
  { t: 'Ep. 11 · Entrevista a un Credit Manager de multinacional', dur: '41 min' },
  { t: 'Ep. 10 · Verifactu y facturación electrónica: lo que cambia', dur: '28 min' },
  { t: 'Ep. 9 · Cómo estructurar un departamento de crédito', dur: '37 min' },
]

export const guides = [
  { t: 'Checklist para prevenir impagos antes de vender', fmt: 'CHECKLIST', dur: '5 min' },
  { t: 'Guía: cómo redactar un requerimiento formal', fmt: 'PDF', dur: '12 min' },
  { t: 'Guía: plazos de prescripción de deuda comercial', fmt: 'PDF', dur: '9 min' },
  { t: 'Guía: medios de pago y su nivel de riesgo', fmt: 'PDF', dur: '10 min' },
]

export const tools = {
  comunicacion: ['Email primer recordatorio de pago', 'Email de factura vencida', 'Carta formal de reclamación de deuda', 'Modelo de requerimiento fehaciente'],
  checklists: ['Evaluación de nuevo cliente', 'Prevención de impago antes de vender', 'Proceso de recobro paso a paso', 'Escalado de deuda: cuándo ir a vía judicial'],
  plantillas: ['Política de crédito comercial', 'Ficha de evaluación de cliente', 'Procedimiento interno de cobros', 'Plan de acción frente a la morosidad', 'Acuerdo de aplazamiento de pago'],
  calculadoras: ['Cálculo del DSO', 'Coste financiero del retraso de cobro', 'Intereses de demora', 'Impacto anual de la morosidad'],
  scripts: ['Llamada de reclamación', 'Guion de negociación', 'Respuestas a excusas habituales'],
}

export const paths = [
  { t: 'Fundamentos de Credit Management', lvl: 'Iniciación', prog: 0, total: '5 cursos' },
  { t: 'Especialista en prevención de impagos', lvl: 'Intermedio', prog: 50, total: '4 de 8 módulos' },
  { t: 'Especialista en recobro', lvl: 'Intermedio', prog: 20, total: '6 módulos' },
  { t: 'Negociación avanzada de cobros', lvl: 'Avanzado', prog: 0, total: '5 módulos' },
  { t: 'Director de Credit Management', lvl: 'Avanzado', prog: 0, total: '9 módulos' },
]

export const news = [
  { t: 'Nueva sentencia sobre la prescripción de la acción de reclamación de deuda comercial', tag: 'Legislación' },
  { t: 'Qué propone la nueva directiva europea sobre plazos de pago entre empresas', tag: 'Normativa UE' },
  { t: 'Verifactu: calendario definitivo de obligatoriedad para pymes', tag: 'Facturación' },
  { t: 'La morosidad comercial repunta en el sector servicios durante 2026', tag: 'Estadísticas' },
]

export const events = [
  { t: 'Pregunta a Pere · Q&A mensual', date: '22 septiembre · 17:00', dur: '60 min' },
  { t: 'Masterclass: reclamar una deuda sin deteriorar la relación comercial', date: '18 septiembre · 17:00', dur: '75 min' },
  { t: 'Actualización legal: novedades en reclamación judicial de impagados', date: '14 octubre · 12:00', dur: '45 min' },
]

export const faqs = [
  '¿Puedo cancelar cuando quiera?',
  '¿Tengo acceso a todo el contenido desde el primer día?',
  '¿Se publican contenidos nuevos con regularidad?',
  '¿Puedo utilizarlo para formar a mi equipo?',
  '¿Se entregan certificados?',
  '¿Puedo descargar los documentos y plantillas?',
  '¿Puedo acceder desde el móvil?',
  '¿Hay permanencia mínima?',
  '¿Cómo funcionan las sesiones en directo con Pere?',
]

export const knowledgeAreas = [
  'Credit Management',
  'Prevención de impagos',
  'Riesgo de crédito',
  'Recobro de impagados',
  'Negociación',
  'Legislación',
  'Gestión financiera',
  'Organización del departamento',
]

export const whatsInside = [
  { g: '▶', l: 'Cursos' },
  { g: '▶', l: 'Vídeos' },
  { g: '◑', l: 'Podcasts' },
  { g: '▤', l: 'Guías' },
  { g: '✓', l: 'Checklists' },
  { g: '▦', l: 'Plantillas' },
  { g: '▣', l: 'Casos prácticos' },
  { g: '◉', l: 'Webinars' },
  { g: '◈', l: 'Actualizaciones' },
  { g: '▥', l: 'Recursos' },
]

export const personas = [
  'Director/a Financiero',
  'Credit Manager',
  'Responsable de Cobros',
  'Controller',
  'Gerencia de pyme',
  'Abogado/a de reclamación de deuda',
  'Consultor/a financiero',
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

export const courseModules = [
  { n: 'Módulo 1 — Diagnóstico inicial', items: ['Por qué no paga un cliente', 'Identificación del tipo de moroso', 'Análisis previo de la deuda'] },
  { n: 'Módulo 2 — Primeras acciones', items: ['Primer contacto', 'Email de reclamación', 'Llamada de cobro'] },
  { n: 'Módulo 3 — Negociación', items: ['Técnicas de negociación', 'Objeciones habituales', 'Acuerdos de pago'] },
  { n: 'Módulo 4 — Escalado', items: ['Requerimiento formal', 'Reclamación extrajudicial', 'Cuándo acudir a la vía judicial'] },
]

export const chapters = [
  '00:00 Introducción',
  '02:34 Primer contacto',
  '05:20 Objeciones habituales',
  '09:42 Cómo cerrar un compromiso de pago',
]

export const profileOptions = ['Director/a Financiero', 'Credit Manager', 'Administración / Cobros', 'Controller', 'Gerencia', 'Abogado/a', 'Consultor/a', 'Otro']

export const goalOptions = [
  'Prevenir impagos',
  'Reducir la morosidad',
  'Mejorar el recobro',
  'Gestionar mejor el riesgo de clientes',
  'Organizar el departamento de crédito',
  'Reducir el plazo medio de cobro',
]

export const searchResults = [
  { g: '▤', t: '¿Cuándo prescribe una deuda comercial?', type: 'ARTÍCULO', dur: '4 min' },
  { g: '▶', t: 'Prescripción de deuda: lo que debes saber antes de reclamar', type: 'VÍDEO', dur: '9 min' },
  { g: '◉', t: 'Actualización legal: novedades en reclamación judicial de impagados', type: 'WEBINAR', dur: '45 min' },
  { g: '↓', t: 'Guía: plazos de prescripción de deuda comercial', type: 'PDF', dur: '9 min' },
  { g: '▣', t: 'Caso práctico: deuda de 3 años sin reclamar, ¿aún se puede cobrar?', type: 'CASO PRÁCTICO', dur: '6 min' },
]

export const itineraryItems = [
  { done: true, t: 'Por qué se produce la morosidad comercial', type: 'VÍDEO' },
  { done: true, t: 'Cómo evaluar el riesgo de un cliente nuevo', type: 'CURSO' },
  { done: true, t: 'Checklist: prevención de impago antes de vender', type: 'CHECKLIST' },
  { done: true, t: 'Política de crédito comercial: cómo diseñarla', type: 'CURSO' },
  { done: false, t: 'Medios de pago y su nivel de riesgo', type: 'GUÍA' },
  { done: false, t: 'Cláusulas de reserva de dominio y garantías', type: 'VÍDEO' },
  { done: false, t: 'Caso práctico: cliente con historial de retrasos', type: 'CASO PRÁCTICO' },
  { done: false, t: 'Evaluación final del itinerario', type: 'EVALUACIÓN' },
]

export const casoAnalysis = [
  { n: '1. DIAGNÓSTICO', t: 'Retraso deliberado sin voluntad de impago total: cliente solvente que prioriza su propia tesorería.' },
  { n: '2. RIESGOS', t: 'Seguir sirviendo pedidos aumenta la exposición sin mejorar la posición de cobro.' },
  { n: '3. ACCIONES RECOMENDADAS', t: 'Bloquear nuevos pedidos hasta regularizar y proponer un calendario de pago por escrito.' },
  { n: '4. ERRORES QUE EVITAR', t: 'No amenazar por escrito con acciones que no se ejecutarán; no ceder crédito adicional.' },
  { n: '5. ESTRATEGIA DE NEGOCIACIÓN', t: 'Ofrecer un aplazamiento a cambio de garantías y reducción del límite de crédito futuro.' },
  { n: '6. RESULTADO', t: 'Acuerdo de pago en 3 plazos firmado; relación comercial mantenida bajo nuevas condiciones.' },
]

export const formatLegend = [
  { glyph: '▶', label: 'Vídeo' },
  { glyph: '◑', label: 'Podcast' },
  { glyph: '▤', label: 'Artículo' },
  { glyph: '↓', label: 'PDF' },
  { glyph: '✓', label: 'Checklist' },
  { glyph: '▦', label: 'Plantilla' },
  { glyph: '◉', label: 'Webinar' },
  { glyph: '▣', label: 'Caso práctico' },
]

export const newThisWeek = [
  'Verifactu: calendario definitivo para pymes',
  'Ep. 12 · El coste real de la morosidad',
  'Guía: plazos de prescripción de deuda',
]

export const replays = [
  { t: 'Pregunta a Pere · Agosto', dur: '58 min' },
  { t: 'Masterclass: Verifactu y morosidad', dur: '66 min' },
]

export const user = {
  nombre: 'Javier',
  nombreCompleto: 'Javier Soler',
  cargo: 'Responsable de Cobros',
  empresa: 'Industrias Soler S.L.',
  email: 'javier@industriassoler.com',
}
