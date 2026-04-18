import { Camera } from 'lucide-react'
import Image from 'next/image'
import { ProfileResponse } from '@/lib/profile/action'

type Props = {
  displayName: string
  profilePictureUrl: string | null
  role: ProfileResponse['role']
}

export function AvatarUpload({ displayName, profilePictureUrl, role }: Props) {
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className='flex items-center gap-4 mb-6'>
      <div className='relative'>
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
        <button className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer'>
          <Camera size={11} className='text-primary-foreground' />
        </button>
      </div>
      <div>
        <p className='font-bold text-sm text-foreground'>{displayName}</p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          {role === 'ADMIN' ? '🛡️ Administrator' : '👤 Student'}
        </p>
        <p className='text-[10px] text-muted-foreground mt-1'>
          Profile picture upload coming soon
        </p>
      </div>
    </div>
  )
}
