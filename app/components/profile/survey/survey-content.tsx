'use client'

import { useRouter } from 'next/navigation'
import { CloudSunRain, RotateCcw, Sparkles } from 'lucide-react'
import { ProfileResponse } from '@/lib/profile/action'
import { QUESTION_META } from './answer-row'
import { SurveySummaryCards } from './summary-cards'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SCALE_POINTS = [
  {
    value: 1,
    maxW: 'max-w-12',
    activeBg: 'bg-muted-foreground/20',
    activeBorder: 'border-muted-foreground/60',
    dotColor: 'bg-muted-foreground/50',
    idleBorder: 'border-muted-foreground/30',
  },
  {
    value: 2,
    maxW: 'max-w-9',
    activeBg: 'bg-muted-foreground/15',
    activeBorder: 'border-muted-foreground/45',
    dotColor: 'bg-muted-foreground/40',
    idleBorder: 'border-muted-foreground/25',
  },
  {
    value: 3,
    maxW: 'max-w-7',
    activeBg: 'bg-muted',
    activeBorder: 'border-muted-foreground/40',
    dotColor: 'bg-muted-foreground/30',
    idleBorder: 'border-muted-foreground/20',
  },
  {
    value: 4,
    maxW: 'max-w-9',
    activeBg: 'bg-primary/20',
    activeBorder: 'border-primary/70',
    dotColor: 'bg-primary/60',
    idleBorder: 'border-primary/20',
  },
  {
    value: 5,
    maxW: 'max-w-12',
    activeBg: 'bg-primary',
    activeBorder: 'border-primary',
    dotColor: 'bg-primary-foreground/70',
    idleBorder: 'border-primary/25',
  },
] as const

function ReadOnlyLikert({
  value,
  lowLabel,
  highLabel,
}: {
  value: number
  lowLabel: string
  highLabel: string
}) {
  return (
    <div className='flex items-center gap-2 w-full select-none'>
      <span className='text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight text-left shrink-0 w-1/5 min-w-0'>
        {lowLabel}
      </span>
      <div className='flex items-center justify-center gap-1.5 sm:gap-2 flex-1'>
        {SCALE_POINTS.map(point => {
          const isSelected = value === point.value
          return (
            <div
              key={point.value}
              className={cn(
                'flex-1 aspect-square rounded-full border-2 flex items-center justify-center',
                point.maxW,
                isSelected
                  ? cn(
                      point.activeBg,
                      point.activeBorder,
                      'scale-110 shadow-sm'
                    )
                  : cn('bg-transparent', point.idleBorder)
              )}
            >
              {isSelected && (
                <span
                  className={cn('rounded-full w-[20%] h-[20%]', point.dotColor)}
                />
              )}
            </div>
          )
        })}
      </div>
      <span className='text-[10px] sm:text-xs font-medium text-primary leading-tight text-right shrink-0 w-1/5 min-w-0'>
        {highLabel}
      </span>
    </div>
  )
}

function ScaleCard({ code, value }: { code: string; value: number }) {
  const meta = QUESTION_META[code]
  // Explicit narrowing guard for scale type
  if (!meta || meta.type !== 'scale') return null

  const badge =
    value >= 5
      ? 'Very High'
      : value >= 4
        ? 'High'
        : value >= 3
          ? 'Moderate'
          : value >= 2
            ? 'Low'
            : 'Very Low'

  return (
    <div className='bg-card p-[clamp(14px,2vw,24px)] rounded-xl border border-border cursor-default transition-all duration-300'>
      <div className='flex items-start justify-between gap-3 mb-4'>
        <div className='flex items-center gap-2 min-w-0'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded shrink-0'>
            {code}
          </span>
          <h3 className='text-sm font-semibold text-foreground truncate'>
            {meta.label}
          </h3>
        </div>
        <span className='text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20 shrink-0'>
          {badge}
        </span>
      </div>
      <p className='text-sm text-muted-foreground mb-5 leading-relaxed'>
        {QUESTION_TEXT[code] ?? ''}
      </p>
      <ReadOnlyLikert
        value={value}
        lowLabel={meta.scaleLabel?.low ?? 'Low'}
        highLabel={meta.scaleLabel?.high ?? 'High'}
      />
    </div>
  )
}

