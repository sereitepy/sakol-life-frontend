import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileShell from '../components/profile'
import { fetchProfile } from '@/lib/profile/action'
import { fetchDashboardQuizState } from '@/lib/profile/latest-quiz-result'

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
    redirect('/?postAuth=1&postAuthRedirect=/profile')
  }

  const quizState = await fetchDashboardQuizState(accessToken)

  return (
    <ProfileShell
      profile={profile}
      accessToken={accessToken}
      quizState={quizState}
    />
  )
}
