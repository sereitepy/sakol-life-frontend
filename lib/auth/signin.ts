'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ActionResult =
  | { success: true; accessToken: string; email: string }
  | { success: false; error: string }

export async function signInAction({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<ActionResult> {
  if (!email || !password)
    return { success: false, error: 'Email and password are required.' }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')

  return {
    success: true,
    accessToken: data.session.access_token,
    email: data.user.email ?? '',
  }
}
