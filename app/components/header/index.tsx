import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile/action' // ← add this server-side fetch
import { Menu } from 'lucide-react'
import Link from 'next/link' 
<Link href="/about">About</Link>
import Logo from '../logo'
import SignOutButton from '../signout-button'
import AuthLinks from './auth-links'
import ProfileNavSlot from './profile-nav-slot'
import { useTranslations } from 'next-intl'

/**
 * Fetches the profile from Spring Boot so the avatar in the header
 * shows the user's uploaded Cloudinary photo rather than the OAuth
 * provider photo from Supabase metadata.
 *
 * Falls back gracefully: Supabase avatar_url → email initial.
 */


function Translation() {
  const t = useTranslations("header")
  return <div>{t('about-us')}</div>
}

export default async function Header() {
  const user = await getUser()

  // Fetch our own profile picture (Cloudinary URL) if user is logged in
  let profilePictureUrl: string | null = null
  if (user) {
    try {
      const sessionRes = await import('@/lib/supabase/server').then(m =>
        m.createClient()
      )
      const {
        data: { session },
      } = await (await sessionRes).auth.getSession()
      if (session?.access_token) {
        const profile = await getProfile(session.access_token)
        profilePictureUrl = profile?.profilePictureUrl ?? null
      }
    } catch {
      // Non-fatal — fall back to Supabase metadata
    }
  }

  // Resolve the best avatar URL: our Cloudinary upload → OAuth provider photo → nothing
  const avatarSrc = profilePictureUrl || user?.user_metadata?.avatar_url || ''

  const avatarFallback = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <>
      <div className='py-3 flex items-center justify-between px-5 lg:px-20 max-w-687.5 mx-auto'>
        {/* Logo */}
        <Link href='/'>
          <div className='flex items-center gap-2'>
            <Logo />
            <p className='font-bold text-sm md:text-lg tracking-tight'>
              Sakol Life
            </p>
          </div>
        </Link>

        <div className='hidden md:flex items-center gap-5'>
          <ProfileNavSlot />
        </div>

        {/* Desktop nav */}
        <section className='hidden md:flex items-center gap-5'>
          <Link href='/all-majors' className='underline-animate font-semibold'>
            All Majors
          </Link>
          <Link href='/all-universities' className='underline-animate font-semibold'>
            All Universities
          </Link>
          <Link href='#' className='underline-animate font-semibold'>
            <Translation />
          </Link>
          {user ? (
            <div className='flex items-center gap-3'>
              <Link href='/profile'>
                <Avatar className='ring-2 ring-border hover:ring-primary/50 transition-all'>
                  <AvatarImage src={avatarSrc} alt={user.email ?? 'Profile'} />
                  <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                    {avatarFallback}
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
          <ProfileNavSlot />
          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='flex flex-col gap-6 pt-12 p-5'
            >
              <SheetTitle>Navigation Menu</SheetTitle>

              {/* Mobile avatar */}
              {user && (
                <Link href='/profile' className='flex items-center gap-3'>
                  <Avatar className='ring-2 ring-border'>
                    <AvatarImage
                      src={avatarSrc}
                      alt={user.email ?? 'Profile'}
                    />
                    <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>
                      {user.user_metadata?.full_name ?? user.email}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      View profile
                    </p>
                  </div>
                </Link>
              )}

              <nav className='flex flex-col gap-4'>
                <Link
                  href='#'
                  className='underline-animate font-semibold text-lg w-fit'
                >
                  <Translation />
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
                  <AuthLinks mobile />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
