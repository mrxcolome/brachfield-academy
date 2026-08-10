import type { MetadataRoute } from 'next'
import { courses } from '@/features/content/catalog'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    ...courses.map((c) => ({
      url: `${BASE}/courses/${c.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
