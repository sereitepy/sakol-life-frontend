import { ElementType, RefObject } from 'react'
import { cn } from '@/lib/utils'
import { LikertScale } from './likert-scale'

interface GroupLikertRowProps {
  subLabel: string
  Icon: ElementType
  selectedValue: number | undefined
  isLocked: boolean
  lowLabel: string
  highLabel: string
  rowRef:
    | RefObject<HTMLDivElement | null>
    | ((el: HTMLDivElement | null) => void)
  onChange: (value: number) => void
}

export function GroupLikertRow({
  subLabel,
  Icon,
  selectedValue,
  isLocked,
  lowLabel,
  highLabel,
  rowRef,
  onChange,
}: GroupLikertRowProps) {
  const isAnswered = selectedValue !== undefined

  return (
    <div
      ref={rowRef}
      className={cn(
        'flex flex-col gap-3 px-4 py-4 rounded-xl border-2',
        isAnswered
          ? 'border-primary/30 bg-primary/4'
          : isLocked
            ? 'border-border/40 bg-card/50 opacity-40 cursor-not-allowed'
            : 'border-border bg-card'
      )}
    >
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            isAnswered ? 'bg-primary/15' : 'bg-muted'
          )}
        >
          <Icon
            size={14}
            className={isAnswered ? 'text-primary' : 'text-muted-foreground'}
          />
        </div>
        <span className='md:text-lg font-medium text-foreground leading-tight'>
          {subLabel}
        </span>
      </div>

      {/* Scale */}
      <div className={cn(isLocked && 'pointer-events-none')}>
        <LikertScale
          value={selectedValue}
          onChange={onChange}
          lowLabel={lowLabel}
          highLabel={highLabel}
          ariaLabel={subLabel}
        />
      </div>
    </div>
  )
}
