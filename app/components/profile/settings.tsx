'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Save,
  User,
  Globe2,
  Lock,
  LogOut,
  Trash2,
  Camera,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileResponse, updateProfile } from '@/lib/profile/action'
import Image from 'next/image'

type Props = {
  profile: ProfileResponse
  accessToken: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className='bg-card border border-border rounded-2xl p-6'>
      <div className='flex items-center gap-2 mb-5 pb-4 border-b border-border'>
        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
          <Icon size={15} className='text-primary' />
        </div>
        <h3 className='font-bold text-base text-foreground'>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-1.5 mb-4 last:mb-0'>
      <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
        {label}
      </label>
      {children}
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    </div>
  )
}

export default function SettingsTab({ profile, accessToken }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [preferredLanguage, setPreferredLanguage] = useState<'EN' | 'KH'>(
    profile.preferredLanguage
  )
  const [profileSaveState, setProfileSaveState] = useState<SaveState>('idle')

  // Password change (Supabase handles this)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaveState, setPwSaveState] = useState<SaveState>('idle')
  const [pwError, setPwError] = useState<string | null>(null)

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

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

  const profileDirty =
    displayName !== profile.displayName ||
    preferredLanguage !== profile.preferredLanguage

  return (
    <div className='space-y-6 max-w-5xl'>
      <div>
        <h1 className='text-xl font-bold text-foreground'>Account Settings</h1>
        <p className='text-sm text-muted-foreground mt-0.5'>
          Manage your profile information and preferences.
        </p>
      </div>

      {/* Profile info */}
      <SettingsSection title='Profile Information' icon={User}>
        {/* Avatar */}
        <div className='flex items-center gap-4 mb-6'>
          <div className='relative'>
            {profile.profilePictureUrl ? (
              <Image
                src={profile.profilePictureUrl}
                alt={displayName}
                width={64}
                height={64}
                className='w-16 h-16 rounded-full object-cover ring-2 ring-border'
              />
            ) : (
              <div className='w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border'>
                <span className='text-xl font-bold text-primary'>
                  {initials}
                </span>
              </div>
            )}
            <button className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer'>
              <Camera size={11} className='text-primary-foreground' />
            </button>
          </div>
          <div>
            <p className='font-bold text-sm text-foreground'>
              {profile.displayName}
            </p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {profile.role === 'ADMIN' ? '🛡️ Administrator' : '👤 Student'}
            </p>
            <p className='text-[10px] text-muted-foreground mt-1'>
              Profile picture upload coming soon
            </p>
          </div>
        </div>

        <FieldGroup label='Display Name'>
          <Input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder='Your name'
            className='bg-background border-border rounded-xl h-11'
          />
        </FieldGroup>

        <FieldGroup
          label='Preferred Language'
          hint='This affects how content is displayed throughout the app.'
        >
          <div className='flex gap-2'>
            {(['EN', 'KH'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setPreferredLanguage(lang)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  preferredLanguage === lang
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/40'
                }`}
              >
                {lang === 'EN' ? '🇬🇧 English' : '🇰🇭 Khmer'}
              </button>
            ))}
          </div>
        </FieldGroup>

        <div className='pt-2'>
          <Button
            className='gap-2 rounded-xl'
            disabled={!profileDirty || profileSaveState === 'saving'}
            onClick={handleSaveProfile}
          >
            {profileSaveState === 'saving' ? (
              <>
                <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                Saving…
              </>
            ) : profileSaveState === 'saved' ? (
              <>
                <Check size={14} />
                Saved!
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </Button>
          {profileSaveState === 'error' && (
            <p className='text-xs text-destructive mt-2'>
              Failed to save. Please try again.
            </p>
          )}
        </div>
      </SettingsSection>

      {/* Language & region */}
      <SettingsSection title='Language & Region' icon={Globe2}>
        <div className='flex items-center justify-between py-3 border-b border-border'>
          <div>
            <p className='font-semibold text-sm text-foreground'>
              Interface Language
            </p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              Currently: {preferredLanguage === 'EN' ? 'English' : 'Khmer'}
            </p>
          </div>
          <span className='text-2xl'>
            {preferredLanguage === 'EN' ? '🇬🇧' : '🇰🇭'}
          </span>
        </div>
        <div className='flex items-center justify-between py-3'>
          <div>
            <p className='font-semibold text-sm text-foreground'>Region</p>
            <p className='text-xs text-muted-foreground mt-0.5'>Cambodia</p>
          </div>
          <span className='text-2xl'>🇰🇭</span>
        </div>
      </SettingsSection>

      {/* Security */}
      <SettingsSection title='Security' icon={Lock}>
        <FieldGroup label='New Password' hint='Must be at least 8 characters.'>
          <Input
            type='password'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder='Enter new password'
            className='bg-background border-border rounded-xl h-11'
          />
        </FieldGroup>
        <FieldGroup label='Confirm Password'>
          <Input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder='Confirm new password'
            className='bg-background border-border rounded-xl h-11'
          />
        </FieldGroup>

        {pwError && (
          <div className='px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive mb-3'>
            {pwError}
          </div>
        )}

        <Button
          variant='outline'
          className='gap-2 rounded-xl'
          disabled={!newPassword || pwSaveState === 'saving'}
          onClick={handleChangePassword}
        >
          {pwSaveState === 'saving' ? (
            <>
              <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
              Updating…
            </>
          ) : pwSaveState === 'saved' ? (
            <>
              <Check size={14} />
              Password Updated!
            </>
          ) : (
            <>
              <Lock size={14} />
              Update Password
            </>
          )}
        </Button>
      </SettingsSection>

      {/* Danger zone*/}
      <div className='bg-card border border-destructive/30 rounded-2xl p-6'>
        <h3 className='font-bold text-base text-foreground mb-4'>
          Account Actions
        </h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between py-3 border-b border-border'>
            <div>
              <p className='font-semibold text-sm text-foreground'>Sign Out</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Sign out of your account on this device.
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5 rounded-xl'
              onClick={handleSignOut}
            >
              <LogOut size={13} /> Sign Out
            </Button>
          </div>
          <div className='flex items-center justify-between py-3'>
            <div>
              <p className='font-semibold text-sm text-destructive'>
                Delete Account
              </p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Permanently delete your account and all data. This cannot be
                undone.
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10'
              onClick={() => alert('Contact support to delete your account.')}
            >
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
