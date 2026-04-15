import { Save, Check, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsSection, FieldGroup } from './settings-section'
import { AvatarUpload } from './avatar-upload'
import { ProfileResponse } from '@/lib/profile/action'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type Props = {
  displayName: string
  setDisplayName: (v: string) => void
  preferredLanguage: 'EN' | 'KH'
  setPreferredLanguage: (v: 'EN' | 'KH') => void
  profileDirty: boolean
  saveState: SaveState
  onSave: () => void
  profile: ProfileResponse
}

export function ProfileForm({
  displayName,
  setDisplayName,
  preferredLanguage,
  setPreferredLanguage,
  profileDirty,
  saveState,
  onSave,
  profile,
}: Props) {
  return (
    <SettingsSection title='Profile Information' icon={User}>
      <AvatarUpload
        displayName={displayName}
        profilePictureUrl={profile.profilePictureUrl}
        role={profile.role}
      />

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
          disabled={!profileDirty || saveState === 'saving'}
          onClick={onSave}
        >
          {saveState === 'saving' ? (
            <>
              <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin' />{' '}
              Saving…
            </>
          ) : saveState === 'saved' ? (
            <>
              <Check size={14} /> Saved!
            </>
          ) : (
            <>
              <Save size={14} /> Save Changes
            </>
          )}
        </Button>
        {saveState === 'error' && (
          <p className='text-xs text-destructive mt-2'>
            Failed to save. Please try again.
          </p>
        )}
      </div>
    </SettingsSection>
  )
}
