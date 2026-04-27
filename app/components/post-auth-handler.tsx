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

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) return

      // Still need the session for the access token
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const displayName =
        user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'

      try {
        // return 200 if profile already exists
        await handlePostAuth({
          accessToken: session.access_token,
          displayName,
        })
      } catch (err) {
        console.error('[PostAuthHandler]', err)
      }

      const redirectTo =
        searchParams.get('postAuthRedirect') ??
        localStorage.getItem('postAuthRedirect') ??
        '/'
      localStorage.removeItem('postAuthRedirect')
      router.replace(redirectTo)
    }

    run()
  }, [searchParams, router])

  return null
}
