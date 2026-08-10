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

/* ============================================================
   Contenido editorial completo
   ============================================================ */

export const faqAnswers: Record<string, string> = {
  '¿Puedo cancelar cuando quiera?':
    'Sí. La suscripción es mensual y sin permanencia: puedes cancelarla en cualquier momento desde "Mi suscripción" y mantendrás el acceso hasta el final del periodo ya pagado. No hay penalizaciones ni letra pequeña.',
  '¿Tengo acceso a todo el contenido desde el primer día?':
    'Sí. La membresía incluye acceso completo desde el primer minuto: todos los cursos, vídeos, podcasts, guías, plantillas, casos prácticos y replays de sesiones anteriores. No hay niveles ni contenido bloqueado.',
  '¿Se publican contenidos nuevos con regularidad?':
    'Cada semana se publica contenido nuevo: vídeos cortos, análisis de actualidad o herramientas. Además hay una masterclass mensual en directo y una sesión mensual de "Pregunta a Pere".',
  '¿Puedo utilizarlo para formar a mi equipo?':
    'La suscripción es individual. Si quieres formar a varias personas de tu equipo, escríbenos: estamos preparando Brachfield Academy for Teams con licencias múltiples y seguimiento del progreso del equipo.',
  '¿Se entregan certificados?':
    'Sí. Al completar un curso o un itinerario formativo obtienes un certificado de finalización descargable en PDF, firmado por Pere Brachfield, con las horas de formación realizadas.',
  '¿Puedo descargar los documentos y plantillas?':
    'Sí. Todas las guías, checklists y plantillas se pueden descargar en PDF o DOCX y utilizar directamente en tu empresa. Es uno de los pilares de la membresía.',
  '¿Puedo acceder desde el móvil?':
    'Sí. La plataforma funciona en cualquier dispositivo con navegador: ordenador, tablet y móvil. Los vídeos, podcasts y artículos están especialmente optimizados para consumo móvil.',
  '¿Hay permanencia mínima?':
    'No. Pagas mes a mes y puedes darte de baja cuando quieras. Creemos que la mejor forma de retenerte es publicar contenido útil, no atarte con un contrato.',
  '¿Cómo funcionan las sesiones en directo con Pere?':
    'Cada mes hay al menos dos citas en directo: una masterclass temática y un Q&A abierto ("Pregunta a Pere"). Reservas plaza desde la sección Eventos y recibes recordatorio por email. Si no puedes asistir, el replay queda disponible en la plataforma a las 24 horas.',
}

export interface CourseDetail {
  desc: string
  learn: string[]
}

export const courseDetails: Record<string, CourseDetail> = {
  'Cómo recuperar un impagado paso a paso': {
    desc: 'Un recorrido completo, con casos reales, desde el diagnóstico inicial hasta la vía judicial: cómo reaccionar cuando un cliente deja de pagar y qué hacer en cada fase del proceso de recobro.',
    learn: ['Diagnosticar por qué un cliente no paga', 'Escribir reclamaciones efectivas', 'Negociar acuerdos de pago realistas', 'Saber cuándo escalar a vía judicial'],
  },
  'Gestión y prevención de impagados': {
    desc: 'El curso de base: cómo montar un sistema de prevención que reduzca la morosidad antes de que aparezca, desde la evaluación del cliente hasta las condiciones de venta.',
    learn: ['Evaluar la solvencia de un cliente nuevo', 'Fijar límites de crédito prudentes', 'Redactar condiciones de pago que protejan', 'Detectar señales tempranas de impago'],
  },
  'Negociación avanzada con deudores': {
    desc: 'Técnicas de negociación aplicadas al cobro: psicología del deudor, manejo de objeciones y cierre de acuerdos de pago que se cumplen.',
    learn: ['Preparar una negociación de cobro', 'Responder a las excusas más habituales', 'Diseñar acuerdos con garantías', 'Mantener la relación comercial mientras cobras'],
  },
  'Organización del departamento de Credit Management': {
    desc: 'Cómo estructurar la función de crédito en tu empresa: procesos, roles, indicadores y coordinación con ventas y finanzas.',
    learn: ['Definir la política de crédito de la empresa', 'Organizar el flujo de trabajo de cobros', 'Medir con los KPIs correctos (DSO, aging, morosidad)', 'Alinear ventas y crédito sin fricciones'],
  },
  'Análisis de riesgo de clientes': {
    desc: 'Método práctico para analizar el riesgo de crédito comercial: fuentes de información, señales de alarma y decisión sobre límites.',
    learn: ['Leer informes comerciales y cuentas anuales', 'Consultar ficheros de morosidad con criterio', 'Puntuar clientes con una ficha de riesgo', 'Revisar límites de forma periódica'],
  },
  'Marco legal de la morosidad comercial': {
    desc: 'Lo que todo Credit Manager necesita saber de derecho aplicado al cobro: prescripción, intereses de demora, requerimientos, monitorio y concurso.',
    learn: ['Plazos de prescripción y cómo interrumpirlos', 'Reclamar intereses de demora correctamente', 'Elegir entre burofax, monitorio y demanda', 'Actuar cuando el deudor entra en concurso'],
  },
}

