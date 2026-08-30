import type { MetadataRoute } from 'next'
import { courses } from '@/features/content/catalog'
import { PRELAUNCH } from '@/lib/prelaunch'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  if (PRELAUNCH) return []
  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/legal/aviso-legal`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/legal/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/legal/condiciones`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/legal/cookies`, changeFrequency: 'yearly', priority: 0.2 },
    ...courses.map((c) => ({
      url: `${BASE}/courses/${c.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
