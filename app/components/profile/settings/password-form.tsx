import { Lock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsSection, FieldGroup } from './settings-section'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type Props = {
  newPassword: string
  setNewPassword: (v: string) => void
  confirmPassword: string
  setConfirmPassword: (v: string) => void
  saveState: SaveState
  error: string | null
  onSave: () => void
}

export function PasswordForm({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  saveState,
  error,
  onSave,
}: Props) {
  return (
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

      {error && (
        <div className='px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive mb-3'>
          {error}
        </div>
      )}

      <Button
        variant='outline'
        className='gap-2 rounded-xl'
        disabled={!newPassword || saveState === 'saving'}
        onClick={onSave}
      >
        {saveState === 'saving' ? (
          <>
            <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin' />{' '}
            Updating…
          </>
        ) : saveState === 'saved' ? (
          <>
            <Check size={14} /> Password Updated!
          </>
        ) : (
          <>
            <Lock size={14} /> Update Password
          </>
        )}
      </Button>
    </SettingsSection>
  )
}
