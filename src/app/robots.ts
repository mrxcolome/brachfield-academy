import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Zonas privadas fuera del índice (briefing §42)
      disallow: ['/app/', '/admin/', '/api/', '/checkout', '/verify-email', '/reset-password'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
