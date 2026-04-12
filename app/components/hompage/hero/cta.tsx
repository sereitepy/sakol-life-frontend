'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fetchQuizHistory } from '@/lib/quiz/actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

type CTAState = 'loading' | 'dashboard' | 'quiz'

export default function CTAButton() {
  const router = useRouter()
  const [state, setState] = useState<CTAState>('loading')
  const [showDialog, setShowDialog] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function resolve() {
      const { data, error } = await supabase.auth.getUser()
      if (cancelled) return

      const isLoggedIn = !error && !!data.user

      if (!isLoggedIn) {
        setState('quiz')
        return
      }

      const hasLocalResult = !!sessionStorage.getItem('quizResult')
      if (hasLocalResult) {
        setState('dashboard')
        return
      }

      try {
        const session = await supabase.auth.getSession()
        const accessKey = session.data.session?.access_token
        if (!accessKey) {
          setState('quiz')
          return
        }

        const history = await fetchQuizHistory(accessKey)
        if (cancelled) return
        setState(history.totalAttempts > 0 ? 'dashboard' : 'quiz')
      } catch {
        if (!cancelled) setState('quiz')
      }
    }

    resolve()
    return () => {
      cancelled = true
    }
  }, [])

  function handleClick() {
    if (state === 'dashboard') {
      startTransition(() => router.push('/profile'))
      return
    }

    // Guest with previous results — show dialog
    const hasPreviousResults = !!sessionStorage.getItem('quizResult')
    if (hasPreviousResults) {
      setShowDialog(true)
      return
    }

    // No previous results — go straight to quiz
    startTransition(() => router.push('/quiz'))
  }

  function handleViewResults() {
    setShowDialog(false)
    startTransition(() => router.push('/quiz/results'))
  }

  function handleRetake() {
    sessionStorage.removeItem('quizResult')
    sessionStorage.removeItem('chosenMajorId')
    sessionStorage.removeItem('chosenMajorData')
    setShowDialog(false)
    startTransition(() => router.push('/quiz'))
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={state === 'loading'}
        className='w-full sm:w-fit rounded-md text-md h-12 px-4 font-bold'
      >
        {state === 'loading' && (
          <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2' />
        )}
        {state === 'dashboard'
          ? 'Go to your Dashboard'
          : 'Get Personal Package'}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className='max-w-md rounded-xl p-5'>
          <AlertDialogHeader>
            <AlertDialogTitle>You have a previous assessment</AlertDialogTitle>
            <AlertDialogDescription className='text-sm text-muted-foreground leading-relaxed'>
              You&apos;ve already completed a major recommendation assessment.
              Would you like to review your results, or start a fresh
              assessment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
            <AlertDialogCancel
              onClick={handleRetake}
              className='w-full sm:w-auto rounded-md'
            >
              Start fresh
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleViewResults}
              className='w-full sm:w-auto rounded-md'
            >
              View my results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
