'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

type Props = {
  children: React.ReactNode
}

export default function GuestResultsGuard({ children }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [isGuest, setIsGuest] = useState(false)
  const [hasQuizAnswers, setHasQuizAnswers] = useState(false)
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function checkAuth() {
      const { data, error } = await supabase.auth.getUser()
      if (cancelled) return
      const loggedIn = !error && !!data.user
      setIsGuest(!loggedIn)
      setHasQuizAnswers(!!sessionStorage.getItem('quizAnswers'))
    }

    checkAuth()
    return () => {
      cancelled = true
    }
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isGuest || !hasQuizAnswers) return

      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Always let auth routes through
      if (href.startsWith('/signin') || href.startsWith('/signup')) return

      // Let same-page / hash links through
      if (href.startsWith('#') || href === window.location.pathname) return

      e.preventDefault()
      e.stopPropagation()
      setPendingHref(href)
      setOpen(true)
    },
    [isGuest, hasQuizAnswers]
  )

  // Intercept browser back / forward
  const handlePopState = useCallback(() => {
    if (!isGuest || !hasQuizAnswers) return
    window.history.pushState(null, '', window.location.href)
    setPendingHref('back')
    setOpen(true)
  }, [isGuest, hasQuizAnswers])

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    window.addEventListener('popstate', handlePopState)
    window.history.pushState(null, '', window.location.href)

    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [handleClick, handlePopState])

  // User chose to dismiss and stay on page, keep data
  function handleStay() {
    setOpen(false)
    setPendingHref(null)
  }

  // User chose to leave, so clear data then navigate
  function handleLeave() {
    sessionStorage.removeItem('quizAnswers')
    sessionStorage.removeItem('quizResult')
    setOpen(false)

    startTransition(() => {
      if (pendingHref === 'back') {
        window.history.back()
      } else if (pendingHref) {
        router.push(pendingHref)
      }
    })
  }

  function handleSignIn() {
    setOpen(false)
    startTransition(() => router.push('/signin'))
  }

  function handleSignUp() {
    setOpen(false)
    startTransition(() => router.push('/signup'))
  }

  return (
    <>
      {children}

      <AlertDialog
        open={open}
        onOpenChange={next => {
          if (!next) handleStay()
        }}
      >
        <AlertDialogContent className='max-w-md rounded-xl p-5'>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-3 top-3 h-7 w-7 rounded-sm text-muted-foreground hover:text-foreground'
            onClick={handleStay}
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </Button>

          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 pr-6'>
              <span className='text-xl' aria-hidden='true'>
                ⚠️
              </span>
              Your results will be lost
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm text-muted-foreground leading-relaxed'>
              You haven&apos;t saved your quiz results yet. If you leave this
              page, your recommended majors and all quiz answers will be gone
              forever.
              <br />
              <br />
              Create a free account to keep your results and come back anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
            <AlertDialogCancel
              onClick={handleLeave}
              className='w-full border-border text-muted-foreground sm:w-auto rounded-md'
            >
              Leave anyway
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleSignIn}
              variant='outline'
              className='w-full sm:w-auto rounded-md'
            >
              Sign in
            </AlertDialogAction>

            <AlertDialogAction
              onClick={handleSignUp}
              className='w-full bg-primary text-primary-foreground hover:brightness-110 sm:w-auto'
            >
              Create free account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
