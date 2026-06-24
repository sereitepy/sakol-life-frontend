'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

type TabItem = {
  href: string
  labelKey: string
  smallKey: string
}

const TABS: TabItem[] = [
  { href: '/profile', labelKey: 'dashboard', smallKey: 'dashboard_small' },
  { href: '/profile/survey', labelKey: 'quiz_answers', smallKey: 'quiz_small' },
  { href: '/profile/settings', labelKey: 'account_settings', smallKey: 'account_small' },
]

export default function ProfileNav() {
  const pathname = usePathname()
  const tNav = useTranslations('profile_nav')
  
  // Strip locale prefix: /en/profile/settings → /profile/settings
  const strippedPath = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '')

  return (
    <nav className='flex gap-0' aria-label='Profile navigation'>
      {TABS.map(tab => {
        const isActive = strippedPath === tab.href

        // Safely extract the translation variations matching runtime flags
        const fullLabel = tNav.has(tab.labelKey) ? tNav(tab.labelKey) : tab.labelKey
        const smallLabel = tNav.has(tab.smallKey) ? tNav(tab.smallKey) : tab.smallKey

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`
              relative px-2 md:px-3 lg:px-5 py-1
              text-xs md:text-sm font-semibold
              transition-all ease-in-out duration-150
              ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {/* Desktop and Tablet Viewports */}
            <span className='hidden md:inline'>{fullLabel}</span>
            
            {/* Mobile Viewports */}
            <span className='md:hidden'>{smallLabel}</span>

            {/* Active indicator bar */}
            {isActive && (
              <span
                aria-hidden='true'
                className='absolute -bottom-3.5 md:-bottom-4 left-0 right-0 h-0.5 bg-primary rounded-full'
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}