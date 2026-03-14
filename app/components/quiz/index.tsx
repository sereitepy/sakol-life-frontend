'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Answer, Question, submitQuizAnswers } from '@/lib/quiz/actions'
import {
  CircleGauge,
  Star,
  Radio,
  Map,
  Monitor,
  BarChart2,
  Shield,
  Wifi,
  Palette,
  Briefcase,
  Brain,
  Code,
  Lock,
  Globe,
  Database,
  Settings,
  Lightbulb,
  Rocket,
  Users,
  BookOpen,
} from 'lucide-react'

const OPTION_ICONS = [
  CircleGauge,
  Star,
  Radio,
  Map,
  Monitor,
  BarChart2,
  Shield,
  Wifi,
  Palette,
  Briefcase,
  Brain,
  Code,
  Lock,
  Globe,
  Database,
  Settings,
  Lightbulb,
  Rocket,
  Users,
  BookOpen,
]

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly\nDisagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly\nAgree' },
]

type Props = { questions: Question[] }

export default function QuizClient({ questions }: Props) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1
  const totalQuestions = questions.length
  const progress = Math.round((currentIndex / totalQuestions) * 100)
  const currentAnswer = answers[currentQuestion.id]

  // Pick answer → immediately go to the next question
  function handleAnswer(value: string | number) {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        questionCode: currentQuestion.questionCode,
        value,
      },
    }
    setAnswers(updatedAnswers)

    if (isLast) {
      handleSubmit(updatedAnswers)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  function handleBack() {
    if (!isFirst) setCurrentIndex(prev => prev - 1)
  }

  async function handleSubmit(finalAnswers: Record<string, Answer>) {
    setIsSubmitting(true)
    setError(null)
    try {
      const flatAnswers: Record<string, string | number> = {}
      for (const answer of Object.values(finalAnswers)) {
        flatAnswers[answer.questionCode] = answer.value
      }
      sessionStorage.setItem('quizAnswers', JSON.stringify(flatAnswers))

      const result = await submitQuizAnswers(Object.values(finalAnswers))
      sessionStorage.setItem('quizResult', JSON.stringify(result))
      router.push('/quiz/results')
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
          <p className='text-sm text-muted-foreground'>
            Submitting your answers…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* The progress bar */}
      <div className='max-w-2xl mx-auto w-full px-6 pt-8 pb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs font-semibold tracking-widest text-muted-foreground uppercase'>
            Step {currentIndex + 1} of {totalQuestions}
          </span>
          <span className='text-xs font-semibold text-primary'>
            {progress}% Complete
          </span>
        </div>
        <div className='h-1.5 bg-muted rounded-full overflow-hidden mb-4'>
          <div
            className='h-full bg-primary rounded-full transition-all duration-500 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase'>
          Sakol Life Personal Interest Survey
        </p>
      </div>

      {/* the questions and options */}
      <div className='max-w-2xl mx-auto w-full px-6 flex-1 flex flex-col'>
        <div className='mt-6 mb-8'>
          <h2 className='text-3xl font-bold text-foreground leading-tight tracking-tight'>
            {currentQuestion.textEn}
          </h2>
        </div>

        {/* SINGLE_CHOICE questions */}
        {currentQuestion.format === 'SINGLE_CHOICE' && (
          <div className='flex flex-col gap-3'>
            {currentQuestion.options
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((option, idx) => {
                const Icon = OPTION_ICONS[idx % OPTION_ICONS.length]
                const selected = currentAnswer?.value === option.optionLetter
                return (
                  <button
                    key={option.optionLetter}
                    onClick={() => handleAnswer(option.optionLetter)}
                    className={`
                      flex items-center gap-4 w-full px-4 py-4 rounded-xl text-left
                      border-2 transition-all duration-150 cursor-pointer
                      ${
                        selected
                          ? 'border-primary bg-primary/8'
                          : 'border-border bg-card hover:border-primary/40'
                      }
                    `}
                  >
                    <div
                      className={`
                      w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150
                      ${selected ? 'bg-primary/15' : 'bg-muted'}
                    `}
                    >
                      <Icon
                        size={16}
                        className={
                          selected ? 'text-primary' : 'text-muted-foreground'
                        }
                      />
                    </div>

                    <span className='flex-1 text-sm font-medium text-foreground'>
                      {option.optionLetter}. {option.textEn}
                    </span>

                    <div
                      className={`
                      w-6 h-6 rounded-full shrink-0 flex items-center justify-center
                      border-2 transition-all duration-150
                      ${selected ? 'bg-primary border-primary' : 'bg-background border-border'}
                    `}
                    >
                      {selected && (
                        <svg
                          width='10'
                          height='8'
                          viewBox='0 0 10 8'
                          fill='none'
                        >
                          <path
                            d='M1 4L3.5 6.5L9 1'
                            stroke='white'
                            strokeWidth='1.8'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
          </div>
        )}

        {/* LIKERT question, horizontal 1-5 row */}
        {currentQuestion.format === 'LIKERT' && (
          <div className='flex flex-col gap-4'>
            {/* Scale labels */}
            <div className='flex items-center justify-between px-1'>
              <span className='text-xs text-muted-foreground'>
                Strongly Disagree
              </span>
              <span className='text-xs text-muted-foreground'>
                Strongly Agree
              </span>
            </div>

            {/* 5 buttons in a row */}
            <div className='flex gap-3'>
              {LIKERT_OPTIONS.map(option => {
                const selected = currentAnswer?.value === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`
                      flex-1 flex flex-col items-center gap-2 py-5 rounded-xl
                      border-2 transition-all duration-150 cursor-pointer
                      ${
                        selected
                          ? 'border-primary bg-primary/8'
                          : 'border-border bg-card hover:border-primary/40'
                      }
                    `}
                  >
                    {/* Number circle */}
                    <div
                      className={`
                      w-9 h-9 rounded-full flex items-center justify-center
                      border-2 transition-all duration-150 font-bold text-sm
                      ${
                        selected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-background border-border text-foreground'
                      }
                    `}
                    >
                      {option.value}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {error && (
          <p className='mt-4 text-sm text-destructive px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-(--radius)'>
            {error}
          </p>
        )}

        <div className='flex-1' />
      </div>

      {/* the bottom navigation */}
      <div className='max-w-2xl mx-auto w-full px-6 pb-8'>
        <div className='h-px bg-border mb-6' />

        <div className='flex items-center justify-between'>
          {!isFirst ? (
            <button
              onClick={handleBack}
              className='flex items-center gap-2 px-5 py-3 text-sm font-semibold text-foreground bg-background border-2 border-border rounded-xl hover:border-primary/40 transition-colors cursor-pointer'
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* ... indicators */}
        <div className='flex items-center justify-center gap-1.5 mt-6'>
          {Array.from({ length: Math.min(totalQuestions, 20) }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-4 h-1.5 bg-primary'
                  : i < currentIndex
                    ? 'w-1.5 h-1.5 bg-primary/40'
                    : 'w-1.5 h-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
