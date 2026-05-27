'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function deleteAccountAction(): Promise<{ error?: string }> {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Not authenticated' }
  }

  const { user, access_token } = session

  // ── Step 1: Delete profile row from Spring Boot backend ──────────────────
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
  if (!apiUrl) {
    console.error('[deleteAccountAction] NEXT_PUBLIC_BACKEND_URL is not set')
    return { error: 'Server misconfiguration. Please contact support.' }
  }

  let backendRes: Response
  try {
    backendRes = await fetch(`${apiUrl}/api/v1/profile/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${access_token}` },
    })
  } catch (e) {
    console.error('[deleteAccountAction] Backend unreachable:', e)
    return { error: 'Could not reach the server. Please try again.' }
  }

  if (!backendRes.ok && backendRes.status !== 404) {
    const text = await backendRes.text()
    console.error(
      `[deleteAccountAction] Backend delete failed (${backendRes.status}):`,
      text
    )
    return { error: 'Failed to delete profile data. Please contact support.' }
  }

  // ── Step 2: Delete Supabase auth user via admin client ───────────────────
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      '[deleteAccountAction] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    )
    return { error: 'Server misconfiguration. Please contact support.' }
  }

  const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    user.id
  )

  if (deleteError) {
    console.error(
      '[deleteAccountAction] Supabase admin delete failed:',
      deleteError
    )
    return { error: deleteError.message }
  }

  await supabase.auth.signOut()
  redirect('/')
}
