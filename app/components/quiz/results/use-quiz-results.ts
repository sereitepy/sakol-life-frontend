'use client'

import { AuthIdentity } from '@/lib/profile/action'
import { QuizSubmitResponse } from '@/lib/quiz/actions'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getGuestSessionId } from './types'

export function useQuizResults() {
  const router = useRouter()
  const [result, setResult] = useState<QuizSubmitResponse | null>(null)
  const [identity, setIdentity] = useState<AuthIdentity | null>(null)
  const [chosenMajorId, setChosenMajorId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session

      if (session?.user && session.access_token) {
        setIdentity({
          type: 'user',
          userId: session.user.id,
          accessToken: session.access_token,
        })
      } else {
        setIdentity({ type: 'guest', guestSessionId: getGuestSessionId() })
      }

      const stored = sessionStorage.getItem('quizResult')
      if (stored) {
        setResult(JSON.parse(stored))
        const savedMajor = sessionStorage.getItem('chosenMajorId')
        if (savedMajor) setChosenMajorId(savedMajor)
        return
      }

      if (session?.access_token) {
        try {
          const { fetchLatestResults } = await import('@/lib/quiz/actions')
          const dbResult = await fetchLatestResults(session.access_token)
          sessionStorage.setItem('quizResult', JSON.stringify(dbResult))
          setResult(dbResult)
        } catch (err: unknown) {
          if (err instanceof Error && err.message === 'NO_QUIZ_ATTEMPT') {
            router.replace('/quiz')
          } else {
            console.error('Failed to restore quiz results:', err)
            router.replace('/quiz')
          }
        }
      } else {
        router.replace('/quiz')
      }
    })
  }, [router])

  function handleMajorChosen(majorId: string) {
    setChosenMajorId(majorId)
    sessionStorage.setItem('chosenMajorId', majorId)
  }

  function handleMajorDeselected() {
    setChosenMajorId(null)
    sessionStorage.removeItem('chosenMajorId')
    sessionStorage.removeItem('chosenMajorData')
  }

  return {
    result,
    identity,
    chosenMajorId,
    handleMajorChosen,
    handleMajorDeselected,
  }
}
