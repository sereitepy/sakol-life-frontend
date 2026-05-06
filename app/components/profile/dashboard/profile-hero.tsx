'use client'

import { useRouter } from 'next/navigation'
import { Pencil, MapPin, MonitorSmartphone } from 'lucide-react'
import Image from 'next/image'
import { ProfileResponse } from '@/lib/profile/action'
import { Button } from '@/components/ui/button'

type Props = {
  displayName: string
  profilePictureUrl: string | null
  selectedMajor: ProfileResponse['selectedMajor']
  role: ProfileResponse['role']
}

export function ProfileHero({
  displayName,
  profilePictureUrl,
  selectedMajor,
  role,
}: Props) {
  const router = useRouter()

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className='glass-panel rounded-xl border border-white/10 p-[clamp(14px,2vw,24px)] flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md'>
      {/* Avatar */}
      <div className='flex items-center gap-4 w-full sm:w-auto'>
        <div className='relative shrink-0'>
          {profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt={displayName}
              width={64}
              height={64}
              className='w-16 h-16 rounded-full object-cover ring-2 ring-primary/30'
            />
          ) : (
            <div
              className='w-[clamp(52px,5vw,72px)] h-[clamp(52px,5vw,72px)] rounded-full 
  bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0'
            >
              <span className='text-[clamp(16px,2vw,22px)] font-bold text-primary'>
                {initials}
              </span>
            </div>
          )}
          {/* Verified / role badge */}
          <span
            className='absolute -bottom-1 -right-1 bg-primary text-primary-foreground 
  text-[9px] font-extrabold px-1.5 py-0.5 pt-1 rounded-full'
          >
            {role === 'ADMIN' ? 'ADMIN' : 'USER'}
          </span>
        </div>
        {/* On mobile, show name inline with avatar */}
        <div className='flex-1 sm:hidden min-w-0'>
          <h1 className='text-[clamp(15px,2vw,22px)] font-bold text-on-surface truncate'>
            {displayName}
          </h1>
          <div className='flex items-center gap-3 text-xs text-on-surface-variant flex-wrap mt-1'>
            <span className='flex items-center gap-1'>
              <MapPin size={11} />
              Phnom Penh
            </span>
            {selectedMajor && (
              <span className='flex items-center gap-1'>
                <MonitorSmartphone size={11} />
                {selectedMajor.nameEn}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Info */}
      <div className='hidden sm:flex flex-1 min-w-0 flex-col'>
        <div className='flex items-center gap-2 flex-wrap mb-1'>
          <h1 className='text-[clamp(16px,2vw,22px)] font-bold text-on-surface'>
            {displayName}
          </h1>

          {selectedMajor?.jobOutlook && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                selectedMajor.jobOutlook === 'HIGH'
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              {selectedMajor.jobOutlook} Demand
            </span>
          )}
        </div>

        <div className='flex items-center gap-4 text-sm text-on-surface-variant flex-wrap'>
          <span className='flex items-center gap-1'>
            <MapPin size={12} />
            Phnom Penh, Cambodia
          </span>
          {selectedMajor && (
            <span className='flex items-center gap-1'>
              <MonitorSmartphone size={12} />
              {selectedMajor.nameEn}
            </span>
          )}
        </div>
      </div>

      {/* Edit button */}
      <Button
        variant='outline'
        onClick={() => router.push('/profile/settings')}
        className='w-full sm:w-auto flex items-center justify-center gap-1.5
      px-4 py-2 rounded-lg border border-border text-on-surface
      text-sm font-semibold hover:bg-white/5 hover:border-primary/30 transition-all shrink-0'
      >
        <Pencil size={13} />
        Edit Profile
      </Button>
    </div>
  )
}
