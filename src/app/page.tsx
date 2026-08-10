import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Home() {
  const t = useTranslations()
  return (
    <main className="min-h-screen bg-brand-soft">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <Badge>{t('landing.byline')}</Badge>
        <h1 className="text-4xl leading-tight font-bold sm:text-5xl">{t('landing.heroTitle')}</h1>
        <p className="text-ink-2 max-w-xl text-lg leading-relaxed">{t('landing.heroSubtitle')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">{t('common.cta')}</Button>
          <Button size="lg" variant="outline">
            {t('common.explore')}
          </Button>
        </div>
        <p className="font-mono text-sm text-muted">{t('common.price')}</p>
        <p className="text-muted mt-8 max-w-md text-sm">{t('landing.underConstruction')}</p>
      </div>
    </main>
  )
}