function ChoiceCard({ code, value }: { code: string; value: string }) {
  const meta = QUESTION_META[code]
  // Explicit narrowing guard for choice type
  if (!meta || meta.type !== 'choice') return null

  return (
    <div className='bg-card p-[clamp(14px,2vw,24px)] rounded-xl border border-border cursor-default'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded shrink-0'>
          {code}
        </span>
        <h3 className='text-sm font-semibold text-foreground'>{meta.label}</h3>
      </div>
      <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>
        {QUESTION_TEXT[code] ?? ''}
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
        {Object.entries(meta.options).map(([letter, text]) => {
          const selected = letter === value
          return (
            <div
              key={letter}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border cursor-default',
                selected
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-card/50 opacity-40'
              )}
            >
              <div
                className={cn(
                  'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                  selected ? 'border-primary' : 'border-muted-foreground/30'
                )}
              >
                {selected && (
                  <div className='w-2 h-2 rounded-full bg-primary' />
                )}
              </div>
              <div className='min-w-0'>
                <span
                  className={cn(
                    'text-[10px] font-extrabold tracking-widest mr-1.5',
                    selected ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {letter}
                </span>
                <span
                  className={cn(
                    'text-xs leading-snug',
                    selected
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {text}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SurveyContent({
  profile,
}: {
  profile: ProfileResponse
}) {
  const router = useRouter()
  const { latestAnswers, totalAttempts } = profile
  const hasAnswers = latestAnswers.length > 0

  const scaleAnswers = latestAnswers
    .filter(
      a =>
        QUESTION_META[a.questionCode]?.type === 'scale' &&
        !isNaN(Number(a.answerValue))
    )
    .sort((a, b) =>
      a.questionCode.localeCompare(b.questionCode, undefined, { numeric: true })
    )

  const choiceAnswers = latestAnswers
    .filter(a => QUESTION_META[a.questionCode]?.type === 'choice')
    .sort((a, b) =>
      a.questionCode.localeCompare(b.questionCode, undefined, { numeric: true })
    )

  return (
    <div className='flex min-h-[calc(100vh-57px)]'>
      <main className='flex-1 p-[clamp(16px,3vw,48px)] min-w-0'>
        <div className='max-w-[min(1000px,100%)] mx-auto space-y-[clamp(12px,2vw,24px)]'>
          <div className='space-y-[clamp(16px,2vw,28px)]'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-3'>
              <div>
                <h1 className='text-[clamp(18px,2.5vw,28px)] font-bold text-foreground tracking-tight'>
                  Survey Answers
                </h1>
                <p className='text-sm text-muted-foreground mt-1'>
                  {hasAnswers
                    ? 'Detailed responses from your most recent assessment.'
                    : 'Complete the assessment to see your answers here.'}
                </p>
              </div>
              {hasAnswers && (
                <Button
                  variant='secondary'
                  onClick={() => router.push('/quiz')}
                  className='flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5
              border border-border text-foreground text-sm font-bold rounded-lg
              hover:bg-muted transition-all shrink-0'
                >
                  <RotateCcw size={14} />
                  Retake
                </Button>
              )}
            </div>

            {!hasAnswers ? (
              <div className='bg-card rounded-2xl border border-border p-[clamp(32px,6vw,64px)] flex flex-col items-center justify-center text-center'>
                <div className='w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl mb-4'>
                  <CloudSunRain size={30} />
                </div>
                <h2 className='font-bold text-base text-foreground mb-1'>
                  No answers yet
                </h2>
                <p className='text-sm text-muted-foreground max-w-sm leading-relaxed mb-5'>
                  Complete the career assessment quiz to discover your
                  recommended majors.
                </p>
                <button
                  onClick={() => router.push('/quiz')}
                  className='px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg transition-all active:scale-95'
                >
                  Take the Assessment
                </button>
              </div>
            ) : (
              <>
                <SurveySummaryCards
                  totalAttempts={totalAttempts}
                  answeredCount={latestAnswers.length}
                  scaleCount={scaleAnswers.length}
                  choiceCount={choiceAnswers.length}
                />

                {scaleAnswers.length > 0 && (
                  <section className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-[clamp(14px,1.5vw,18px)] font-bold text-foreground'>
                        Scale Ratings
                      </h2>
                      <span className='text-xs text-muted-foreground'>
                        To change your answers, retake the quiz
                      </span>
                    </div>
                    {scaleAnswers.map(a => (
                      <ScaleCard
                        key={a.questionCode}
                        code={a.questionCode}
                        value={Number(a.answerValue)}
                      />
                    ))}
                  </section>
                )}

                {choiceAnswers.length > 0 && (
                  <section className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-[clamp(14px,1.5vw,18px)] font-bold text-foreground'>
                        Multiple Choice
                      </h2>
                      <span className='text-xs text-muted-foreground'>
                        To change your answers, retake the quiz
                      </span>
                    </div>
                    {choiceAnswers.map(a => (
                      <ChoiceCard
                        key={a.questionCode}
                        code={a.questionCode}
                        value={a.answerValue}
                      />
                    ))}
                  </section>
                )}

                {/* CTA */}
                <div
                  className='bg-card rounded-2xl border border-primary/20 bg-primary/5
              p-[clamp(20px,3vw,40px)] flex flex-col items-center text-center cursor-pointer
              hover:border-primary/40 transition-all'
                  onClick={() => router.push('/quiz/results')}
                >
                  <Sparkles className='w-8 h-8 text-primary mb-3' />
                  <h2 className='text-[clamp(14px,1.5vw,18px)] font-bold text-foreground mb-2'>
                    View Your Recommended Majors
                  </h2>
                  <p className='text-sm text-muted-foreground max-w-md leading-relaxed mb-5'>
                    See how your answers map to the best-fit university majors
                    for your profile.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                    <Button
                      onClick={e => {
                        e.stopPropagation()
                        router.push('/quiz/results')
                      }}
                      className='px-6 text-md py-6 bg-primary text-primary-foreground font-bold rounded-lg transition-all active:scale-95 w-full sm:w-auto'
                    >
                      See My Results
                    </Button>
                    <Button
                      variant='outline'
                      onClick={e => {
                        e.stopPropagation()
                        router.push('/quiz')
                      }}
                      className='px-6 text-md py-6 border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-all w-full sm:w-auto'
                    >
                      Retake Assessment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const QUESTION_TEXT: Record<string, string> = {
  Q1: 'When you get a new phone or download a new app, what do you usually do first?',
  Q2: 'When you scroll through TikTok or Facebook, what kind of content do you usually stop and watch?',
  Q3: 'Have you ever edited a video, designed a poster, or created digital content for school, fun, or social media?',
  Q4: 'Your phone is acting strange, apps keep crashing and the internet stops working. What do you do?',
  Q5: 'How comfortable are you helping a classmate or younger sibling figure out how to use an app or fix a technology problem?',
  Q6: 'How much do you enjoy noticing patterns or figuring out why things work the way they do?',
  Q7: 'Which of the following sounds most like how you use your phone every day?',
  Q8: 'How interested are you in making things look visually appealing, such as editing photos, designing a poster for class, or choosing colors and fonts for a project?',
  Q9: 'If you could build anything using technology and you knew it would actually work, what would you build?',
  Q10: 'Which of these accomplishments would make you the most proud?',
  Q11: 'How excited are you about the idea of studying a technology-related major at university?',
  Q12: 'Which of these would you most want to learn more about?',
}
