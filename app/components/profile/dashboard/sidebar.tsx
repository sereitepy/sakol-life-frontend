'use client'

import { useRouter } from 'next/navigation'
import { GraduationCap, Building2, FileText, TrendingUp } from 'lucide-react'

type ShortcutItem = { icon: React.ElementType; label: string; href: string }

const SHORTCUTS: ShortcutItem[] = [
  { icon: GraduationCap, label: 'Explore Majors', href: '/majors' },
  {
    icon: Building2,
    label: 'Universities Match',
    href: '/quiz/results/?tab=universities',
  },
  { icon: FileText, label: 'Scholarship Guide', href: '/scholarships' },
  { icon: TrendingUp, label: 'Survey History', href: '/profile/survey' },
]

export function QuickShortcuts() {
  const router = useRouter()
  return (
    <nav className='flex flex-wrap gap-2'>
      {SHORTCUTS.map(item => {
        const Icon = item.icon
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className='flex items-center gap-2 px-3 py-1.5 rounded-full
              border border-border bg-card/50 hover:bg-card
              text-xs font-medium text-muted-foreground hover:text-foreground
              transition-all duration-200 hover:border-primary/30 whitespace-nowrap'
          >
            <Icon size={13} className='shrink-0' />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
