'use client'

import { useLanguageSwitcher } from '@/lib/i18n/use-language-switcher'
import type { AppLocale } from '@/lib/i18n/locale-resolver'

type Props = {
  className?: string
  /** Pass accessToken if the user is logged in so the switch saves to DB */
  accessToken?: string
}

const LOCALES: { code: AppLocale; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
]

export function LocaleSwitcher({ className, accessToken }: Props) {
  const { locale, switchLocale, isPending } = useLanguageSwitcher(accessToken)

  return (
    <div
      className={`flex gap-1 ${className ?? ''}`}
      role='group'
      aria-label='Language selection'
    >
      {LOCALES.map(({ code, label, flag }) => (
        <button
          key={code}
          type='button'
          onClick={() => switchLocale(code)}
          disabled={isPending}
          aria-pressed={locale === code}
          aria-label={`Switch to ${code === 'en' ? 'English' : 'Khmer'}`}
          className={`
            flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
            ${
              locale === code
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
            ${isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
          `}
        >
          <span aria-hidden='true'>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
