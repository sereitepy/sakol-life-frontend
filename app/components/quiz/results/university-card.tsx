import { University } from '@/lib/profile/action'
import Image from 'next/image'

export default function UniversityCard({
  uni,
  onClick,
}: {
  uni: University
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className='bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group'
    >
      {/* Banner */}
      <div className='relative h-32 bg-muted overflow-hidden'>
        {uni.bannerUrl ? (
          <Image
            src={uni.bannerUrl}
            alt={uni.nameEn}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-4xl'>
            🏫
          </div>
        )}
        <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent' />
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
            uni.type === 'PUBLIC'
              ? 'bg-primary/90 text-white'
              : 'bg-white/90 text-black'
          }`}
        >
          {uni.type}
        </span>
      </div>

      <div className='p-4 flex flex-col gap-2'>
        {/* Logo + Name */}
        <div className='flex items-start gap-3'>
          {uni.logoUrl && (
            <div className='w-10 h-10 rounded-lg border border-border bg-background shrink-0 overflow-hidden'>
              <Image
                src={uni.logoUrl}
                alt={uni.nameEn}
                width={40}
                height={40}
                className='object-contain'
              />
            </div>
          )}
          <div className='min-w-0'>
            <h3 className='font-bold text-sm text-foreground leading-snug line-clamp-2'>
              {uni.nameEn}
            </h3>
            <p className='text-xs text-muted-foreground mt-0.5'>
              📍 {uni.locationCity}
            </p>
          </div>
        </div>

        <div className='h-px bg-border' />

        <div className='flex items-center justify-between'>
          <span className='text-xs text-muted-foreground'>
            {uni.durationYears ? `${uni.durationYears} yrs` : '—'}
          </span>
          <span className='text-sm font-bold text-foreground'>
            {uni.tuitionFeeUsd
              ? `$${uni.tuitionFeeUsd.toLocaleString()}/yr`
              : 'Fee varies'}
          </span>
        </div>
      </div>
    </div>
  )
}
