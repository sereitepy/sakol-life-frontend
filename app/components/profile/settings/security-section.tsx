import { Lock, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

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

export function SecuritySection({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  saveState,
  error,
  onSave,
}: Props) {
  const t = useTranslations('profile.settings')

  return (
    <div className='bg-card border border-border rounded-2xl p-6 space-y-5'>
      <div>
        <h2 className='text-sm font-bold text-foreground'>
          {t('sectionSecurity')}
        </h2>
        <p className='text-xs text-muted-foreground mt-1'>
          {t('sectionSecurityDesc')}
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
            {t('newPassword')}
          </label>
          <input
            type='password'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder={t('newPasswordPlaceholder')}
            className='w-full bg-background border border-border rounded-xl h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
          />
          <p className='text-[11px] text-muted-foreground'>
            {t('newPasswordHint')}
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
            {t('confirmPassword')}
          </label>
          <input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder={t('confirmPasswordPlaceholder')}
            className='w-full bg-background border border-border rounded-xl h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
          />
        </div>
      </div>

      {error && (
        <div className='px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive'>
          {error}
        </div>
      )}

      <button
        type='button'
        disabled={!newPassword || saveState === 'saving'}
        onClick={onSave}
        className='inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-background text-sm font-semibold text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50 transition-colors'
      >
        {saveState === 'saving' ? (
          <>
            <span className='w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin' />
            {t('updatingPassword')}
          </>
        ) : saveState === 'saved' ? (
          <>
            <Check size={14} className='text-primary' />
            {t('passwordUpdated')}
          </>
        ) : (
          <>
            <Lock size={14} />
            {t('updatePassword')}
          </>
        )}
      </button>
    </div>
  )
}
