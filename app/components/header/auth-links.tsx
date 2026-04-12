'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const PROTECTED_PATHS = ['/quiz/results'] // add more paths here if needed

export default function AuthLinks({ mobile }: { mobile?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleAuth(dest: '/signin' | '/signup') {
    if (PROTECTED_PATHS.includes(pathname)) {
      localStorage.setItem('postAuthRedirect', pathname)
    }
    router.push(dest)
  }

  if (mobile) {
    return (
      <>
        <Button
          variant='ghost'
          className='rounded-md font-semibold w-full'
          onClick={() => handleAuth('/signin')}
        >
          Sign In
        </Button>
        <Button
          variant='default'
          className='rounded-md font-semibold w-full'
          onClick={() => handleAuth('/signup')}
        >
          Sign Up
        </Button>
      </>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        className='rounded-md text-md font-semibold h-9'
        onClick={() => handleAuth('/signin')}
      >
        Sign In
      </Button>
      <Button
        variant='default'
        className='rounded-md text-md font-semibold h-9'
        onClick={() => handleAuth('/signup')}
      >
        Sign Up
      </Button>
    </div>
  )
}
