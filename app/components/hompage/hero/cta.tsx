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
import { X } from 'lucide-react'

type CTAState = 'loading' | 'quiz' | 'results'

export default function CTAButton() {
  const router = useRouter()
  const [state, setState] = useState<CTAState>('loading')
  const [showDialog, setShowDialog] = useState(false)
  const [, startTransition] = useTransition()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function resolve() {
      // Single call — getSession includes user info and token together
      const { data } = await supabase.auth.getSession()
      if (cancelled) return

      const session = data.session

      if (!session) {
        setState('quiz')
        return
      }

      // Logged in — check sessionStorage first (instant, no network)
      if (sessionStorage.getItem('quizResult')) {
        setState('results')
        return
      }

      // Fall back to API only if sessionStorage is empty
      try {
        const history = await fetchQuizHistory(session.access_token)
        if (cancelled) return
        setState(history.totalAttempts > 0 ? 'results' : 'quiz')
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
  if (state === 'results') {
    const hasPreviousResults = !!sessionStorage.getItem('quizResult')
    if (hasPreviousResults) {
      setShowDialog(true)
      return
    }
    setIsPending(true)
    startTransition(() => router.push('/quiz/results'))
    return
  }

  if (sessionStorage.getItem('quizResult')) {
    setShowDialog(true)
    return
  }

  setIsPending(true)
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
        {state === 'results' ? 'View My Results' : 'Get Personal Package'}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className='max-w-md rounded-xl p-5'>
          <AlertDialogCancel className='w-0 border-0 m-0 p-0 absolute right-2 rounded-lg top-1 hover:bg-transparent'>
            <X />
          </AlertDialogCancel>
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
              className='w-full sm:w-auto border-secondary-foreground/30'
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
