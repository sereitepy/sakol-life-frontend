'use client'

import { useRouter } from 'next/navigation'
import { GraduationCap, Building2, FileText, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

type ShortcutItem = { 
  icon: React.ElementType
  labelKey: string // Changed from static label to translation lookup key
  href: string 
}

const SHORTCUTS: ShortcutItem[] = [
  { 
    icon: GraduationCap, 
    labelKey: 'explore_majors', 
    href: '/majors' 
  },
  {
    icon: Building2,
    labelKey: 'universities_match',
    href: '/quiz/results/?tab=universities',
  },
  { 
    icon: FileText, 
    labelKey: 'scholarship_guide', 
    href: '/scholarships' 
  },
  { 
    icon: TrendingUp, 
    labelKey: 'survey_history', 
    href: '/profile/survey' 
  },
]

export function QuickShortcuts() {
  const router = useRouter()
  const tShortcuts = useTranslations('dashboard_shortcuts')

  return (
    <nav className='flex flex-wrap gap-2'>
      {SHORTCUTS.map(item => {
        const Icon = item.icon
        // Gracefully look up translation string; fallback to lookups key string on error
        const label = tShortcuts.has(item.labelKey) 
          ? tShortcuts(item.labelKey) 
          : item.labelKey

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className='flex items-center gap-2 px-3 py-1.5 rounded-full
              border border-border bg-card/50 hover:bg-card
              text-xs font-medium text-muted-foreground hover:text-foreground
              transition-all duration-200 hover:border-primary/30 whitespace-nowrap cursor-pointer'
          >
            <Icon size={13} className='shrink-0' />
            {label}
          </button>
        )
      })}
    </nav>
  )
}