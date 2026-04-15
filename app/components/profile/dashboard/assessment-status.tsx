import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PersonalityTag } from '../shared/personality-tags'

type Props = {
  hasQuiz: boolean
  answeredCount: number
  personalityTags: PersonalityTag[]
}

export function AssessmentStatus({
  hasQuiz,
  answeredCount,
  personalityTags,
}: Props) {
  const router = useRouter()

  return (
    <div className='bg-card border border-border rounded-2xl p-5'>
      <div className='flex items-start justify-between mb-1'>
        <div>
          <h2 className='font-bold text-base text-foreground'>
            Current Assessment Status
          </h2>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {hasQuiz
              ? `Completed ${answeredCount} of ${answeredCount} questions`
              : 'No assessment taken yet'}
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='gap-1.5 text-xs rounded-xl shrink-0'
          onClick={() => router.push('/quiz')}
        >
          <RotateCcw size={12} />
          {hasQuiz ? 'Update My Answers' : 'Take Assessment'}
        </Button>
      </div>

      <div className='mt-4 h-2 bg-muted rounded-full overflow-hidden'>
        <div
          className='h-full bg-primary rounded-full transition-all duration-700'
          style={{ width: hasQuiz ? '100%' : '0%' }}
        />
      </div>

      {hasQuiz && personalityTags.length > 0 && (
        <div className='mt-5'>
          <p className='text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2.5'>
            Your Personality Tags
          </p>
          <div className='flex flex-wrap gap-2'>
            {personalityTags.map(tag => (
              <span
                key={tag.label}
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${tag.color}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
