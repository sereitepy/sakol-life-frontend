'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { PersonalityTag } from '../shared/personality-tags'
import { Button } from '@/components/ui/button'

type Props = {
  hasQuiz: boolean
  answeredCount: number
  personalityTags: PersonalityTag[]
}

const TOTAL_QUESTIONS = 12

export function AssessmentStatus({
  hasQuiz,
  answeredCount,
  personalityTags,
}: Props) {
  const router = useRouter()
  const pct = hasQuiz ? Math.round((answeredCount / TOTAL_QUESTIONS) * 100) : 0

  return (
    <div className='glass-panel rounded-xl border border-white/10 p-6 hover:shadow-md'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h2 className='text-lg font-bold text-on-surface mb-1'>
            Current Assessment Status
          </h2>
          <p className='text-sm text-secondary-foreground'>
            {hasQuiz
              ? 'Your vocational profiling is complete.'
              : 'No assessment taken yet, start to unlock your profile.'}
          </p>
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          {/* Personality tag chips */}
          {hasQuiz &&
            personalityTags.slice(0, 2).map(tag => (
              <span
                key={tag.label}
                className='bg-surface-container-highest border border-outline-variant 
  text-primary text-[clamp(9px,0.75vw,11px)] font-bold tracking-widest uppercase rounded-lg'
              >
                {tag.label}
              </span>
            ))}

          {/* Medium screen-only Retake button */}
          <Button
            variant='outline'
            onClick={() => router.push('/quiz')}
            className='items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-on-surface text-xs font-bold hover:bg-white/5 hover:border-primary/30 transition-all md:flex hidden'
          >
            <RotateCcw size={11} />
            {hasQuiz ? 'Retake' : 'Start Quiz'}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className='space-y-2'>
        <div className='flex justify-between text-[11px] font-bold text-on-surface'>
          <span>Profile Completion</span>
          <span className='text-primary text-end'>
            {answeredCount} of {TOTAL_QUESTIONS} questions completed ({pct}%)
          </span>
        </div>
        <div className='h-2.5 w-full bg-surface-container rounded-full overflow-hidden'>
          <div
            className='h-full bg-linear-to-r from-primary/80 to-primary rounded-full transition-all duration-700'
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Mobile only retake button */}
      <div className='space-y-2 mt-5'>
        <Button
          variant='outline'
          onClick={() => router.push('/quiz')}
          className='flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-on-surface text-xs font-bold hover:bg-white/5 hover:border-primary/30 transition-all md:hidden w-full'
        >
          <RotateCcw size={11} />
          {hasQuiz ? 'Retake' : 'Start Quiz'}
        </Button>
      </div>
    </div>
  )
}
