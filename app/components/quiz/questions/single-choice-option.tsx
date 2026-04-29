import { ElementType } from 'react'
import { cn } from '@/lib/utils'

interface SingleChoiceOptionProps {
  optionLetter: string
  textEn: string
  selected: boolean
  Icon: ElementType
  onClick: () => void
}

export function SingleChoiceOption({
  optionLetter,
  textEn,
  selected,
  Icon,
  onClick,
}: SingleChoiceOptionProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 w-full px-4 py-4 rounded-xl text-left',
        'border-2 cursor-pointer transition-colors duration-200',
        selected
          ? 'border-primary bg-primary/8'
          : 'border-secondary-foreground/15 dark:border-border bg-card hover:border-primary/40'
      )}
    >
      {/* Icon badge */}
      <div
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
          selected ? 'bg-primary/15' : 'bg-muted'
        )}
      >
        <Icon
          size={16}
          className={selected ? 'text-primary' : 'text-muted-foreground'}
        />
      </div>

      {/* Label */}
      <span className='flex-1 text-md font-medium text-foreground'>
        {optionLetter}. {textEn}
      </span>

      {/* Check circle */}
      <div
        className={cn(
          'w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 transition-all duration-200',
          selected
            ? 'bg-primary border-primary scale-110'
            : 'bg-background border-border'
        )}
      >
        {selected && (
          <svg width='10' height='8' viewBox='0 0 10 8' fill='none' aria-hidden>
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
}
