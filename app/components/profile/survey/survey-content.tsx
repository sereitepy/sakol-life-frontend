'use client'

import { useRouter } from 'next/navigation'
import { RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProfileResponse } from '@/lib/profile/action'
import { QUESTION_META } from './answer-row'

function glowDot(active: boolean, isCurrent = false) {
  if (isCurrent)
    return 'w-8 h-8 rounded-full bg-primary shadow-[0_0_10px_#00e676] ring-4 ring-primary/20 flex items-center justify-center shrink-0'
  if (active)
    return 'w-5 h-5 rounded-full bg-primary shadow-[0_0_6px_#00e676] shrink-0'
  return 'w-5 h-5 rounded-full bg-surface-container-highest border border-white/10 shrink-0'
}

function ScaleCard({
  code,
  value,
  label,
  questionText,
  low,
  high,
}: {
  code: string
  value: number
  label: string
  questionText: string
  low?: string
  high?: string
}) {
  const MAX = 5
  const dots = Array.from({ length: MAX }, (_, i) => i + 1)

  // label badge text based on value
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
    <div className='glass-panel p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex items-center gap-2'>
          <span className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded'>
            {code}
          </span>
          <h3 className='text-base font-semibold text-on-surface'>{label}</h3>
        </div>
        <span className='text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20 shrink-0 ml-4'>
          {badge}
        </span>
      </div>

      <p className='text-sm text-on-surface-variant mb-6 leading-relaxed'>
        {questionText}
      </p>

      {/* Dot matrix */}
      <div className='flex items-center gap-3'>
        {dots.map((dot, i) => {
          const active = dot <= value
          const isCurrent = dot === value
          return (
            <div key={dot} className='flex flex-col items-center gap-2 flex-1'>
              <div className={`mx-auto ${glowDot(active, isCurrent)}`}>
                {isCurrent && (
                  <svg
                    className='w-3 h-3 text-on-primary'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-[10px] font-bold tracking-wide ${isCurrent ? 'text-primary' : 'text-on-surface-variant/50'}`}
              >
                {dot}
              </span>
            </div>
          )
        })}
      </div>

      {(low || high) && (
        <div className='flex justify-between mt-3'>
          <span className='text-[10px] text-outline'>{low}</span>
          <span className='text-[10px] text-outline'>{high}</span>
        </div>
      )}
    </div>
  )
}

function ChoiceCard({
  code,
  value,
  label,
  questionText,
  options,
}: {
  code: string
  value: string
  label: string
  questionText: string
  options: Record<string, string>
}) {
  return (
    <div className='glass-panel p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-2 py-1 rounded'>
          {code}
        </span>
        <h3 className='text-base font-semibold text-on-surface'>{label}</h3>
      </div>

      <p className='text-sm text-on-surface-variant mb-5 leading-relaxed'>
        {questionText}
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        {Object.entries(options).map(([letter, text]) => {
          const selected = letter === value
          return (
            <div
              key={letter}
              className={`
                flex items-start gap-3 p-4 rounded-lg border transition-all duration-200
                ${
                  selected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-white/10 bg-surface-container/50 opacity-50'
                }
              `}
            >
              {/* Radio dot */}
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-primary' : 'border-white/20'}`}
              >
                {selected && (
                  <div className='w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#00e676]' />
                )}
              </div>
              <div className='min-w-0'>
                <span
                  className={`text-[10px] font-extrabold tracking-widest mr-2 ${selected ? 'text-primary' : 'text-on-surface-variant'}`}
                >
                  {letter}
                </span>
                <span
                  className={`text-sm leading-snug ${selected ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}
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

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className='glass-panel rounded-2xl p-16 flex flex-col items-center justify-center text-center border border-white/10'>
      <div className='w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-3xl mb-5'>
        🎯
      </div>
      <h2 className='text-lg font-bold text-on-surface mb-2'>No answers yet</h2>
      <p className='text-sm text-on-surface-variant max-w-sm leading-relaxed mb-6'>
        Complete the career assessment quiz to discover your recommended majors
        and see a detailed breakdown of your answers here.
      </p>
      <button
        onClick={onStart}
        className='px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:shadow-[0_0_20px_#00e67680] transition-all active:scale-95'
      >
        Take the Assessment
      </button>
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

  // Separate and sort
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

  const completionPct = Math.round((latestAnswers.length / 12) * 100)
  const avgScale =
    scaleAnswers.length > 0
      ? (
          scaleAnswers.reduce((s, a) => s + Number(a.answerValue), 0) /
          scaleAnswers.length
        ).toFixed(1)
      : '—'

  return (
    <div className='flex min-h-[calc(100vh-57px)]'>
      {/* ── Sidebar ── */}
      <aside className='hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-r border-white/10 bg-surface-container-low p-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto'>
        <div className='space-y-8'>
          {/* Summary stats */}
          <section>
            <p className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3'>
              Survey Summary
            </p>
            <div className='space-y-3'>
              <div className='glass-panel p-4 rounded-xl border border-white/10'>
                <span className='text-[10px] font-bold uppercase tracking-widest text-primary'>
                  Completion Rate
                </span>
                <div className='mt-2 flex items-end gap-2'>
                  <span className='text-3xl font-bold text-on-surface'>
                    {completionPct}%
                  </span>
                </div>
                <div className='mt-3 w-full bg-surface-container-highest h-1 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary shadow-[0_0_6px_#00e676] rounded-full transition-all duration-700'
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>

              <div className='glass-panel p-4 rounded-xl border border-white/10'>
                <span className='text-[10px] font-bold uppercase tracking-widest text-primary'>
                  Average Scale Score
                </span>
                <div className='mt-2'>
                  <span className='text-3xl font-bold text-on-surface'>
                    {avgScale}
                  </span>
                  {avgScale !== '—' && (
                    <span className='text-sm text-outline ml-1'>/ 5.0</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Quick nav */}
          <section>
            <p className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3'>
              Quick Navigation
            </p>
            <div className='space-y-1'>
              {scaleAnswers.length > 0 && (
                <a
                  href='#scale-section'
                  className='flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all'
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
                  Scale Ratings
                </a>
              )}
              {choiceAnswers.length > 0 && (
                <a
                  href='#choice-section'
                  className='flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all'
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
                  Choice Answers
                </a>
              )}
            </div>
          </section>

          {/* Attempt count */}
          {totalAttempts > 0 && (
            <div className='glass-panel p-4 rounded-xl border border-white/10 text-center'>
              <p className='text-2xl font-bold text-on-surface'>
                {totalAttempts}
              </p>
              <p className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1'>
                Total Attempts
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className='flex-1 p-6 lg:p-8 xl:p-10'>
        <div className='max-w-3xl mx-auto space-y-12 pb-16'>
          {/* Page header */}
          <header className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
            <div>
              <h1 className='text-4xl font-bold text-on-surface tracking-tight mb-2'>
                Survey Answers
              </h1>
              <p className='text-base text-on-surface-variant leading-relaxed'>
                {hasAnswers
                  ? `Your detailed responses from your most recent assessment.`
                  : 'Complete the assessment to see your answers here.'}
              </p>
            </div>
            {hasAnswers && (
              <button
                onClick={() => router.push('/quiz')}
                className='flex items-center gap-2 px-5 py-2.5 border border-white/20 text-on-surface text-sm font-bold rounded-lg hover:bg-white/5 hover:shadow-[0_0_10px_rgba(0,230,118,0.15)] transition-all shrink-0'
              >
                <RotateCcw size={14} />
                Retake
              </button>
            )}
          </header>

          {!hasAnswers ? (
            <EmptyState onStart={() => router.push('/quiz')} />
          ) : (
            <>
              {/* Scale section */}
              {scaleAnswers.length > 0 && (
                <section id='scale-section' className='space-y-4'>
                  <h2 className='text-2xl font-bold text-on-surface'>
                    Scale Ratings
                  </h2>
                  <div className='space-y-4'>
                    {scaleAnswers.map(a => {
                      const meta = QUESTION_META[a.questionCode]
                      return (
                        <ScaleCard
                          key={a.questionCode}
                          code={a.questionCode}
                          value={Number(a.answerValue)}
                          label={meta?.label ?? a.questionCode}
                          questionText={QUESTION_TEXT[a.questionCode] ?? ''}
                          low={meta?.scaleLabel?.low}
                          high={meta?.scaleLabel?.high}
                        />
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Choice section */}
              {choiceAnswers.length > 0 && (
                <section id='choice-section' className='space-y-4'>
                  <h2 className='text-2xl font-bold text-on-surface'>
                    Multiple Choice
                  </h2>
                  <div className='space-y-4'>
                    {choiceAnswers.map(a => {
                      const meta = QUESTION_META[a.questionCode]
                      return (
                        <ChoiceCard
                          key={a.questionCode}
                          code={a.questionCode}
                          value={a.answerValue}
                          label={meta?.label ?? a.questionCode}
                          questionText={QUESTION_TEXT[a.questionCode] ?? ''}
                          options={meta?.options ?? {}}
                        />
                      )
                    })}
                  </div>
                </section>
              )}

              {/* CTA */}
              <section>
                <div className='glass-panel p-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-transparent text-center'>
                  <Sparkles className='w-10 h-10 text-primary mx-auto mb-4' />
                  <h2 className='text-2xl font-bold text-on-surface mb-3'>
                    View Your Recommended Majors
                  </h2>
                  <p className='text-base text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed'>
                    See how your answers map to the best-fit university majors
                    curated for your profile.
                  </p>
                  <div className='flex flex-col sm:flex-row justify-center gap-4'>
                    <button
                      onClick={() => router.push('/quiz/results')}
                      className='px-8 py-4 bg-primary text-on-primary font-bold rounded-lg hover:shadow-[0_0_20px_#00e67680] transition-all active:scale-95'
                    >
                      See My Results
                    </button>
                    <button
                      onClick={() => router.push('/quiz')}
                      className='px-8 py-4 border border-white/20 text-on-surface font-bold rounded-lg hover:bg-white/5 transition-all'
                    >
                      Retake Assessment
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
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
