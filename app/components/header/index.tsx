import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getUser } from '@/lib/auth'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Logo from '../logo'
import SignOutButton from '../signout-button'
import AuthLinks from './auth-links'

export default async function Header() {
  const user = await getUser()

  return (
    <div className='py-3 flex items-center justify-between px-5 lg:px-20 max-w-687.5 mx-auto'>
      {/* Logo */}
      <Link href='/'>
        <div className='flex items-center gap-2'>
          <Logo />
          <p className='font-bold text-lg tracking-tight'>Sakol Life</p>
        </div>
      </Link>

      {/* Desktop nav */}
      <section className='hidden md:flex items-center gap-5'>
        <Link href='#' className='underline-animate font-semibold'>
          About Us
        </Link>

        {user ? (
          <div className='flex items-center gap-3'>
            <Link href='/profile'>
              <Avatar>
                <AvatarImage
                  src={user.user_metadata?.avatar_url ?? ''}
                  alt={user.email ?? 'Profile'}
                />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <AuthLinks />
          </div>
        )}
      </section>

      {/* Mobile nav */}
      <div className='flex items-center gap-3 md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <button>
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side='right' className='flex flex-col gap-6 pt-12 p-5'>
            <SheetTitle>Navigation Menu</SheetTitle>
            <nav className='flex flex-col gap-4'>
              <Link
                href='#'
                className='underline-animate font-semibold text-lg w-fit'
              >
                About Us
              </Link>
              {user && (
                <Link
                  href='/profile'
                  className='underline-animate font-semibold text-lg w-fit'
                >
                  Profile
                </Link>
              )}
            </nav>
            <div className='flex flex-col gap-3 mt-auto'>
              <ThemeTogglerButton suppressHydrationWarning />
              {user ? (
                <SignOutButton className='rounded-md font-semibold w-full' />
              ) : (
                <>
                  <AuthLinks mobile />
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
