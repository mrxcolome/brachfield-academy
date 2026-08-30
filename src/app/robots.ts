import type { MetadataRoute } from 'next'
import { PRELAUNCH } from '@/lib/prelaunch'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  if (PRELAUNCH) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
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
