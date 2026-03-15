interface QuizProgressBarProps {
  currentIndex: number
  totalSteps: number
  progress: number
  label: string
}

export function QuizProgressBar({
  currentIndex,
  totalSteps,
  progress,
  label,
}: QuizProgressBarProps) {
  return (
    <div className='max-w-2xl mx-auto w-full px-4 sm:px-6 pt-8 pb-4'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-semibold tracking-widest text-muted-foreground uppercase'>
          Step {currentIndex + 1} of {totalSteps}
        </span>
        <span className='text-sm font-semibold text-primary'>
          {progress}% Complete
        </span>
      </div>

      <div className='h-1.5 bg-muted rounded-full overflow-hidden mb-4'>
        <div
          className='h-full bg-primary rounded-full transition-all duration-500 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className='text-xs md:text-sm font-semibold tracking-[0.15em] text-muted-foreground uppercase'>
        {label}
      </p>
    </div>
  )
}
