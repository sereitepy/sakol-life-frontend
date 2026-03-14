// components/ui/cta-button.tsx
'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fetchQuizHistory } from '@/lib/quiz/actions'
import { Button } from '@/components/ui/button'

type CTAState = 'loading' | 'dashboard' | 'quiz'

export default function CTAButton() {
  const router = useRouter()
  const [state, setState] = useState<CTAState>('loading')
  const [, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function resolve() {
      const { data, error } = await supabase.auth.getUser()
      if (cancelled) return

      const isLoggedIn = !error && !!data.user

      if (!isLoggedIn) {
        // Guest — button is always "Get Personal Package"
        setState('quiz')
        return
      }

      // Logged in — check sessionStorage first (fast path)
      const hasLocalResult = !!sessionStorage.getItem('quizResult')
      if (hasLocalResult) {
        setState('dashboard')
        return
      }

      // sessionStorage is empty (e.g. browser was closed) — ask the API
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
        // If the history call fails, default to showing the quiz CTA
        if (!cancelled) setState('quiz')
      }
    }

    resolve()
    return () => {
      cancelled = true
    }
  }, [])

  function handleClick() {
    startTransition(() => {
      if (state === 'dashboard') {
        router.push('/profile')
      } else {
        const hasResults = !!sessionStorage.getItem('quizResult')
        router.push(hasResults ? '/quiz/results' : '/quiz')
      }
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={state === 'loading'}
      className='w-full sm:w-fit rounded-md text-md h-12 px-4 font-bold'
    >
      {state === 'loading' && (
        <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2' />
      )}
      {state === 'dashboard' ? 'Go to your Dashboard' : 'Get Personal Package'}
    </Button>
  )
}
