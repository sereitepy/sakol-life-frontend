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

  const session = await supabase.auth.getSession()
  const accessToken = session.data.session?.access_token
  if (!accessToken) redirect('/signin')

  const profile = await fetchProfile(accessToken)
  return <ProfileShell profile={profile} accessToken={accessToken} />
}
