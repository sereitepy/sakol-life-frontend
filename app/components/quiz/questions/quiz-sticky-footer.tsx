import { Button } from '@/components/ui/button'

interface QuizStickyFooterProps {
  /** 'group' shows Back + Next/Submit. 'single' shows Back only (or hint if first). */
  mode: 'group' | 'single'
  isFirst: boolean
  isLast: boolean
  canProceed: boolean
  onBack: () => void
  onNext: () => void
}

export function QuizStickyFooter({
  mode,
  isFirst,
  isLast,
  canProceed,
  onBack,
  onNext,
}: QuizStickyFooterProps) {
  return (
    <div
      className='fixed bottom-0 left-0 right-0 z-50
                 bg-background/30 backdrop-blur-sm
                 border-t border-border/50'
    >
      <div className='max-w-2xl mx-auto w-full px-4 sm:px-6 py-4'>
        {mode === 'group' && (
          <div className='flex items-center justify-between gap-3'>
            <Button
              variant='outline'
              type='button'
              onClick={onBack}
              disabled={isFirst}
              className='flex-1 sm:flex-none sm:px-6 rounded-lg text-sm'
            >
              ← Back
            </Button>
            <Button
              type='button'
              onClick={onNext}
              disabled={!canProceed}
              className='flex-1 sm:flex-none sm:px-8 rounded-lg text-sm'
            >
              {isLast ? 'Submit' : 'Next →'}
            </Button>
          </div>
        )}

        {mode === 'single' && !isFirst && (
          <Button
            variant='outline'
            type='button'
            onClick={onBack}
            className='w-full sm:w-auto sm:px-6 rounded-lg text-sm'
          >
            ← Back
          </Button>
        )}

        {mode === 'single' && isFirst && (
          <p className='text-sm text-center text-muted-foreground'>
            Tap an answer to continue
          </p>
        )}
      </div>
    </div>
  )
}
