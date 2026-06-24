// About Page 
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

// Fixed absolute imports using your alias
import Logo from '@/app/components/logo'
import SignOutButton from '@/app/components/signout-button'
import AuthLinks from '@/app/components/header/auth-links'

import AboutContent from '@/components/about/index'

export default function About() {
  return (
    <main className="min-h-screen">
      <AboutContent />
    </main>
  )
}