export const videoDescs: Record<string, string> = {
  'Cómo responder a “la factura está pendiente de aprobación”':
    'Es la excusa más repetida en los departamentos de cobro. Aprende a desmontarla con tres preguntas concretas que obligan al cliente a comprometerse con una fecha.',
  'Cuándo enviar un burofax':
    'El burofax certifica fecha y contenido del envío. Te explico cuándo merece la pena, cuánto cuesta, qué debe decir exactamente y qué efectos tiene sobre la prescripción.',
  'Cómo calcular intereses de demora':
    'Tipo legal, tipo pactado y la Ley 3/2004: cómo calcular los intereses que puedes reclamar, con ejemplos numéricos reales.',
  'Qué hacer si el cliente pide otro aplazamiento':
    'El segundo aplazamiento es una señal de alarma. Criterios para decidir si aceptar, qué contrapartidas pedir y cuándo decir que no.',
  'Primer contacto con un cliente moroso':
    'Los primeros 15 días marcan la probabilidad de cobro. Guion de la primera llamada: tono, preguntas y errores que cierran puertas.',
  'Objeciones habituales en la negociación de cobro':
    'Las 8 objeciones que escucharás siempre y una respuesta profesional para cada una, del "no me ha llegado la factura" al "ahora no puedo pagar".',
  'Errores frecuentes al evaluar un nuevo cliente':
    'Los 6 errores que más impagados generan: fiarse del tamaño, no verificar poderes, ignorar el sector… y cómo evitarlos con una ficha de alta.',
  'Cuándo dejar de negociar y pasar a vía legal':
    'Negociar tiene un límite. Señales objetivas de que la negociación está agotada y cómo preparar el salto a la reclamación judicial sin perder tiempo ni pruebas.',
}

export const podcastNotes: Record<string, string> = {
  'Ep. 12 · El coste real de la morosidad en las pymes':
    'Un impagado no es solo la factura perdida: es margen, financiación y tiempo de gestión. Calculamos el coste completo con cifras y vemos cuántas ventas nuevas hacen falta para compensar un solo impagado.',
  'Ep. 11 · Entrevista a un Credit Manager de multinacional':
    'Conversación con un responsable de crédito con 20 años de experiencia: cómo organiza su equipo, qué indicadores mira cada lunes y qué le pide exactamente a ventas.',
  'Ep. 10 · Verifactu y facturación electrónica: lo que cambia':
    'Qué es Verifactu, a quién obliga, en qué fechas y qué impacto tiene en la gestión de cobros y en la prueba de la deuda.',
  'Ep. 9 · Cómo estructurar un departamento de crédito':
    'De la pyme donde "cobra el administrativo" al departamento profesional: fases, roles y procesos mínimos para que el cobro no dependa de una sola persona.',
}

export interface NewsArticle {
  changed: string
  affects: string
  action: string
  date: string
  read: string
}

export const newsArticles: Record<string, NewsArticle> = {
  'Nueva sentencia sobre la prescripción de la acción de reclamación de deuda comercial': {
    date: '8 agosto 2026', read: '3 min',
    changed: 'El Tribunal Supremo ha precisado cuándo se interrumpe la prescripción por reclamación extrajudicial: la carga de probar la recepción del requerimiento recae en el acreedor, y un email sin acuse puede no bastar.',
    affects: 'Si reclamas deudas antiguas por email ordinario, corres el riesgo de que el deudor alegue prescripción y la reclamación quede sin efecto.',
    action: 'Para deudas próximas a prescribir, envía siempre burofax con certificación de texto y acuse de recibo, y guarda el justificante junto al expediente del cliente.',
  },
  'Qué propone la nueva directiva europea sobre plazos de pago entre empresas': {
    date: '5 agosto 2026', read: '4 min',
    changed: 'La propuesta de reglamento europeo endurece los plazos máximos de pago B2B hacia un tope general con menos excepciones sectoriales, e introduce indemnizaciones automáticas más altas por recobro.',
    affects: 'Si tu empresa cobra a más de 60 días o vende a grandes cuentas que imponen plazos largos, el nuevo marco te dará más palancas de negociación… y también más obligaciones como pagador.',
    action: 'Revisa tus plazos medios de cobro y pago por cliente y proveedor, y prepara cláusulas contractuales alineadas con los nuevos topes para no tener que renegociar con prisas.',
  },
  'Verifactu: calendario definitivo de obligatoriedad para pymes': {
    date: '1 agosto 2026', read: '3 min',
    changed: 'Se ha confirmado el calendario de obligatoriedad de los sistemas de facturación verificable: primero sociedades, después autónomos, con fechas ya cerradas.',
    affects: 'Los registros de facturación inalterables refuerzan la prueba de la deuda en reclamaciones, pero exigen adaptar tu software de facturación antes de la fecha límite.',
    action: 'Confirma con tu proveedor de software que estará certificado a tiempo y aprovecha el cambio para ordenar la numeración y el archivo de facturas: son tu prueba principal en un impagado.',
  },
  'La morosidad comercial repunta en el sector servicios durante 2026': {
    date: '28 julio 2026', read: '2 min',
    changed: 'Los últimos datos sectoriales muestran un repunte de los plazos de cobro y de la ratio de impagados en servicios, mientras industria se mantiene estable.',
    affects: 'Si vendes a empresas de servicios, la probabilidad de retraso ha aumentado: los límites de crédito que fijaste hace un año pueden estar desactualizados.',
    action: 'Relanza la revisión de límites de tus 20 mayores clientes de servicios y vigila las señales tempranas: pedidos que crecen con pagos que se alargan.',
  },
}

