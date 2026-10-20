import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withPayload } from '@payloadcms/next/withPayload'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS: fuerza HTTPS un año, incluidos subdominios (Fase 17 / SECURITY_REVIEW #3)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  async redirects() {
    // El dossier se fundió con «Descubre la Academy» en la documentación interna (21/10/2026)
    return [{ source: '/dossier', destination: '/docs/descubre', permanent: false }]
  },
  // Los HTML de la documentación interna (content/docs) los lee la ruta /docs/[slug] en el
  // servidor: hay que incluirlos en el paquete de Vercel.
  outputFileTracingIncludes: { '/docs/[slug]': ['./content/docs/*.html'] },
}

export default withPayload(withNextIntl(nextConfig))
