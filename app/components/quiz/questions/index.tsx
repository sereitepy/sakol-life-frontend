'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Answer, Question, submitQuizAnswers } from '@/lib/quiz/actions'
import buildSteps from './build-steps'
import { useScrollToTop } from '../../gsap/use-scroll-to-top'
import { useStaggerPop } from '../../gsap/use-stagger-pop'
import { usePulseElement } from '../../gsap/use-pulse-element'
import { ADVANCE_DELAY_MS } from './constant'
import { QuizProgressBar } from './quiz-progress-bar'
import { SingleChoiceList } from './single-choice-list'
import { GroupLikertMatrix } from './group-likert-matrix'
import { QuizStickyFooter } from './quiz-sticky-footer'
import { SingleLikert } from './single-likert'

type Props = { questions: Question[] }

export default function QuizClient({ questions }: Props) {
  const router = useRouter()
  const steps = useMemo(() => buildSteps(questions), [questions])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [groupHighestAnswered, setGroupHighestAnswered] = useState(-1)

  const currentStep = steps[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === steps.length - 1
  const totalSteps = steps.length
  const progress = Math.round((currentIndex / totalSteps) * 100)

  const canProceed =
    currentStep.type === 'single'
      ? answers[currentStep.question.id] !== undefined
      : currentStep.questions.every(q => answers[q.id] !== undefined)

  const scrollAnchorRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)
  const groupRowRefs = useRef<(HTMLDivElement | null)[]>([])

  useScrollToTop(scrollAnchorRef, currentIndex)
  useStaggerPop(optionsRef, currentIndex)
  const pulseElement = usePulseElement()

  useEffect(() => {
    if (currentStep.type !== 'group') return

    const groupQuestions = currentStep.questions
    let highest = -1
    for (let i = 0; i < groupQuestions.length; i++) {
      if (answers[groupQuestions[i].id] !== undefined) highest = i
      else break
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroupHighestAnswered(highest)
    groupRowRefs.current = new Array(groupQuestions.length).fill(null)
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  function advance(updated: Record<string, Answer>) {
    if (isLast) handleSubmit(updated)
    else setCurrentIndex(prev => prev + 1)
  }

  function handleSingleChoice(
    questionId: string,
    questionCode: string,
    value: string
  ) {
    const updated = {
      ...answers,
      [questionId]: { questionId, questionCode, value },
    }
    setAnswers(updated)
    setTimeout(() => advance(updated), ADVANCE_DELAY_MS)
  }

  function handleSingleLikert(
    questionId: string,
    questionCode: string,
    value: number
  ) {
    const updated = {
      ...answers,
      [questionId]: { questionId, questionCode, value },
    }
    setAnswers(updated)
    setTimeout(() => advance(updated), ADVANCE_DELAY_MS)
  }

  function handleGroupLikert(
    questionId: string,
    questionCode: string,
    value: number,
    rowIndex: number
  ) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, questionCode, value },
    }))

    const newHighest = Math.max(groupHighestAnswered, rowIndex)
    setGroupHighestAnswered(newHighest)

    const nextIndex = rowIndex + 1
    if (
      currentStep.type === 'group' &&
      nextIndex < currentStep.questions.length
    ) {
      pulseElement(groupRowRefs.current[nextIndex])
    }
  }

  function handleNext() {
    if (canProceed) advance(answers)
  }
  function handleBack() {
    if (!isFirst) setCurrentIndex(prev => prev - 1)
  }

  async function handleSubmit(finalAnswers: Record<string, Answer>) {
    setIsSubmitting(true)
    setError(null)
    try {
      const flat: Record<string, string | number> = {}
      for (const a of Object.values(finalAnswers))
        flat[a.questionCode] = a.value

      localStorage.setItem('quizAnswers', JSON.stringify(flat))

      const result = await submitQuizAnswers(Object.values(finalAnswers))
      sessionStorage.setItem('quizResult', JSON.stringify(result))
      router.push('/quiz/results')
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  // loading
  if (isSubmitting) {
    return (
      <div className='flex items-center justify-center py-24'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
          <p className='text-md text-muted-foreground'>
            Submitting your answers…
          </p>
        </div>
      </div>
    )
  }
  const stepTitle =
    currentStep.type === 'single'
      ? currentStep.question.textEn
      : 'Rate your interest in the following technology areas:'

  return (
    <div className='bg-background flex flex-col pb-28'>
      <div
        ref={scrollAnchorRef}
        className='absolute top-0 left-0'
        aria-hidden
      />

      <QuizProgressBar
        currentIndex={currentIndex}
        totalSteps={totalSteps}
        progress={progress}
        label='Sakol Life Personal Interest Quiz'
      />

      <div className='max-w-2xl mx-auto w-full px-4 sm:px-6 flex flex-col'>
        {/* Question title */}
        <div className='mt-6 mb-8'>
          <h2 className='text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight'>
            {stepTitle}
          </h2>
        </div>

        {/* SINGLE_CHOICE */}
        {currentStep.type === 'single' &&
          currentStep.question.format === 'SINGLE_CHOICE' && (
            <SingleChoiceList
              question={currentStep.question}
              selectedValue={
                answers[currentStep.question.id]?.value as string | undefined
              }
              containerRef={optionsRef}
              onSelect={letter =>
                handleSingleChoice(
                  currentStep.question.id,
                  currentStep.question.questionCode,
                  letter
                )
              }
            />
          )}

        {/* SINGLE LIKERT */}
        {currentStep.type === 'single' &&
          currentStep.question.format === 'LIKERT' && (
            <SingleLikert
              questionId={currentStep.question.id}
              questionCode={currentStep.question.questionCode}
              questionText={currentStep.question.textEn}
              selectedValue={
                answers[currentStep.question.id]?.value as number | undefined
              }
              containerRef={optionsRef}
              onChange={v =>
                handleSingleLikert(
                  currentStep.question.id,
                  currentStep.question.questionCode,
                  v
                )
              }
            />
          )}

        {/* GROUP LIKERT MATRIX */}
        {currentStep.type === 'group' && (
          <GroupLikertMatrix
            questions={currentStep.questions}
            answers={answers}
            groupHighestAnswered={groupHighestAnswered}
            containerRef={optionsRef}
            rowRefs={groupRowRefs}
            onAnswer={handleGroupLikert}
          />
        )}

        {error && (
          <p className='mt-4 text-md text-destructive px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg'>
            {error}
          </p>
        )}
      </div>

      <QuizStickyFooter
        mode={currentStep.type}
        isFirst={isFirst}
        isLast={isLast}
        canProceed={canProceed}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  )
}
