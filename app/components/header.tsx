'use client'

import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import Logo from './logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, Palette, Settings } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export default function Header() {
  return (
    <div className='p-5 flex items-center justify-between'>
      {/* Logo */}
      <div className='flex items-center gap-2'>
        <Logo />
        <p className='font-bold text-lg tracking-tight'>Sakol Life</p>
      </div>

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
