import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'km'],
  defaultLocale: 'en',
  // Prefix every locale including the default
  // so URLs are always /en/... or /km/...
  localePrefix: 'always',
})
