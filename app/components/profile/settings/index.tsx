// app/components/profile/settings/index.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { ProfileResponse, updateProfile } from '@/lib/profile/action'
import { AvatarUpload } from './avatar-upload'
import { LanguageSection } from './language-section'
import { SecuritySection } from './security-section'
import { AccountSection } from './account-section'

type Props = {
  profile: ProfileResponse
  accessToken: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function SettingsTab({ profile, accessToken }: Props) {
  const t = useTranslations('profile.settings')
  const router = useRouter()

  const [displayName, setDisplayName] = useState(profile.displayName)
  const [profileSaveState, setProfileSaveState] = useState<SaveState>('idle')
  const [pictureUrl, setPictureUrl] = useState(profile.profilePictureUrl)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaveState, setPwSaveState] = useState<SaveState>('idle')
  const [pwError, setPwError] = useState<string | null>(null)

  const profileDirty = displayName !== profile.displayName

  async function handleSaveProfile() {
    setProfileSaveState('saving')
    try {
      await updateProfile(accessToken, { displayName })
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
      setPwError(t('passwordMinLength'))
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError(t('passwordMismatch'))
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
      setPwError(e instanceof Error ? e.message : t('saveError'))
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
    <div className='flex min-h-[calc(100vh-57px)]'>
      {/* ── Main ── */}
      <main className='flex-1 p-[clamp(16px,3vw,48px)] min-w-0'>
        <div className='max-w-[min(1000px,100%)] mx-auto space-y-[clamp(12px,2vw,24px)]'>
          <div>
            <h1 className='text-xl font-bold text-foreground'>
              {t('account-settings')}
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              {t('account-description')}
            </p>
          </div>

          <div className='bg-card border border-border rounded-2xl p-6 space-y-5'>
            <h2 className='text-sm font-bold text-foreground'>
              {t('sectionProfile')}
            </h2>

            <AvatarUpload
              displayName={displayName}
              profilePictureUrl={pictureUrl}
              role={profile.role}
              accessToken={accessToken}
              onUploaded={setPictureUrl}
            />

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                {t('displayName')}
              </label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder={t('displayNamePlaceholder')}
                className='w-full bg-background border border-border rounded-xl h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
              />
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                disabled={!profileDirty || profileSaveState === 'saving'}
                onClick={handleSaveProfile}
                className='inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors'
              >
                {profileSaveState === 'saving' ? (
                  <>
                    <span className='w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin' />
                    {t('saving')}
                  </>
                ) : profileSaveState === 'saved' ? (
                  <>{t('saved')}</>
                ) : (
                  t('saveChanges')
                )}
              </button>
              {profileSaveState === 'error' && (
                <p className='text-xs text-destructive'>{t('saveError')}</p>
              )}
            </div>
          </div>

          <LanguageSection
            preferredLanguage={profile.preferredLanguage}
            accessToken={accessToken}
          />

          <SecuritySection
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            saveState={pwSaveState}
            error={pwError}
            onSave={handleChangePassword}
          />

          {/* ── Account actions card ── */}
          <AccountSection onSignOut={handleSignOut} />
        </div>
      </main>
    </div>
  )
}
