// app/components/header/about.tsx
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import Logo from '../logo'
import SignOutButton from '../signout-button'
import AuthLinks from './auth-links'

// 1. Define an interface for the props (if using TypeScript)
interface AboutUsProps {
  user: any; // Replace 'any' with your actual User type if you have one
}

// 2. Pass 'user' as a prop instead of fetching it here
export default function AboutUs({ user }: AboutUsProps) {
  return (
    <div className='py-3 flex items-center justify-between px-5 lg:px-20 max-w-687.5 mx-auto'>
      {/* Logo */}
      <Link href='/'>
        <div className='flex items-center gap-2'>
          <Logo />
          <p className='font-bold text-lg tracking-tight'>Sakol Life</p>
        </div>
      </Link>

      {/* Desktop nav & Auth state usage */}
      <div className="flex items-center gap-4">
        {user ? <SignOutButton /> : <AuthLinks />}
        <ThemeTogglerButton />
      </div>
    </div>
  )
}