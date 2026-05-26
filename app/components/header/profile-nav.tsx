'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/profile', label: 'My Dashboard', small: 'Dashboard' },
  { href: '/profile/survey', label: 'Quiz Answers', small: 'Quiz' },
  { href: '/profile/settings', label: 'Account Settings', small: 'Account' },
]

export default function ProfileNav() {
  const pathname = usePathname()
  // Strip locale prefix: /en/profile/settings → /profile/settings
  const strippedPath = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '')

  return (
    <nav className='flex gap-0' aria-label='Profile navigation'>
      {TABS.map(tab => {
        const isActive = strippedPath === tab.href

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
            <span className='hidden md:inline'>{tab.label}</span>
            <span className='md:hidden'>{tab.small}</span>

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
