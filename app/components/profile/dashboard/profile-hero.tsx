import { useRouter } from 'next/navigation'
import { MapPin, Pencil } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProfileResponse } from '@/lib/profile/action'

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
    <div className='bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5'>
      {/* Avatar */}
      <div className='relative shrink-0'>
        {profilePictureUrl ? (
          <Image
            src={profilePictureUrl}
            alt={displayName}
            width={64}
            height={64}
            className='w-16 h-16 rounded-full object-cover ring-2 ring-border'
          />
        ) : (
          <div className='w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border'>
            <span className='text-xl font-bold text-primary'>{initials}</span>
          </div>
        )}
        {role === 'ADMIN' && (
          <span className='absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full'>
            ADMIN
          </span>
        )}
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <h1 className='text-xl font-bold text-foreground leading-tight'>
          {displayName}
        </h1>
        <div className='flex items-center gap-1.5 mt-1 text-muted-foreground'>
          <MapPin size={12} />
          <span className='text-xs'>Phnom Penh, Cambodia</span>
        </div>
        {selectedMajor && (
          <div className='mt-2 flex items-center gap-2'>
            <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'>
              🎓 {selectedMajor.nameEn}
            </span>
            {selectedMajor.jobOutlook && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  selectedMajor.jobOutlook === 'HIGH'
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}
              >
                {selectedMajor.jobOutlook} Demand
              </span>
            )}
          </div>
        )}
      </div>

      <Button
        variant='outline'
        size='sm'
        className='shrink-0 gap-1.5 rounded-xl border-border'
        onClick={() => router.push('/profile/settings')}
      >
        <Pencil size={13} /> Edit Profile
      </Button>
    </div>
  )
}
