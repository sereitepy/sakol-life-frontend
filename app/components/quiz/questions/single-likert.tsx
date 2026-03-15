import { RefObject } from 'react'
import { getLikertLabels } from './constant'
import { LikertScale } from './likert-scale'


interface SingleLikertProps {
  questionId: string
  questionCode: string
  questionText: string
  selectedValue: number | undefined
  containerRef: RefObject<HTMLDivElement | null>
  onChange: (value: number) => void
}

export function SingleLikert({
  // questionId,
  questionCode,
  questionText,
  selectedValue,
  containerRef,
  onChange,
}: SingleLikertProps) {
  const { low, high } = getLikertLabels(questionCode)

  return (
    <div ref={containerRef} className='flex flex-col items-center gap-6 py-4'>
      <LikertScale
        value={selectedValue}
        onChange={onChange}
        lowLabel={low}
        highLabel={high}
        ariaLabel={questionText}
      />
    </div>
  )
}
