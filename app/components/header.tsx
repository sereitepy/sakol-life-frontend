import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Logo from './logo'
import { getUser } from '@/lib/auth'
import { signOutAction } from '@/lib/auth/signout'

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
            <Link href='/signin'>
              <Button
                variant='ghost'
                className='rounded-md text-md font-semibold h-9'
              >
                Sign In
              </Button>
            </Link>
            <Link href='/signup'>
              <Button
                variant='default'
                className='rounded-md text-md font-semibold h-9'
              >
                Sign Up
              </Button>
            </Link>
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
                <form action={signOutAction}>
                  <Button
                    type='submit'
                    variant='ghost'
                    className='rounded-md font-semibold w-full'
                  >
                    Sign Out
                  </Button>
                </form>
              ) : (
                <>
                  <Link href='/signin'>
                    <Button
                      variant='ghost'
                      className='rounded-md font-semibold w-full'
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href='/signup'>
                    <Button
                      variant='default'
                      className='rounded-md font-semibold w-full'
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
