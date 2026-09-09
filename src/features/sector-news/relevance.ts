// Filtro de relevancia por palabras clave: la red de seguridad cuando no hay
// ANTHROPIC_API_KEY (o la IA falla). Más tosco que la curación con Claude,
// pero garantiza que al tablón solo llega el nicho de la academia.

const KEYWORDS = [
  'morosidad',
  'moroso',
  'impago',
  'impagado',
  'plazo de pago',
  'plazos de pago',
  'concurso de acreedores',
  'concursos de acreedores',
  'recobro',
  'deuda comercial',
  'credito comercial',
  'interes de demora',
  'intereses de demora',
  'insolvencia',
  'solvencia',
  'riesgo de credito',
  'factura',
  'facturacion electronica',
  'crear y crecer',
  'seguro de credito',
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function isRelevantHeadline(title: string): boolean {
  const t = normalize(title)
  return KEYWORDS.some((k) => t.includes(k))
}
