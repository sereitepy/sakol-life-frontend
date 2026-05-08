import { Skeleton } from '@/components/ui/skeleton'

export default function SurveyLoading() {
  return (
    <div className='flex min-h-[calc(100vh-57px)]'>
      <main className='flex-1 p-[clamp(16px,3vw,48px)] min-w-0'>
        <div className='max-w-[min(1000px,100%)] mx-auto space-y-[clamp(12px,2vw,24px)]'>
          <div className='space-y-[clamp(16px,2vw,28px)]'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-3'>
              <div className='space-y-2'>
                <Skeleton className='h-7 w-48' />
                <Skeleton className='h-4 w-72' />
              </div>
              <Skeleton className='h-10 w-full sm:w-24' />
            </div>

            {/* Summary cards */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='glass-panel rounded-2xl border border-border p-[clamp(12px,1.5vw,20px)] flex flex-col items-center gap-2'
                >
                  <Skeleton className='h-7 w-10' />
                  <Skeleton className='h-3 w-20' />
                </div>
              ))}
            </div>

            {/* Scale section */}
            <Skeleton className='h-5 w-32' />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='glass-panel rounded-xl border border-border p-[clamp(14px,2vw,24px)] space-y-4'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-5 w-8' />
                    <Skeleton className='h-5 w-36' />
                  </div>
                  <Skeleton className='h-6 w-16 rounded-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-3.5 w-full' />
                  <Skeleton className='h-3.5 w-4/5' />
                </div>
                {/* Likert bubbles */}
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-3 w-1/5' />
                  <div className='flex items-center justify-center gap-2 flex-1'>
                    {[48, 36, 28, 36, 48].map((size, j) => (
                      <Skeleton
                        key={j}
                        className='aspect-square rounded-full flex-1'
                        style={{ maxWidth: `${size}px` }}
                      />
                    ))}
                  </div>
                  <Skeleton className='h-3 w-1/5' />
                </div>
              </div>
            ))}

            {/* Choice section */}
            <Skeleton className='h-5 w-40' />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className='glass-panel rounded-xl border border-border p-[clamp(14px,2vw,24px)] space-y-4'
              >
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-5 w-8' />
                  <Skeleton className='h-5 w-44' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-3.5 w-full' />
                  <Skeleton className='h-3.5 w-3/4' />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className='flex items-start gap-3 p-3 rounded-lg border border-border'
                    >
                      <Skeleton className='w-4 h-4 rounded-full shrink-0 mt-0.5' />
                      <div className='flex-1 space-y-1.5'>
                        <Skeleton className='h-3 w-full' />
                        <Skeleton className='h-3 w-2/3' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
