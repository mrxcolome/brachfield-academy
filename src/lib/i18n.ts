import { getRequestConfig } from 'next-intl/server'

// Español único en MVP (briefing §49). Añadir locales = ampliar este array
// y crear messages/<locale>.json — la UI no cambia.
export const locales = ['es'] as const
export const defaultLocale = 'es'

export default getRequestConfig(async () => ({
  locale: defaultLocale,
  messages: (await import(`../../messages/${defaultLocale}.json`)).default,
}))
