import { CheckCircle2 } from 'lucide-react'

export const QUESTION_META: Record<
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

export function AnswerRow({ code, value }: { code: string; value: string }) {
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
