import 'server-only'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

const globalForPayload = globalThis as unknown as { payload?: Promise<Payload> }

/** Local API de Payload (singleton). Solo servidor. */
export function cms(): Promise<Payload> {
  globalForPayload.payload ??= getPayload({ config })
  return globalForPayload.payload
}
