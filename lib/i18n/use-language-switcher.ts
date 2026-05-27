'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import {
  AppLocale,
  setCachedLocale,
  localeToProfileLang,
} from './locale-resolver'
import { updateProfile } from '@/lib/profile/action'

/**
 * Hook for language switching that:
 * 1. Navigates to the new locale URL (/en/... ↔ /km/...)
 * 2. Saves the choice to localStorage immediately
 * 3. Persists to the backend (profile.preferredLanguage) if accessToken provided
 */
export function useLanguageSwitcher(accessToken?: string) {
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  async function switchLocale(next: AppLocale) {
    if (next === locale) return

    // 1. Cache immediately so UI feels instant
    setCachedLocale(next)

    // 2. Replace locale segment in current path
    const segments = pathname.split('/')
    segments[1] = next
    const newPath = segments.join('/')

    startTransition(() => {
      router.replace(newPath)
    })

    // 3. Persist to backend (fire-and-forget — don't block navigation)
    if (accessToken) {
      try {
        await updateProfile(accessToken, {
          preferredLanguage: localeToProfileLang(next),
        })
      } catch (e) {
        console.warn('[useLanguageSwitcher] Failed to persist language:', e)
      }
    }
  }

  return { locale, switchLocale, isPending }
}
