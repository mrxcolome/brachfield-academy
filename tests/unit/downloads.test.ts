import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadUrlFor } from '@/features/tools/downloads'
import type { Media } from '@/payload/payload-types'

const media = {
  id: 1,
  filename: 'guia-prescripcion-deuda.pdf',
  url: '/api/media/file/guia-prescripcion-deuda.pdf',
  updatedAt: '',
  createdAt: '',
} as Media

afterEach(() => vi.unstubAllEnvs())

describe('downloadUrlFor', () => {
  it('sin credenciales R2 sirve el fichero vía Payload (desarrollo)', async () => {
    vi.stubEnv('R2_ACCOUNT_ID', '')
    const url = await downloadUrlFor(media)
    expect(url).toBe('/api/media/file/guia-prescripcion-deuda.pdf')
  })

  it('con R2 configurado devuelve una URL firmada con caducidad', async () => {
    vi.stubEnv('R2_ACCOUNT_ID', 'cuenta-test')
    vi.stubEnv('R2_ACCESS_KEY_ID', 'AKIA_TEST')
    vi.stubEnv('R2_SECRET_ACCESS_KEY', 'secreto-test')
    vi.stubEnv('R2_BUCKET', 'bucket-test')

    const url = await downloadUrlFor(media)
    expect(url).toContain('cuenta-test.r2.cloudflarestorage.com')
    expect(url).toContain('bucket-test')
    expect(url).toContain('guia-prescripcion-deuda.pdf')
    expect(url).toContain('X-Amz-Signature=')
    expect(url).toContain('X-Amz-Expires=300')
    // Fuerza descarga con el nombre original
    expect(url).toContain('response-content-disposition=')
  })

  it('sin filename no hay URL', async () => {
    expect(await downloadUrlFor({ ...media, filename: null })).toBeNull()
  })
})
