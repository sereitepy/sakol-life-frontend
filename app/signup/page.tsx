'use client'

import { signUpAction } from '@/lib/auth/signup'
import { signInWithGoogleAction } from '@/lib/auth/oauth'
import { useState, useTransition, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { handlePostAuth } from '@/lib/auth/post-auth'
import { GoogleIcon } from '../components/google-icon'

type Stage = 'form' | 'transitioning' | 'confirmation' | 'confirmed'

export default function SignUpPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, startGoogleTransition] = useTransition()
  const emailRef = useRef<HTMLInputElement>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  // ppoll every 2.5s once we're waiting for email confirmation
  useEffect(() => {
    if (stage !== 'confirmation') return

    const supabase = createClient()

    pollingRef.current = setInterval(async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user?.email_confirmed_at) {
        clearInterval(pollingRef.current!)
        await handlePostAuth({
          accessToken: data.session.access_token,
          displayName: data.session.user.email?.split('@')[0] ?? 'User',
        })
        setStage('confirmed')
      }
    }, 2500)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [stage])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await signUpAction({ email, password })

      if (!result.success) {
        setError(result.error)
        return
      }

      if (result.confirmationRequired) {
        setStage('transitioning')
        setTimeout(() => setStage('confirmation'), 400)
      } else {
        await handlePostAuth({
          accessToken: result.accessToken,
          displayName: result.email.split('@')[0],
        })
        const redirectTo = localStorage.getItem('postAuthRedirect') ?? '/'
        localStorage.removeItem('postAuthRedirect')
        router.push(redirectTo)
        router.refresh()
      }
    })
  }

  function handleGoogle() {
    startGoogleTransition(async () => {
      await signInWithGoogleAction()
    })
  }

  const busy = isPending || isGooglePending

  const visible = 'opacity-100 translate-y-0 pointer-events-auto'
  const hidden = 'opacity-0 translate-y-4 pointer-events-none'
  const exitUp = 'opacity-0 -translate-y-4 pointer-events-none'

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background'>
      {/* ── Form stage ── */}
      <div
        aria-hidden={stage !== 'form' && stage !== 'transitioning'}
        className={`absolute w-full flex items-center justify-center p-6 transition-all duration-350 ease-in-out
          ${stage === 'form' ? visible : ''}
          ${stage === 'transitioning' ? exitUp : ''}
          ${stage === 'confirmation' || stage === 'confirmed' ? hidden : ''}
        `}
      >
        <div className='w-full max-w-100 bg-card text-card-foreground border border-border rounded-(--radius) p-8 flex flex-col gap-5'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-2xl font-bold text-foreground'>
              Create account
            </h1>
            <p className='text-sm text-muted-foreground'>
              Join Sakol Life today
            </p>
          </div>

          <button
            type='button'
            onClick={handleGoogle}
            disabled={busy}
            className='flex items-center justify-center gap-2.5 w-full px-4 py-2.5 bg-background text-foreground border border-border rounded-(--radius) text-sm font-medium cursor-pointer transition-colors hover:bg-accent hover:border-ring disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <GoogleIcon />
            {isGooglePending ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <div className='flex-1 h-px bg-border' />
            <span>or</span>
            <div className='flex-1 h-px bg-border' />
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex flex-col gap-4'
          >
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-foreground'
              >
                Email
              </label>
              <input
                ref={emailRef}
                id='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={busy}
                placeholder='you@example.com'
                className='w-full px-3 py-2.5 text-sm bg-input text-foreground border border-border rounded-(--radius) outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-foreground'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                autoComplete='new-password'
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={busy}
                placeholder='Min. 6 characters'
                className='w-full px-3 py-2.5 text-sm bg-input text-foreground border border-border rounded-(--radius) outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              />
            </div>

            {error && (
              <p
                role='alert'
                className='text-sm text-destructive px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-(--radius)'
              >
                {error}
              </p>
            )}

            <button
              type='submit'
              disabled={busy || !email || !password}
              className='w-full mt-1 px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-(--radius) cursor-pointer transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isPending ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/signin'
              className='text-primary font-medium hover:underline'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* waiting confirmation stage */}
      <div
        aria-hidden={stage !== 'confirmation'}
        className={`absolute w-full flex items-center justify-center p-6 transition-all duration-350 ease-in-out
          ${stage === 'confirmation' ? visible : hidden}
        `}
      >
        <div className='w-full max-w-100 bg-card text-card-foreground border border-border rounded-(--radius) p-8 flex flex-col items-center gap-5 text-center'>
          <span className='text-5xl'>✉</span>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold text-foreground'>
              Check your inbox
            </h1>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              We sent a confirmation link to{' '}
              <strong className='text-foreground font-medium'>{email}</strong>.{' '}
              Click it to activate your account.
            </p>
          </div>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
            Waiting for confirmation…
          </div>
          <p className='text-xs text-muted-foreground'>
            Didn&apos;t get it? Check your spam folder.
          </p>
        </div>
      </div>

      {/* confirmed stage */}
      <div
        aria-hidden={stage !== 'confirmed'}
        className={`absolute w-full flex items-center justify-center p-6 transition-all duration-350 ease-in-out
          ${stage === 'confirmed' ? visible : hidden}
        `}
      >
        <div className='w-full max-w-100 bg-card text-card-foreground border border-border rounded-(--radius) p-8 flex flex-col items-center gap-5 text-center'>
          <div className='w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center'>
            <svg
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-primary'
            >
              <polyline points='20 6 9 17 4 12' />
            </svg>
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold text-foreground'>
              Email confirmed!
            </h1>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Your account is now active. You can safely close this tab or head
              to your dashboard.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className='w-full px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-(--radius) cursor-pointer transition-all hover:brightness-110'
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}


