'use client'

import { cn } from '@/lib/utils'

/**
 * Sizing strategy — fully fluid, no fixed px sizes:
 *   Each circle is `flex-1` inside the circles row, with an aspect-ratio of 1
 *   and a max-width cap per tier. This means they shrink and grow together
 *   with the available space, so the component works at any viewport width.
 *
 *   Tier sizes (max-width):
 *     value 1 & 5  →  largest   (max-w-12 / 3rem)
 *     value 2 & 4  →  medium    (max-w-9  / 2.25rem)
 *     value 3      →  smallest  (max-w-7  / 1.75rem)
 *
 * Color intent — CSS variables only, no hardcoded palette:
 *   1 & 2  →  muted-foreground tones  (negative / low interest)
 *   3      →  border / muted          (neutral)
 *   4 & 5  →  primary tones           (positive / encouraged)
 */
const SCALE_POINTS = [
  {
    value: 1,
    maxW: 'max-w-12', // 3rem  — largest
    idleBorder: 'border-muted-foreground/55',
    idleHover: 'hover:border-muted-foreground/50',
    activeBg: 'bg-muted-foreground/20',
    activeBorder: 'border-muted-foreground/60',
    dotColor: 'bg-muted-foreground/50',
  },
  {
    value: 2,
    maxW: 'max-w-9', // 2.25rem — medium
    idleBorder: 'border-muted-foreground/40',
    idleHover: 'hover:border-muted-foreground/40',
    activeBg: 'bg-muted-foreground/15',
    activeBorder: 'border-muted-foreground/45',
    dotColor: 'bg-muted-foreground/40',
  },
  {
    value: 3,
    maxW: 'max-w-7', // 1.75rem — smallest (centre)
    idleBorder: 'border-muted-foreground/30',
    idleHover: 'hover:border-muted-foreground/40',
    activeBg: 'bg-muted',
    activeBorder: 'border-muted-foreground/40',
    dotColor: 'bg-muted-foreground/30',
  },
  {
    value: 4,
    maxW: 'max-w-9',
    idleBorder: 'border-primary/35',
    idleHover: 'hover:border-primary/60',
    activeBg: 'bg-primary/20',
    activeBorder: 'border-primary/70',
    dotColor: 'bg-primary/60',
  },
  {
    value: 5,
    maxW: 'max-w-12',
    idleBorder: 'border-primary/55',
    idleHover: 'hover:border-primary/80',
    activeBg: 'bg-primary',
    activeBorder: 'border-primary',
    dotColor: 'bg-primary-foreground/70',
  },
] as const

interface LikertScaleProps {
  value: number | undefined
  onChange: (value: number) => void
  lowLabel: string
  highLabel: string
  ariaLabel?: string
}

export function LikertScale({
  value,
  onChange,
  lowLabel,
  highLabel,
  ariaLabel,
}: LikertScaleProps) {
  return (
    <div
      role='radiogroup'
      aria-label={ariaLabel}
      className='flex items-center gap-2 w-full select-none'
    >
      {/* ── Low label ─────────────────────────────────────────── */}
      <span
        className='text-[10px] sm:text-sm font-medium text-muted-foreground
                   leading-tight text-left shrink-0 w-1/5 min-w-0'
      >
        {lowLabel}
      </span>

      {/* ── Circles ───────────────────────────────────────────── */}
      {/*
        flex-1: fills all remaining space between the two labels.
        Each button is also flex-1 so they divide space equally.
        aspect-square + w-full (capped by max-w) keeps them perfectly round.
      */}
      <div className='flex items-center justify-center gap-1.5 sm:gap-2 flex-1'>
        {SCALE_POINTS.map(point => {
          const isSelected = value === point.value
          return (
            <button
              key={point.value}
              type='button'
              role='radio'
              aria-checked={isSelected}
              aria-label={`${point.value} of 5`}
              onClick={() => onChange(point.value)}
              className={cn(
                // fluid sizing: flex-1 so they share space, aspect-square keeps round
                'flex-1 aspect-square rounded-full border-2',
                // cap so large circles don't grow forever on wide screens
                point.maxW,
                // base
                'flex items-center justify-center',
                'transition-all duration-200 ease-out cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-offset-2 focus-visible:ring-ring',
                isSelected
                  ? cn(
                      point.activeBg,
                      point.activeBorder,
                      'scale-110 shadow-sm'
                    )
                  : cn(
                      'bg-transparent',
                      point.idleBorder,
                      point.idleHover,
                      'hover:scale-105'
                    )
              )}
            >
              {isSelected && (
                <span
                  className={cn('rounded-full w-[20%] h-[20%]', point.dotColor)}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── High label ────────────────────────────────────────── */}
      <span
        className='text-[10px] sm:text-sm font-medium text-primary
                   leading-tight text-right shrink-0 w-1/5 min-w-0'
      >
        {highLabel}
      </span>
    </div>
  )
}
