'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getMajorIcon } from '../shared/major-icons'
import { ProfileResponse } from '@/lib/profile/action'
import { Button } from '@/components/ui/button'

type Recommendation = {
  code: string
  nameEn: string
  similarityPercentage: number
  majorId: string
}

const CARD_OVERLAYS = [
  'from-indigo-500/30 to-indigo-500/10 dark:from-indigo-900/60 dark:to-indigo-900/20',
  'from-emerald-500/30 to-emerald-500/10 dark:from-emerald-900/60 dark:to-emerald-900/20',
  'from-violet-500/30 to-violet-500/10 dark:from-violet-900/60 dark:to-violet-900/20',
]

function RecommendationCard({
  code,
  nameEn,
  percentage,
  isChosen,
  overlayClass,
  onClick,
}: {
  code: string
  nameEn: string
  percentage: number
  isChosen: boolean
  overlayClass: string
  onClick: () => void
}) {
  const { Icon } = getMajorIcon(code)

  return (
    <button
      onClick={onClick}
      className={`group relative text-left rounded-xl overflow-hidden bg-card
  h-[clamp(110px,18vw,150px)]
  border transition-all duration-300 hover:scale-[1.02] cursor-pointer w-full
  ${isChosen ? 'border-primary/50' : 'border-border'}`}
    >
      {/* Colour overlay */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${overlayClass} mix-blend-overlay transition-opacity group-hover:opacity-80`}
      />

      {/* Match % pill */}
      <div
        className='absolute top-4 right-4 bg-card backdrop-blur-md 
  px-3 py-1 rounded-full border border-white/10 text-on-surface font-bold text-[clamp(9px,0.75vw,11px)]'
      >
        {percentage}% Match
      </div>

      {/* Chosen badge */}
      {isChosen && (
        <div
          className='absolute bottom-4 right-4 sm:bottom-auto sm:right-auto sm:top-4 sm:left-4 
    bg-primary/30 text-on-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full'
        >
          ✓ Chosen
        </div>
      )}

      {/* Content pinned to bottom */}
      <div className='absolute inset-0 p-5 flex flex-col justify-end'>
        <Icon
          size={undefined}
          className='text-on-surface/80 mb-3 text-[clamp(22px,2.5vw,32px)]'
        />
        <h4 className='text-[clamp(12px,1vw,15px)] font-bold text-on-surface mb-1 leading-tight'>
          {nameEn}
        </h4>
      </div>
    </button>
  )
}

type Props = {
  recommendations: Recommendation[]
  selectedMajor: ProfileResponse['selectedMajor']
  hasQuiz: boolean
}

export function RecommendationsPanel({
  recommendations,
  selectedMajor,
  hasQuiz,
}: Props) {
  const router = useRouter()

  return (
    <div className='bg-card rounded-xl border border-white/10 p-6'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-lg font-bold text-on-surface'>
          My Recommendations
        </h2>
        {hasQuiz && (
          <button
            onClick={() => router.push('/quiz/results')}
            className='flex items-center gap-1 text-sm font-semibold text-primary hover:underline transition-all'
          >
            View All <ArrowRight size={14} />
          </button>
        )}
      </div>

      {recommendations.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          {recommendations.map((r, i) => (
            <RecommendationCard
              key={r.majorId}
              code={r.code}
              nameEn={r.nameEn}
              percentage={r.similarityPercentage}
              isChosen={selectedMajor?.majorId === r.majorId}
              overlayClass={CARD_OVERLAYS[i] ?? CARD_OVERLAYS[0]}
              onClick={() => router.push(`/majors/${r.majorId}`)}
            />
          ))}
        </div>
      ) : hasQuiz ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-2xl mb-3'>📊</p>
          <p className='text-sm text-on-surface-variant mb-4'>
            Your results are saved, view them below.
          </p>
          <Button
            variant='outline'
            onClick={() => router.push('/quiz/results')}
            className='px-5 py-2.5 border border-white/20 text-on-surface text-sm font-bold rounded-lg hover:bg-white/5 transition-all'
          >
            View Results
          </Button>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-2xl mb-3'>🎯</p>
          <p className='text-sm text-on-surface-variant mb-4'>
            Take the quiz to get personalised major recommendations.
          </p>
          <Button
            variant='outline'
            onClick={() => router.push('/quiz')}
            className='px-6 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-lg hover:shadow-[0_0_16px_#00e67680] transition-all active:scale-95'
          >
            Start Assessment
          </Button>
        </div>
      )}
    </div>
  )
}
