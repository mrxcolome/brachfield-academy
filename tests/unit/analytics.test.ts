import { afterEach, describe, expect, it, vi } from 'vitest'
import { track } from '@/features/analytics/service'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('AnalyticsService.track', () => {
  it('sin POSTHOG_API_KEY no llama a la red', () => {
    vi.stubEnv('POSTHOG_API_KEY', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    track('search_performed', { userId: 'u1', properties: { query: 'burofax' } })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('con clave envía el evento a PostHog (host UE por defecto)', () => {
    vi.stubEnv('POSTHOG_API_KEY', 'phc_test')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    track('tool_downloaded', { userId: 'u1', properties: { contentSlug: 'checklist' } })

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://eu.i.posthog.com/capture/')
    const body = JSON.parse(String(init.body))
    expect(body.api_key).toBe('phc_test')
    expect(body.event).toBe('tool_downloaded')
    expect(body.distinct_id).toBe('u1')
    expect(body.properties.contentSlug).toBe('checklist')
    expect(body.properties.source).toBe('server')
  })

  it('sin userId usa distinct_id anonymous', () => {
    vi.stubEnv('POSTHOG_API_KEY', 'phc_test')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    track('search_no_results', { userId: null, properties: { query: 'pagarés' } })
    const body = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body))
    expect(body.distinct_id).toBe('anonymous')
  })

  it('un fallo de red nunca lanza', async () => {
    vi.stubEnv('POSTHOG_API_KEY', 'phc_test')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(() => track('user_signed_up', { userId: 'u1' })).not.toThrow()
    // deja que el catch interno se ejecute
    await new Promise((r) => setTimeout(r, 0))
  })
})
