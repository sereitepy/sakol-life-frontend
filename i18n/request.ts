import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is the locale segment from the URL
  let locale = await requestLocale

  // Validate — fall back to default if somehow invalid
  if (!locale || !routing.locales.includes(locale as 'en' | 'km')) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
