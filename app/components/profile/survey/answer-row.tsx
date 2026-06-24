'use client'

import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

// 1. Structural schema definition matching survey-content structure
type ChoiceQuestion = {
  type: 'choice'
  options: string[]
}

type ScaleQuestion = {
  type: 'scale'
}

// 2. Updated metadata store using simple string-array pointers
export const QUESTION_META: Record<string, ChoiceQuestion | ScaleQuestion> = {
  Q1: { type: 'choice', options: ['A', 'B', 'C', 'D'] },
  Q2: { type: 'choice', options: ['A', 'B', 'C', 'D', 'E'] },
  Q3: { type: 'choice', options: ['A', 'B', 'C', 'D'] },
  Q4: { type: 'choice', options: ['A', 'B', 'C', 'D'] },
  Q5: { type: 'scale' },
  Q6: { type: 'scale' },
  Q7: { type: 'choice', options: ['A', 'B', 'C', 'D', 'E', 'F'] },
  Q8: { type: 'scale' },
  Q9: { type: 'choice', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
  Q10: { type: 'choice', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
  Q11: { type: 'scale' },
  Q12: { type: 'choice', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
}

// ==========================================
// Scale Bar Graphical Metric Component
// ==========================================
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
    <div className='flex items-center gap-3 w-full max-w-xs mt-1'>
      <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className='text-xs font-bold text-foreground w-8 text-right shrink-0'>
        {value} / 5
      </span>
    </div>
  )
}

// ==========================================
// Main Answer Row Component Export
// ==========================================
export function AnswerRow({ code, value }: { code: string; value: string }) {
  const tQuiz = useTranslations('quiz_meta')

  const meta = QUESTION_META[code] ?? { type: 'choice' }
  const numVal = Number(value)
  const isScale = meta.type === 'scale' && !isNaN(numVal)

  // Resolve localized labels from JSON translation sheet namespace safely
  const localizedQuestionLabel = tQuiz.has(`${code}.label`)
    ? tQuiz(`${code}.label`)
    : code

  const localizedOptionText = !isScale && tQuiz.has(`${code}.${value}`)
    ? tQuiz(`${code}.${value}`)
    : null

  return (
    <div className='flex flex-col gap-2.5 py-4 border-b border-border last:border-0 min-w-0'>
      {/* Question Header Metadata Block */}
      <div className='flex items-start gap-2.5 w-full'>
        <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0 mt-0.5'>
          {code}
        </span>
        <span className='text-sm font-semibold text-foreground leading-snug break-words flex-1'>
          {localizedQuestionLabel}
        </span>
      </div>

      {/* Conditional Rendering: Scale Metric vs Multiple Choice Output */}
      {isScale ? (
        <ScaleBar value={numVal} />
      ) : (
        <div className='flex flex-col gap-1.5 pl-0 sm:pl-9'>
          <span className='inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 w-fit shrink-0 select-none'>
            <CheckCircle2 size={11} /> 
            {tQuiz('option_prefix', { value })}
          </span>
          {localizedOptionText && (
            <p className='text-xs text-muted-foreground font-medium leading-relaxed mt-0.5 max-w-2xl break-words pl-1'>
              {localizedOptionText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}