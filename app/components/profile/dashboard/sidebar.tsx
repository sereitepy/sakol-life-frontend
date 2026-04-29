import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  Building2,
  FileText,
  TrendingUp,
  User,
} from 'lucide-react'
import { ShortcutRow } from '../shared/shortcut-row'

export function QuickShortcuts() {
  const router = useRouter()

  return (
    <div className='bg-card border border-border rounded-2xl p-4 space-y-2'>
      <h3 className='font-bold text-sm text-foreground mb-3'>
        Quick Shortcuts
      </h3>
      <ShortcutRow
        icon={GraduationCap}
        label='Explore Majors'
        onClick={() => router.push('/majors')}
      />
      <ShortcutRow
        icon={Building2}
        label='Universities Match'
        onClick={() => router.push('/quiz/results/?tab=universities')}
      />
      <ShortcutRow
        icon={FileText}
        label='Scholarship Guide'
        onClick={() => router.push('/scholarships')}
      />
      <ShortcutRow
        icon={TrendingUp}
        label='My Survey History'
        onClick={() => router.push('/profile/survey')}
      />
    </div>
  )
}

export function GuidanceCTA() {
  const router = useRouter()

  return (
    <div className='bg-foreground text-background rounded-2xl p-5'>
      <div className='flex items-start gap-2 mb-1'>
        <User
          size={16}
          className='mt-0.5 shrink-0'
          style={{ color: 'oklch(0.65 0.12 145)' }}
        />
        <h3 className='font-bold text-sm leading-snug'>Need Guidance?</h3>
      </div>
      <p className='text-xs opacity-70 leading-relaxed mt-1 mb-4'>
        Book a 15-min call with an education counselor to discuss your results.
      </p>
      <button
        onClick={() => router.push('/counseling')}
        className='w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all cursor-pointer'
      >
        Schedule Free Call
      </button>
    </div>
  )
}