export interface ToolDoc {
  desc: string
  body: string[]
  formato: string
}

export const toolDocs: Record<string, ToolDoc> = {
  'Email primer recordatorio de pago': {
    formato: 'DOCX · editable', desc: 'Recordatorio amistoso para enviar 3–5 días después del vencimiento. Mantiene la relación comercial mientras deja constancia escrita.',
    body: [
      'Asunto: Recordatorio de factura {nº factura} — {tu empresa}',
      'Estimado/a {nombre}:',
      'Le escribo en relación con la factura {nº factura}, con vencimiento el {fecha}, por importe de {importe} €, de la que a día de hoy no nos consta el pago.',
      'Entendemos que puede tratarse de un descuido o de un cruce administrativo. Le agradeceríamos que nos confirmara la fecha prevista de pago o, si ya lo ha realizado, nos remitiera el justificante.',
      'Quedamos a su disposición para cualquier aclaración sobre la factura o la forma de pago.',
      'Un cordial saludo,',
      '{nombre y cargo} · {empresa} · {teléfono}',
    ],
  },
  'Email de factura vencida': {
    formato: 'DOCX · editable', desc: 'Segunda comunicación, a los 15–20 días del vencimiento: tono firme, fecha concreta y consecuencias profesionales.',
    body: [
      'Asunto: Factura {nº factura} vencida — solicitud de fecha de pago',
      'Estimado/a {nombre}:',
      'Pese a nuestro recordatorio del {fecha del primer email}, la factura {nº factura}, vencida el {fecha}, por {importe} €, continúa pendiente de pago.',
      'Necesitamos que nos indique, antes del {fecha límite, 5 días}, la fecha concreta en la que realizarán la transferencia.',
      'Si existe alguna incidencia con la factura o con el pedido, indíquenoslo en esa misma respuesta para poder resolverla de inmediato; de lo contrario, entenderemos que la deuda no es discutida.',
      'Le recordamos que el retraso devenga intereses de demora conforme a la Ley 3/2004 y que, de no recibir respuesta, nos veremos obligados a suspender nuevos suministros hasta regularizar la situación.',
      'Atentamente,',
      '{nombre y cargo} · {empresa} · {teléfono}',
    ],
  },
  'Carta formal de reclamación de deuda': {
    formato: 'DOCX · editable', desc: 'Reclamación formal en papel de empresa, previa al requerimiento fehaciente. Resume la deuda completa y fija un plazo final.',
    body: [
      '{Ciudad}, {fecha}',
      'Muy señores nuestros:',
      'Por medio de la presente les reclamamos formalmente el pago de las facturas relacionadas a continuación, todas ellas vencidas y exigibles: {tabla: nº factura · fecha · vencimiento · importe}.',
      'El importe total adeudado asciende a {importe total} €, sin perjuicio de los intereses de demora devengados conforme a la Ley 3/2004, de 29 de diciembre.',
      'Les requerimos para que procedan al pago íntegro en el plazo máximo de DIEZ DÍAS naturales desde la recepción de esta carta, en la cuenta {IBAN}.',
      'Transcurrido dicho plazo sin que el pago se haya hecho efectivo, esta empresa iniciará las acciones extrajudiciales y judiciales que en derecho procedan, con los gastos y costas que de ello se deriven.',
      'Atentamente,',
      '{firma} · {nombre y cargo} · {empresa}',
    ],
  },
  'Modelo de requerimiento fehaciente': {
    formato: 'DOCX · para burofax', desc: 'Texto listo para enviar por burofax con certificación de contenido. Interrumpe la prescripción y prepara la vía judicial.',
    body: [
      'REQUERIMIENTO FEHACIENTE DE PAGO',
      'En {ciudad}, a {fecha}.',
      '{Empresa acreedora}, con CIF {CIF} y domicilio en {domicilio}, REQUIERE formalmente a {empresa deudora}, con CIF {CIF}, el pago de la cantidad de {importe} €, correspondiente a las facturas {relación de facturas}, vencidas y exigibles.',
      'La presente comunicación interrumpe la prescripción de la acción de reclamación conforme al artículo 1973 del Código Civil.',
      'De no recibirse el pago íntegro en el plazo de DIEZ DÍAS naturales, se iniciará sin más aviso el procedimiento judicial oportuno, solicitando además los intereses de demora de la Ley 3/2004 y las costas procesales.',
      'El pago deberá efectuarse en la cuenta {IBAN}, indicando como concepto {referencia}.',
      '{Firma del representante legal}',
    ],
  },
}

