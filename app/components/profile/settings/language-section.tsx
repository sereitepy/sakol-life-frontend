'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import {
  setCachedLocale,
  localeToProfileLang,
  profileLangToLocale,
  type AppLocale,
} from '@/lib/i18n/locale-resolver'
import { updateProfile } from '@/lib/profile/action'

type Props = {
  preferredLanguage: 'EN' | 'KH'
  accessToken: string
}

const LANGUAGES: {
  code: AppLocale
  nameEn: string
  nameNative: string
  flag: string
}[] = [
  { code: 'en', nameEn: 'English', nameNative: 'English', flag: '🇬🇧' },
  { code: 'km', nameEn: 'Khmer', nameNative: 'ខ្មែរ', flag: '🇰🇭' },
]

export function LanguageSection({ preferredLanguage, accessToken }: Props) {
  const t = useTranslations('profile.settings')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [activeLocale, setActiveLocale] = useState<AppLocale>(
    profileLangToLocale(preferredLanguage)
  )

  async function switchLanguage(locale: AppLocale) {
    if (locale === activeLocale || isPending) return

    // 1. Update local state immediately
    setActiveLocale(locale)

    // 2. Cache in localStorage
    setCachedLocale(locale)

    // 3. Navigate to new locale URL
    const segments = pathname.split('/')
    segments[1] = locale
    startTransition(() => router.replace(segments.join('/')))

    // 4. Persist to DB (fire-and-forget)
    try {
      await updateProfile(accessToken, {
        preferredLanguage: localeToProfileLang(locale),
      })
    } catch (e) {
      console.warn('[LanguageSection] Failed to persist:', e)
    }
  }

  return (
    <div className='bg-card border border-border rounded-2xl overflow-hidden'>
      <div className='px-6 pt-5 pb-4 border-b border-border'>
        <h2 className='text-sm font-bold text-foreground'>
          {t('sectionLanguage')}
        </h2>
        <p className='text-xs text-muted-foreground mt-1'>
          {t('sectionLanguageDesc')}
        </p>
      </div>

      {LANGUAGES.map(({ code, nameEn, nameNative, flag }, i) => {
        const isActive = activeLocale === code
        return (
          <button
            key={code}
            type='button'
            disabled={isPending}
            onClick={() => switchLanguage(code)}
            className={`w-full flex items-center justify-between px-6 py-4 transition-colors text-left
              ${i > 0 ? 'border-t border-border' : ''}
              ${isActive ? 'bg-primary/5' : 'hover:bg-muted/40'}
              ${isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer'}
            `}
          >
            <div className='flex items-center gap-3'>
              <span className='text-lg'>{flag}</span>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  {nameNative}
                </p>
                <p className='text-xs text-muted-foreground'>{nameEn}</p>
              </div>
            </div>
            {isActive && (
              <span className='w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0'>
                <Check size={11} className='text-primary-foreground' />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
