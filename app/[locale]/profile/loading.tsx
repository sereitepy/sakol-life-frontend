'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className='flex-1 p-[clamp(20px,3vw,48px)] min-w-0'>
      <div className='max-w-[min(1000px,100%)] mx-auto space-y-[clamp(16px,2vw,24px)]'>
        {/* Quick shortcuts */}
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-32 rounded-full' />
          ))}
        </div>

        {/* Profile hero */}
        <div className='glass-panel rounded-xl border border-border p-[clamp(14px,2vw,24px)]'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <Skeleton className='w-[clamp(52px,5vw,72px)] h-[clamp(52px,5vw,72px)] rounded-full shrink-0' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-6 w-40' />
              <div className='flex gap-4'>
                <Skeleton className='h-4 w-36' />
                <Skeleton className='h-4 w-28' />
              </div>
            </div>
            <Skeleton className='h-9 w-full sm:w-28 rounded-lg' />
          </div>
        </div>

        {/* Stat cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='glass-panel rounded-xl border border-border p-6 space-y-4'
            >
              <div className='flex items-center justify-between'>
                <Skeleton className='h-8 w-8 rounded-lg' />
                <Skeleton className='h-3 w-20' />
              </div>
              <Skeleton className='h-7 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          ))}
        </div>

        {/* Assessment status */}
        <div className='glass-panel rounded-xl border border-border p-[clamp(14px,2vw,24px)] space-y-5'>
          <div className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-52' />
              <Skeleton className='h-4 w-80' />
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
              <Skeleton className='h-7 w-20 rounded-lg' />
              <Skeleton className='h-7 w-20 rounded-lg' />
              <Skeleton className='h-8 w-24 rounded-lg ml-auto' />
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <Skeleton className='h-3 w-32' />
              <Skeleton className='h-3 w-48' />
            </div>
            <Skeleton className='h-2.5 w-full rounded-full' />
          </div>
        </div>

        {/* Recommendations panel */}
        <div className='glass-panel rounded-xl border border-border p-[clamp(14px,2vw,24px)] space-y-4'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-44' />
            <Skeleton className='h-4 w-16' />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className='h-[clamp(110px,18vw,150px)] rounded-xl'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
