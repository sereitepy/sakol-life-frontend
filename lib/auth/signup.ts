'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; confirmationRequired: true }
  | {
      success: true
      confirmationRequired: false
      accessToken: string
      email: string
    }
  | { success: false; error: string }

export async function signUpAction({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<ActionResult> {
  if (!email || !password)
    return { success: false, error: 'Email and password are required.' }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')

  // Session present = email confirmation is OFF
  if (data.session) {
    return {
      success: true,
      confirmationRequired: false,
      accessToken: data.session.access_token,
      email: data.user?.email ?? '',
    }
  }

  // Confirmation email sent
  return { success: true, confirmationRequired: true }
}
