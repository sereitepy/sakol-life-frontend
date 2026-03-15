import { RefObject } from 'react'
import { Question } from '@/lib/quiz/actions'
import { SingleChoiceOption } from './single-choice-option'
import { OPTION_ICONS } from './constant'

interface SingleChoiceListProps {
  question: Question
  selectedValue: string | undefined
  containerRef: RefObject<HTMLDivElement | null>
  onSelect: (optionLetter: string) => void
}

export function SingleChoiceList({
  question,
  selectedValue,
  containerRef,
  onSelect,
}: SingleChoiceListProps) {
  const sorted = [...question.options].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )

  return (
    <div ref={containerRef} className='flex flex-col gap-3'>
      {sorted.map((option, idx) => {
        const Icon = OPTION_ICONS[idx % OPTION_ICONS.length]
        return (
          <SingleChoiceOption
            key={option.optionLetter}
            optionLetter={option.optionLetter}
            textEn={option.textEn}
            selected={selectedValue === option.optionLetter}
            Icon={Icon}
            onClick={() => onSelect(option.optionLetter)}
          />
        )
      })}
    </div>
  )
}
