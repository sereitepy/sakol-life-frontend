'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { PersonalityTag } from '../shared/personality-tags'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

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
  const tDash = useTranslations('dashboard_assessment')
  const tTags = useTranslations('personality_tags')
  const pct = hasQuiz ? Math.round((answeredCount / TOTAL_QUESTIONS) * 100) : 0

  return (
    <div className='bg-card rounded-xl border border-white/10 p-6 hover:shadow-md'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h2 className='text-lg font-bold text-on-surface mb-1'>
            {tDash('title')}
          </h2>
          <p className='text-sm text-secondary-foreground'>
            {hasQuiz
              ? tDash('desc_complete')
              : tDash('desc_empty')}
          </p>
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          {/* Localized Personality Tag Chips */}
          {hasQuiz &&
            personalityTags.slice(0, 2).map(tag => {
              // Gracefully map the calculation engine key to the local context string
              const localizedLabel = tTags.has(tag.key) ? tTags(tag.key) : tag.key

              return (
                <span
                  key={tag.key}
                  className={`${tag.color} border border-outline-variant 
                    text-[clamp(9px,0.75vw,11px)] font-bold tracking-widest uppercase rounded-lg px-2 py-0.5`}
                >
                  {localizedLabel}
                </span>
              )
            })}

          {/* Medium screen-only Retake button */}
          <Button
            variant='outline'
            onClick={() => router.push('/quiz')}
            className='items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-on-surface text-xs font-bold hover:bg-white/5 hover:border-primary/30 transition-all md:flex hidden cursor-pointer'
          >
            <RotateCcw size={11} />
            {hasQuiz ? tDash('retake') : tDash('start_quiz')}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className='space-y-2'>
        <div className='flex justify-between text-[11px] font-bold text-on-surface gap-4'>
          <span>{tDash('profile_completion')}</span>
          <span className='text-primary text-end'>
            {tDash('progress_status', {
              answered: answeredCount,
              total: TOTAL_QUESTIONS,
              percent: pct
            })}
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
          className='flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/20 text-on-surface text-xs font-bold hover:bg-white/5 hover:border-primary/30 transition-all md:hidden w-full cursor-pointer'
        >
          <RotateCcw size={11} />
          {hasQuiz ? tDash('retake') : tDash('start_quiz')}
        </Button>
      </div>
    </div>
  )
}