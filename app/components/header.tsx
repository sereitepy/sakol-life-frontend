import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Logo from './logo'

export default function Header() {
  return (
    <div className='py-3 flex items-center justify-between px-5 lg:px-20 max-w-687.5 mx-auto'>
      {/* Logo */}
      <Link href={'/'}>
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

        <Button
          variant='default'
          className='rounded-md text-md font-semibold w-21 h-9'
        >
          Sign Up
        </Button>
        <Button
          variant='ghost'
          className='rounded-md text-md font-semibold w-21 h-9'
        >
          Sign In
        </Button>
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
            </nav>
            <div className='flex flex-col gap-3 mt-auto'>
              <ThemeTogglerButton />
              <Button
                variant='default'
                className='rounded-md font-semibold w-full'
              >
                Sign Up
              </Button>
              <Button
                variant='ghost'
                className='rounded-md font-semibold w-full'
              >
                Sign In
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
