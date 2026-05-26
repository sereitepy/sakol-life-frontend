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
    <div className='bg-card rounded-xl border border-border p-[clamp(14px,2vw,24px)]'>
      <div className='flex flex-col gap-4 mb-6'>
        <div>
          <h2 className='text-base font-bold text-foreground mb-1'>
            Current Assessment Status
          </h2>
          <p className='text-sm text-muted-foreground'>
            {hasQuiz
              ? 'Your vocational profiling is complete.'
              : 'No assessment taken yet, start to unlock your profile.'}
          </p>
        </div>
        <div className='flex items-center gap-2 flex-wrap'>
          {hasQuiz &&
            personalityTags.slice(0, 2).map(tag => (
              <span
                key={tag.label}
                className='px-3 py-1 bg-muted border border-border
                text-primary text-[10px] font-bold tracking-widest uppercase rounded-lg'
              >
                {tag.label}
              </span>
            ))}
          <Button
            variant='outline'
            onClick={() => router.push('/quiz')}
            className='flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold ml-auto'
          >
            <RotateCcw size={11} />
            {hasQuiz ? 'Retake' : 'Start Quiz'}
          </Button>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between text-[11px] font-bold text-foreground'>
          <span>Profile Completion</span>
          <span className='text-primary'>
            {answeredCount} of {TOTAL_QUESTIONS} questions completed ({pct}%)
          </span>
        </div>
        <div className='h-2.5 w-full bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700'
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
