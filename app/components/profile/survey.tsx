'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfileResponse } from '@/lib/profile/action'
import { QUESTION_META, AnswerRow } from './survey/answer-row'
import { SurveySummaryCards } from './survey/summary-cards'

type Props = {
  profile: ProfileResponse
}

export default function SurveyTab({ profile }: Props) {
  const router = useRouter()
  const { latestAnswers, totalAttempts } = profile
  const hasAnswers = latestAnswers.length > 0

  const scaleAnswers = latestAnswers
    .filter(a => {
      const meta = QUESTION_META[a.questionCode]
      return meta?.type === 'scale' && !isNaN(Number(a.answerValue))
    })
    .sort((a, b) =>
      a.questionCode.localeCompare(b.questionCode, undefined, { numeric: true })
    )

  const choiceAnswers = latestAnswers
    .filter(a => {
      const meta = QUESTION_META[a.questionCode]
      return meta?.type === 'choice' || isNaN(Number(a.answerValue))
    })
    .sort((a, b) =>
      a.questionCode.localeCompare(b.questionCode, undefined, { numeric: true })
    )

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>
            My Survey History
          </h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            {totalAttempts > 0
              ? `You've completed ${totalAttempts} assessment${totalAttempts !== 1 ? 's' : ''}. Showing your most recent answers.`
              : 'No assessments completed yet.'}
          </p>
        </div>
        <Button
          className='gap-2 rounded-xl shrink-0'
          onClick={() => router.push('/quiz')}
        >
          <RotateCcw size={14} />
          {hasAnswers ? 'Retake Assessment' : 'Start Assessment'}
        </Button>
      </div>

      {!hasAnswers ? (
        <div className='bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center'>
          <div className='w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl mb-4'>
            🎯
          </div>
          <h2 className='font-bold text-base text-foreground mb-1'>
            No answers yet
          </h2>
          <p className='text-sm text-muted-foreground max-w-sm leading-relaxed'>
            Complete the career assessment quiz to discover your recommended
            majors and see your answers here.
          </p>
          <Button
            className='mt-5 rounded-xl'
            onClick={() => router.push('/quiz')}
          >
            Take the Assessment
          </Button>
        </div>
      ) : (
        <>
          <SurveySummaryCards
            totalAttempts={totalAttempts}
            answeredCount={latestAnswers.length}
            scaleCount={scaleAnswers.length}
            choiceCount={choiceAnswers.length}
          />

          {/* Attempt info bar */}
          <div className='flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl'>
            <Clock size={14} className='text-primary shrink-0' />
            <p className='text-xs text-muted-foreground'>
              Showing your{' '}
              <span className='font-bold text-foreground'>
                most recent attempt
              </span>
              . Retaking the quiz will replace these answers.
            </p>
          </div>

          {/* Scale questions */}
          {scaleAnswers.length > 0 && (
            <div className='bg-card border border-border rounded-2xl p-5'>
              <h3 className='font-bold text-base text-foreground mb-1'>
                Scale Ratings
              </h3>
              <p className='text-xs text-muted-foreground mb-4'>
                Your rated responses on a scale from 1 (low) to 5 (high)
              </p>
              <div>
                {scaleAnswers.map(a => (
                  <AnswerRow
                    key={a.questionCode}
                    code={a.questionCode}
                    value={a.answerValue}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Choice questions */}
          {choiceAnswers.length > 0 && (
            <div className='bg-card border border-border rounded-2xl p-5'>
              <h3 className='font-bold text-base text-foreground mb-1'>
                Multiple Choice Answers
              </h3>
              <p className='text-xs text-muted-foreground mb-4'>
                Your selected answers for each preference question
              </p>
              <div>
                {choiceAnswers.map(a => (
                  <AnswerRow
                    key={a.questionCode}
                    code={a.questionCode}
                    value={a.answerValue}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTA to view results */}
          <div
            className='bg-card border border-border rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group'
            onClick={() => router.push('/quiz/results')}
          >
            <div>
              <h3 className='font-bold text-sm text-foreground'>
                View Your Recommended Majors
              </h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                See how your answers map to the best-fit majors
              </p>
            </div>
            <ChevronRight
              size={18}
              className='text-muted-foreground group-hover:text-primary transition-colors shrink-0'
            />
          </div>
        </>
      )}
    </div>
  )
}
