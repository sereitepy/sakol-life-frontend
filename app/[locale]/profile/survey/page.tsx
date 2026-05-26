import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchProfile } from '@/lib/profile/action'
import SurveyContent from '../../../components/profile/survey/survey-content'

export default async function SurveyPage() {
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
    redirect('/?postAuth=1&postAuthRedirect=/profile/survey')
  }

  return <SurveyContent profile={profile} />
}
