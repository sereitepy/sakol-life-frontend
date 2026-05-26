'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getMajorIcon } from '../shared/major-icons'
import { ProfileResponse } from '@/lib/profile/action'

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
      className={`group relative text-left rounded-xl overflow-hidden glass-panel
        h-[clamp(110px,18vw,150px)]
        border transition-all duration-300 hover:scale-[1.02] cursor-pointer w-full
        ${isChosen ? 'border-primary/50' : 'border-border'}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${overlayClass} mix-blend-overlay transition-opacity group-hover:opacity-80`}
      />

      <div
        className='absolute top-3 right-3 bg-card/80 backdrop-blur-md
        px-2.5 py-1 rounded-full border border-border text-foreground font-bold text-[clamp(9px,0.75vw,11px)]'
      >
        {percentage}% Match
      </div>

      {isChosen && (
        <div
          className='absolute bottom-3 right-3 sm:bottom-auto sm:right-auto sm:top-3 sm:left-3
          bg-primary/30 text-primary-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full'
        >
          ✓ Chosen
        </div>
      )}

      <div className='absolute inset-0 p-4 flex flex-col justify-end'>
        <Icon
          size={undefined}
          className='text-foreground/80 mb-2 text-[clamp(18px,2vw,26px)]'
        />
        <h4 className='text-[clamp(11px,1vw,14px)] font-bold text-foreground leading-tight'>
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
    <div className='bg-card rounded-xl border border-border p-[clamp(14px,2vw,24px)]'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-base font-bold text-foreground'>
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
          <p className='text-sm text-muted-foreground mb-4'>
            Your results are saved — view them below.
          </p>
          <button
            onClick={() => router.push('/quiz/results')}
            className='px-5 py-2.5 border border-border text-foreground text-sm font-bold rounded-lg hover:bg-muted transition-all'
          >
            View Results
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-2xl mb-3'>🎯</p>
          <p className='text-sm text-muted-foreground mb-4'>
            Take the quiz to get personalised major recommendations.
          </p>
          <button
            onClick={() => router.push('/quiz')}
            className='px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg transition-all active:scale-95'
          >
            Start Assessment
          </button>
        </div>
      )}
    </div>
  )
}
