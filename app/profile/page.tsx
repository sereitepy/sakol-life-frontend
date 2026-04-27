import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileShell from '../components/profile'
import { fetchProfile } from '@/lib/profile/action'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/signin')

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const accessToken = session?.access_token
  if (!accessToken) redirect('/signin')

  let profile
  try {
    profile = await fetchProfile(accessToken)
  } catch {
    // Profile doesn't exist yet (first-time user, init still in progress)
    // or backend is temporarily unavailable.
    // Redirect to home with postAuth so PostAuthHandler can init and redirect back.
    redirect('/?postAuth=1&postAuthRedirect=/profile')
  }

  return <ProfileShell profile={profile} accessToken={accessToken} />
}
