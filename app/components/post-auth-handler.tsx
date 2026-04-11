'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { handlePostAuth } from '@/lib/auth/post-auth'

export function PostAuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams.get('postAuth')) return

    async function run() {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (!session) return

      const createdAt = session.user.created_at
      const lastSignIn = session.user.last_sign_in_at
      const isNewUser =
        createdAt &&
        lastSignIn &&
        Math.abs(
          new Date(createdAt).getTime() - new Date(lastSignIn).getTime()
        ) < 10_000

      await handlePostAuth({
        accessToken: session.access_token,
        displayName: isNewUser
          ? (session.user.user_metadata?.full_name ??
            session.user.email?.split('@')[0] ??
            'User')
          : undefined,
      })

      // ← read saved redirect, then clear it
      const redirectTo = localStorage.getItem('postAuthRedirect') ?? '/'
      localStorage.removeItem('postAuthRedirect')
      router.replace(redirectTo)
    }

    run()
  }, [searchParams, router])

  return null
}
