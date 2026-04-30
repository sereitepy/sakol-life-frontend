'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfileResponse } from '@/lib/profile/action'

type Props = {
  profile: ProfileResponse
}

const QUESTION_META: Record<
  string,
  { label: string; type: 'choice' | 'scale' }
> = {
  Q1: { label: 'Preferred learning style', type: 'choice' },
  Q2: { label: 'Favourite subject area', type: 'scale' },
  Q3: { label: 'Problem-solving approach', type: 'choice' },
  Q4_A: { label: 'Interest: Visual & Design', type: 'scale' },
  Q4_B: { label: 'Interest: Logic & Systems', type: 'scale' },
  Q4_C: { label: 'Interest: Data & Analysis', type: 'scale' },
  Q4_D: { label: 'Interest: Creative & Art', type: 'scale' },
  Q4_E: { label: 'Interest: Detail & Precision', type: 'scale' },
  Q4_F: { label: 'Interest: Structure & Planning', type: 'scale' },
  Q4_G: { label: 'Interest: Hands-on Building', type: 'scale' },
  Q5: { label: 'Work environment preference', type: 'choice' },
  Q6: { label: 'Collaboration style', type: 'choice' },
  Q7: { label: 'Comfort with technology', type: 'scale' },
  Q8: { label: 'Interest in research', type: 'scale' },
  Q9: { label: 'Communication preference', type: 'scale' },
  Q10: { label: 'Career priority', type: 'choice' },
  Q11: { label: 'Comfort with ambiguity', type: 'scale' },
  Q12: { label: 'Study duration preference', type: 'choice' },
  Q13: { label: 'Interest in leadership roles', type: 'scale' },
  Q14: { label: 'Preferred project type', type: 'choice' },
}

function ScaleBar({ value }: { value: number }) {
  const pct = (value / 5) * 100
  const color =
    value >= 4
      ? 'bg-green-500'
      : value >= 3
        ? 'bg-primary'
        : value >= 2
          ? 'bg-yellow-500'
          : 'bg-muted-foreground'

  return (
    <div className='flex items-center gap-3'>
      <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className='text-xs font-bold text-foreground w-6 text-right'>
        {value}/5
      </span>
    </div>
  )
}

function AnswerRow({ code, value }: { code: string; value: string }) {
  const meta = QUESTION_META[code] ?? { label: code, type: 'choice' }
  const numVal = Number(value)
  const isScale = meta.type === 'scale' && !isNaN(numVal)

  return (
    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3.5 border-b border-border last:border-0'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md'>
            {code}
          </span>
          <span className='text-sm font-semibold text-foreground'>
            {meta.label}
          </span>
        </div>
      </div>
      <div className='sm:w-48 shrink-0'>
        {isScale ? (
          <ScaleBar value={numVal} />
        ) : (
          <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20'>
            <CheckCircle2 size={11} /> Option {value}
          </span>
        )}
      </div>
    </div>
  )
}

export default function SurveyTab({ profile }: Props) {
  const router = useRouter()
  const { latestAnswers, totalAttempts } = profile
  const hasAnswers = latestAnswers.length > 0

  // Separate choice questions from scale questions for grouping
  const choiceAnswers = latestAnswers
    .filter(a => {
      const meta = QUESTION_META[a.questionCode]
      return meta?.type === 'choice' || isNaN(Number(a.answerValue))
    })
    .sort((a, b) =>
      a.questionCode.localeCompare(b.questionCode, undefined, { numeric: true })
  )
  
  const scaleAnswers = latestAnswers
    .filter(a => {
      const meta = QUESTION_META[a.questionCode]
      return meta?.type === 'scale' && !isNaN(Number(a.answerValue))
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
          {/* Summary cards */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <div className='bg-card border border-border rounded-2xl p-4 text-center'>
              <p className='text-2xl font-extrabold text-foreground'>
                {totalAttempts}
              </p>
              <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1'>
                Total Attempts
              </p>
            </div>
            <div className='bg-card border border-border rounded-2xl p-4 text-center'>
              <p className='text-2xl font-extrabold text-foreground'>
                {latestAnswers.length}
              </p>
              <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1'>
                Questions Answered
              </p>
            </div>
            <div className='bg-card border border-border rounded-2xl p-4 text-center'>
              <p className='text-2xl font-extrabold text-foreground'>
                {scaleAnswers.length}
              </p>
              <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1'>
                Interest Ratings
              </p>
            </div>
            <div className='bg-card border border-border rounded-2xl p-4 text-center'>
              <p className='text-2xl font-extrabold text-foreground'>
                {choiceAnswers.length}
              </p>
              <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1'>
                Preference Choices
              </p>
            </div>
          </div>

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
                Interest Ratings
              </h3>
              <p className='text-xs text-muted-foreground mb-4'>
                Your rated level of interest in each area (1 = low, 5 = high)
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
                Preference Choices
              </h3>
              <p className='text-xs text-muted-foreground mb-4'>
                Your selected answers for multiple-choice questions
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
