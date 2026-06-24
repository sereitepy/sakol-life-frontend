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
import { useTranslations } from 'next-intl'

type CTAState = 'loading' | 'quiz' | 'results'

export default function CTAButton() {
  const router = useRouter()
  const [state, setState] = useState<CTAState>('loading')
  const [showDialog, setShowDialog] = useState(false)
  const [, startTransition] = useTransition()
  const [isPending, setIsPending] = useState(false)
  
  const t = useTranslations('homepages')
  const tDialog = useTranslations('quiz_alert_dialog')

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function resolve() {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return

      const session = data.session

      if (!session) {
        setState('quiz')
        return
      }

      if (sessionStorage.getItem('quizResult')) {
        setState('results')
        return
      }

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
        className='w-full sm:w-fit rounded-md text-md h-12 px-4 font-bold cursor-pointer'
      >
        {state === 'loading' && (
          <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2' />
        )}
        {state === 'results' ? t('button-result') : t('button-1')}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className='max-w-md rounded-xl p-5'>
          <AlertDialogCancel className='w-0 border-0 m-0 p-0 absolute right-2 rounded-lg top-1 hover:bg-transparent cursor-pointer'>
            <X />
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-foreground font-bold tracking-tight'>
              {tDialog('title')}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm text-muted-foreground leading-relaxed'>
              {tDialog('description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col gap-2 sm:flex-row mt-4'>
            <AlertDialogCancel
              onClick={handleRetake}
              className='w-full sm:w-auto border-secondary-foreground/30 cursor-pointer font-semibold'
            >
              {tDialog('btn_start_fresh')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleViewResults}
              className='w-full sm:w-auto rounded-md cursor-pointer font-semibold'
            >
              {tDialog('btn_view_results')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}