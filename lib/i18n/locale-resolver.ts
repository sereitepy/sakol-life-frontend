/**
 * Language resolution strategy:
 * - Logged-in users: use profile.preferredLanguage (EN → 'en', KH → 'km')
 *   This is loaded from the DB and also cached in localStorage as 'preferredLocale'
 * - Guests: use URL locale segment (/en/... or /km/...)
 *
 * The localStorage key 'preferredLocale' stores 'en' or 'km' and is written
 * whenever the user changes language so it persists across refreshes before
 * the next server-side profile load.
 */

export type AppLocale = 'en' | 'km'

/** Map backend language enum → next-intl locale */
export function profileLangToLocale(lang: 'EN' | 'KH'): AppLocale {
  return lang === 'KH' ? 'km' : 'en'
}

/** Map next-intl locale → backend language enum */
export function localeToProfileLang(locale: AppLocale): 'EN' | 'KH' {
  return locale === 'km' ? 'KH' : 'EN'
}

/** Read cached locale from localStorage (client-only) */
export function getCachedLocale(): AppLocale | null {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem('preferredLocale')
  return v === 'km' ? 'km' : v === 'en' ? 'en' : null
}

/** Write locale to localStorage (client-only) */
export function setCachedLocale(locale: AppLocale) {
  if (typeof window === 'undefined') return
  localStorage.setItem('preferredLocale', locale)
}
