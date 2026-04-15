'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProfileResponse, updateProfile } from '@/lib/profile/action'
import { ProfileForm } from './profile-form'
import { LanguageRegion } from './language-region'
import { PasswordForm } from './password-form'
import { DangerZone } from './danger-zone'

type Props = {
  profile: ProfileResponse
  accessToken: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function SettingsTab({ profile, accessToken }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [preferredLanguage, setPreferredLanguage] = useState<'EN' | 'KH'>(
    profile.preferredLanguage
  )
  const [profileSaveState, setProfileSaveState] = useState<SaveState>('idle')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaveState, setPwSaveState] = useState<SaveState>('idle')
  const [pwError, setPwError] = useState<string | null>(null)

  const profileDirty =
    displayName !== profile.displayName ||
    preferredLanguage !== profile.preferredLanguage

  async function handleSaveProfile() {
    setProfileSaveState('saving')
    try {
      await updateProfile(accessToken, { displayName, preferredLanguage })
      setProfileSaveState('saved')
      setTimeout(() => setProfileSaveState('idle'), 2000)
    } catch {
      setProfileSaveState('error')
      setTimeout(() => setProfileSaveState('idle'), 3000)
    }
  }

  async function handleChangePassword() {
    setPwError(null)
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }

    setPwSaveState('saving')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      setPwSaveState('saved')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPwSaveState('idle'), 2000)
    } catch (e: unknown) {
      setPwError(e instanceof Error ? e.message : 'Failed to update password.')
      setPwSaveState('error')
      setTimeout(() => setPwSaveState('idle'), 3000)
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className='space-y-6 max-w-5xl'>
      <div>
        <h1 className='text-xl font-bold text-foreground'>Account Settings</h1>
        <p className='text-sm text-muted-foreground mt-0.5'>
          Manage your profile information and preferences.
        </p>
      </div>

      <ProfileForm
        displayName={displayName}
        setDisplayName={setDisplayName}
        preferredLanguage={preferredLanguage}
        setPreferredLanguage={setPreferredLanguage}
        profileDirty={profileDirty}
        saveState={profileSaveState}
        onSave={handleSaveProfile}
        profile={profile}
      />

      <LanguageRegion preferredLanguage={preferredLanguage} />

      <PasswordForm
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        saveState={pwSaveState}
        error={pwError}
        onSave={handleChangePassword}
      />

      <DangerZone onSignOut={handleSignOut} />
    </div>
  )
}
