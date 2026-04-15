import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMajorIcon } from '../shared/major-icons'
import { ProfileResponse } from '@/lib/profile/action'

type Recommendation = {
  code: string
  nameEn: string
  similarityPercentage: number
  majorId: string
}

function RecommendationCard({
  code,
  nameEn,
  percentage,
  isChosen,
  onClick,
}: {
  code: string
  nameEn: string
  percentage: number
  isChosen: boolean
  onClick: () => void
}) {
  const { Icon, gradient } = getMajorIcon(code)
  return (
    <button
      onClick={onClick}
      className={`
        group text-left bg-card border rounded-2xl overflow-hidden transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 cursor-pointer w-full
        ${isChosen ? 'border-primary ring-1 ring-primary/30' : 'border-border'}
      `}
    >
      <div
        className={`h-28 bg-linear-to-br ${gradient} flex items-center justify-center`}
      >
        <Icon size={32} className='text-white/90' />
      </div>
      <div className='p-3.5'>
        <p className='font-bold text-sm text-foreground leading-snug'>
          {nameEn}
        </p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          {percentage}% Match
        </p>
        {isChosen && (
          <Badge className='mt-2 text-[10px] bg-primary/10 text-primary border-primary/20 rounded-full px-2 py-0'>
            ✓ Chosen
          </Badge>
        )}
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
    <div className='bg-card border border-border rounded-2xl p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='font-bold text-base text-foreground'>
          My Recommendations
        </h2>
        {hasQuiz && (
          <button
            onClick={() => router.push('/quiz/results')}
            className='text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer'
          >
            View All <ChevronRight size={12} />
          </button>
        )}
      </div>

      {recommendations.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          {recommendations.map(r => (
            <RecommendationCard
              key={r.majorId}
              code={r.code}
              nameEn={r.nameEn}
              percentage={r.similarityPercentage}
              isChosen={selectedMajor?.majorId === r.majorId}
              onClick={() => router.push(`/majors/${r.majorId}`)}
            />
          ))}
        </div>
      ) : hasQuiz ? (
        <div className='flex flex-col items-center justify-center py-10 text-center'>
          <p className='text-2xl mb-2'>📊</p>
          <p className='text-sm text-muted-foreground'>
            Your results are saved on the server.
          </p>
          <Button
            variant='outline'
            size='sm'
            className='mt-3'
            onClick={() => router.push('/quiz/results')}
          >
            View Results
          </Button>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-10 text-center'>
          <p className='text-2xl mb-2'>🎯</p>
          <p className='text-sm text-muted-foreground'>
            Take the quiz to get your recommendations
          </p>
          <Button
            size='sm'
            className='mt-3'
            onClick={() => router.push('/quiz')}
          >
            Start Assessment
          </Button>
        </div>
      )}
    </div>
  )
}