export const documentoChecklist = {
  title: 'Checklist para prevenir impagos antes de vender',
  fmt: 'CHECKLIST', dur: '5 minutos', formato: 'PDF · 2 páginas',
  resumen: 'Once puntos de control para evaluar el riesgo de un cliente nuevo antes de concederle una línea de crédito comercial.',
  cuando: 'Antes de dar de alta a un cliente nuevo o de ampliar el límite de crédito a uno existente.',
  items: [
    'Verificar datos registrales y solvencia',
    'Consultar ficheros de morosidad (ASNEF-Empresas, RAI)',
    'Solicitar referencias comerciales a otros proveedores',
    'Comprobar poderes de quien firma el pedido',
    'Analizar cuentas anuales depositadas',
    'Fijar un límite de crédito inicial prudente',
    'Definir condiciones de pago por escrito',
    'Pactar medio de pago seguro (confirming, recibo domiciliado)',
    'Incluir cláusula de reserva de dominio si procede',
    'Establecer revisión del límite a los 6 meses',
    'Registrar todo en la ficha del cliente',
  ],
}

export const eventDescs: Record<string, string> = {
  'Pregunta a Pere · Q&A mensual':
    'Sesión abierta de preguntas y respuestas: Pere responde en directo a las dudas enviadas por los miembros durante el mes. Sin guion, con casos reales de los asistentes.',
  'Masterclass: reclamar una deuda sin deteriorar la relación comercial':
    'Pere Brachfield analizará estrategias de reclamación que priorizan mantener al cliente, con casos reales y turno de preguntas en directo.',
  'Actualización legal: novedades en reclamación judicial de impagados':
    'Repaso ejecutivo de las novedades del trimestre en reclamación judicial: monitorio, costas, intereses y jurisprudencia reciente que afecta al cobro.',
}

export const aboutPere = {
  short: 'Abogado, socio fundador de Brachfield Credit & Risk Consultants, profesor universitario y articulista. Más de 30 años asesorando a empresas en gestión del crédito, prevención de impagos y recobro de deuda comercial.',
  long: 'Pere Brachfield es uno de los mayores especialistas en morosología de España. Abogado y socio fundador de Brachfield Credit & Risk Consultants, ha dedicado más de tres décadas a la gestión del crédito comercial, la prevención de impagos y el recobro de deudas. Es profesor universitario, conferenciante y autor de numerosos libros y artículos sobre credit management, y ha asesorado a cientos de empresas de todos los sectores en la organización de sus departamentos de crédito.',
}

export const lessonContent = {
  title: 'Primer contacto',
  num: 'LECCIÓN 5 DE 12',
  transcript: 'El primer contacto con un cliente que ha dejado de pagar es determinante. Un tono profesional pero firme, sin acusar, abre la puerta a una negociación posterior sin cerrar la relación comercial. En esta lección veremos cómo preparar esa primera llamada: qué información reunir antes de descolgar el teléfono, cómo estructurar la conversación en tres fases —verificación, escucha y compromiso— y qué frases concretas funcionan para conseguir una fecha de pago sin generar confrontación. El objetivo no es ganar la discusión: es cobrar y conservar al cliente.',
  keyPoints: [
    'Reúne el expediente completo antes de llamar: facturas, pedidos, albaranes firmados y comunicaciones previas.',
    'Empieza verificando, no acusando: "¿Nos consta correctamente la factura?" abre; "ustedes nos deben" cierra.',
    'Escucha la versión del cliente completa antes de proponer nada: la causa real del impago define la estrategia.',
    'Cierra siempre con un compromiso concreto: importe, fecha y medio de pago, confirmado por email tras la llamada.',
  ],
}
