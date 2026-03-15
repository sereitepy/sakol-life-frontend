import { RefObject } from 'react'
import { Question, Answer } from '@/lib/quiz/actions'
import { GroupLikertRow } from './group-likert-row'
import { getLikertLabels, OPTION_ICONS } from './constant'

interface GroupLikertMatrixProps {
  questions: Question[]
  answers: Record<string, Answer>
  groupHighestAnswered: number
  containerRef: RefObject<HTMLDivElement | null>
  rowRefs: RefObject<(HTMLDivElement | null)[]>
  onAnswer: (
    questionId: string,
    questionCode: string,
    value: number,
    rowIndex: number
  ) => void
}

export function GroupLikertMatrix({
  questions,
  answers,
  groupHighestAnswered,
  containerRef,
  rowRefs,
  onAnswer,
}: GroupLikertMatrixProps) {
  return (
    <div ref={containerRef} className='flex flex-col gap-3'>
      {questions.map((q, idx) => {
        const selectedValue = answers[q.id]?.value as number | undefined
        const subLabel = q.textEn.replace(/^Rate your interest:\s*/i, '')
        const { low, high } = getLikertLabels(q.questionCode)
        const Icon = OPTION_ICONS[idx % OPTION_ICONS.length]
        const isLocked = idx > groupHighestAnswered + 1

        return (
          <GroupLikertRow
            key={q.id}
            subLabel={subLabel}
            Icon={Icon}
            selectedValue={selectedValue}
            isLocked={isLocked}
            lowLabel={low}
            highLabel={high}
            rowRef={el => {
              rowRefs.current[idx] = el
            }}
            onChange={v => onAnswer(q.id, q.questionCode, v, idx)}
          />
        )
      })}
    </div>
  )
}
