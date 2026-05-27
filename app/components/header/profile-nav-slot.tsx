'use client'

import { usePathname } from 'next/navigation'
import ProfileNav from './profile-nav'

export default function ProfileNavSlot() {
  const pathname = usePathname()
  if (!pathname.includes('/profile')) return null
  return (
      <div className='max-w-400 mx-auto lg:px-6'>
        <ProfileNav />
      </div>
  )
}
