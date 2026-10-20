import 'server-only'

// Generación de imágenes con la API de Magnific (Seedream 5.0 Pro). Es asíncrona: se crea una
// tarea y se consulta hasta que termina; la imagen sale en data.generated[]. Necesita
// MAGNIFIC_API_KEY (www.magnific.com → Organización → API keys).

const BASE = 'https://api.magnific.com/v1/ai/text-to-image'
const MODELS = ['seedream-v5-pro', 'seedream-v4-5'] as const
type Model = (typeof MODELS)[number]

export const magnificDisponible = () => Boolean(process.env.MAGNIFIC_API_KEY)

const headers = () => ({
  'Content-Type': 'application/json',
  'x-magnific-api-key': process.env.MAGNIFIC_API_KEY ?? '',
})

/** Crea una tarea de imagen horizontal. Devuelve «modelo:id» para poder consultarla. */
export async function crearTarea(
  prompt: string,
  seed: number,
  models: readonly Model[] = MODELS,
): Promise<string> {
  let lastError = ''
  for (const model of models) {
    const body: Record<string, unknown> = {
      prompt: prompt.slice(0, 4000),
      aspect_ratio: 'widescreen_16_9',
      seed,
    }
    if (model === 'seedream-v5-pro') body.resolution = '2k'
    const res = await fetch(`${BASE}/${model}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    })
    const json = (await res.json().catch(() => null)) as { data?: { task_id?: string } } | null
    if (res.ok && json?.data?.task_id) return `${model}:${json.data.task_id}`
    lastError = `${res.status}`
    // Clave incorrecta o sin saldo: no tiene sentido probar otro modelo.
    if (res.status === 401 || res.status === 402 || res.status === 403) break
  }
  throw new Error(lastError)
}

export type TaskState = {
  task: string
  status: 'pending' | 'done' | 'failed'
  url?: string
  reason?: string
}

export async function consultarTarea(task: string): Promise<TaskState> {
  const [model, id] = task.split(':') as [Model, string]
  if (!MODELS.includes(model) || !/^[\w-]+$/.test(id ?? '')) return { task, status: 'failed' }
  const res = await fetch(`${BASE}/${model}/${id}`, {
    headers: headers(),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  }).catch(() => null)
  if (!res?.ok) return { task, status: 'pending' }
  const json = (await res.json().catch(() => null)) as {
    data?: { status?: string; generated?: string[]; error?: unknown; message?: unknown }
    message?: unknown
  } | null
  const status = json?.data?.status
  const url = json?.data?.generated?.[0]
  if (status === 'COMPLETED' && url) return { task, status: 'done', url }
  if (status === 'FAILED') {
    const why = json?.data?.error ?? json?.data?.message ?? json?.message
    return {
      task,
      status: 'failed',
      reason: why ? (typeof why === 'string' ? why : JSON.stringify(why)).slice(0, 200) : undefined,
    }
  }
  return { task, status: 'pending' }
}

/** Solo se descargan imágenes de los servidores de Magnific/Freepik (nunca una URL cualquiera). */
export function urlPermitida(url: string) {
  try {
    const u = new URL(url)
    return (
      u.protocol === 'https:' &&
      /(^|\.)(magnific\.com|freepik\.com|cdnpk\.net|magnific\.ai)$/i.test(u.hostname)
    )
  } catch {
    return false
  }
}
