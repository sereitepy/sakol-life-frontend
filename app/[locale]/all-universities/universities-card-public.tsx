import { Button } from '@/components/ui/button'
import { PublicUniversity } from '@/lib/view/view-all'
import Image from 'next/image'

export default function UniversityCardPublic({
  uni,
  onClick,
  onViewMajors,
}: {
  uni: PublicUniversity
  onClick: () => void
  onViewMajors: () => void
}) {
  return (
    <div className='bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col'>
      
      {/* Banner */}
      <div
        className='relative h-28 bg-muted overflow-hidden cursor-pointer group'
        onClick={onClick}
      >
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
          className={`absolute top-2.5 left-3 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
            uni.type === 'PUBLIC'
              ? 'bg-primary/90 text-white'
              : 'bg-white/90 text-black'
          }`}
        >
          {uni.type}
        </span>
      </div>

      <div className='p-4 flex flex-col gap-3 flex-1'>
        {/* Logo + Name */}
        <div
          className='flex items-start gap-3 cursor-pointer'
          onClick={onClick}
        >
          {uni.logoUrl && (
            <div className='w-9 h-9 rounded-lg border border-border bg-background shrink-0 overflow-hidden'>
              <Image
                src={uni.logoUrl}
                alt={uni.nameEn}
                width={36}
                height={36}
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

        {/* Actions */}
        <div className='flex gap-2 mt-auto'>
          <Button
            onClick={onClick}
            className='flex-1 text-xs font-semibold py-2 rounded-lg border border-border   transition-colors cursor-pointer'
          >
            View Details
          </Button>
          {/* <button
            onClick={onViewMajors}
            className='flex-1 text-xs font-semibold py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center gap-1'
          >
            View Majors <ExternalLink size={11} />
          </button> */}
        </div>
      </div>
    </div>
  )
}
