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

  return (
    <nav className='flex gap-0'>
      {TABS.map(tab => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              relative px-2 md:px-3 lg:px-5 text-xs md:text-sm lg:text-md font-semibold transition-colors duration-150 hover:text-primary/80
              ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}
            `}
          >
            <p className='hidden md:flex'>{tab.label}</p>
            <p className='md:hidden'>{tab.small}</p>

            {isActive && (
              <span className='absolute -bottom-4.5 md:-bottom-5 left-0 right-0 h-0.5 bg-primary rounded-full' />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
