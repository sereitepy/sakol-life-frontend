'use client'

import { signInWithGoogleAction } from '@/lib/auth/oauth'
import { handlePostAuth } from '@/lib/auth/post-auth'
import { signInAction } from '@/lib/auth/signin'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState, useTransition } from 'react'
import { GoogleIcon } from '../components/google-icon'

function SignInContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState(() => searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, startGoogleTransition] = useTransition()
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await signInAction({ email, password })
      if (!result.success) {
        setError(result.error)
        return
      }
      // merge any guest quiz answers into the signed-in account
      await handlePostAuth({ accessToken: result.accessToken })
      const redirectTo = localStorage.getItem('postAuthRedirect') ?? '/'
      localStorage.removeItem('postAuthRedirect')
      router.push(redirectTo)
      router.refresh()
    })
  }

  function handleGoogle() {
    startGoogleTransition(async () => {
      await signInWithGoogleAction()
    })
  }

  const busy = isPending || isGooglePending

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background p-6'>
      <div className='w-full max-w-100 bg-card text-card-foreground border border-border rounded-(--radius) p-8 flex flex-col gap-5'>
        {/* Header */}
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold text-foreground'>Welcome back</h1>
          <p className='text-sm text-muted-foreground'>
            Sign in to your account
          </p>
        </div>

        {/* Google */}
        <button
          type='button'
          onClick={handleGoogle}
          disabled={busy}
          className='flex items-center justify-center gap-2.5 w-full px-4 py-2.5 bg-background text-foreground border border-border rounded-(--radius) text-sm font-medium cursor-pointer transition-colors hover:bg-accent hover:border-ring disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <GoogleIcon />
          {isGooglePending ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {/* divider */}
        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
          <div className='flex-1 h-px bg-border' />
          <span>or</span>
          <div className='flex-1 h-px bg-border' />
        </div>

        {/* form */}
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
              autoComplete='current-password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={busy}
              placeholder='Your password'
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
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link
            href='/signup'
            className='text-primary font-medium hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}