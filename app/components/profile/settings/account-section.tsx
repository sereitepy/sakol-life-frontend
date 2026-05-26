'use client'

import { useState } from 'react'
import { LogOut, Trash2, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { deleteAccountAction } from '@/lib/auth/delete-account'
import SignOutButton from '../../signout-button'

type Props = { onSignOut: () => void }
type DeleteStep = 'idle' | 'confirming' | 'deleting' | 'error'

export function AccountSection({ onSignOut }: Props) {
  const t = useTranslations('profile.settings')
  const [deleteStep, setDeleteStep] = useState<DeleteStep>('idle')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const canDelete = confirmText === 'DELETE'

  async function handleDelete() {
    if (!canDelete) return
    setDeleteStep('deleting')
    setDeleteError(null)
    const result = await deleteAccountAction()
    if (result?.error) {
      setDeleteError(result.error)
      setDeleteStep('error')
      setTimeout(() => setDeleteStep('confirming'), 4000)
    }
  }

  function resetDelete() {
    setDeleteStep('idle')
    setDeleteError(null)
    setConfirmText('')
  }

  return (
    <div className='bg-card border border-border rounded-2xl p-6 space-y-4'>
      <h2 className='text-sm font-bold text-foreground'>
        {t('sectionAccount')}
      </h2>

      {/* Sign out row */}
      <div className='flex items-center justify-between py-3 border-b border-border'>
        <div>
          <p className='text-sm font-semibold text-foreground'>
            {t('signOut')}
          </p>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {t('signOutDescription')}
          </p>
        </div>
        <SignOutButton className='inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors shrink-0' />
        
      </div>

      {/* Delete row */}
      <div>
        <div className='flex items-center justify-between py-1'>
          <div>
            <p className='text-sm font-semibold text-destructive'>
              {t('deleteAccount')}
            </p>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('deleteAccountDescription')}
            </p>
          </div>
          {deleteStep === 'idle' && (
            <button
              type='button'
              onClick={() => setDeleteStep('confirming')}
              className='inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl border border-destructive/40 bg-background text-xs font-semibold text-destructive hover:bg-destructive/8 transition-colors shrink-0'
            >
              <Trash2 size={13} /> {t('delete')}
            </button>
          )}
        </div>

        {deleteStep !== 'idle' && (
          <div className='mt-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4 space-y-4'>
            <div className='flex items-start gap-3'>
              <AlertTriangle
                size={16}
                className='text-destructive mt-0.5 shrink-0'
              />
              <div>
                <p className='text-sm font-bold text-foreground'>
                  {t('deleteAccountConfirmTitle')}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {t('deleteAccountConfirmDescription')}
                </p>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                {t('deleteTypeToConfirm')}
              </label>
              <input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder='DELETE'
                disabled={deleteStep === 'deleting'}
                className='w-full bg-background border border-destructive/30 focus:border-destructive rounded-xl h-10 px-3 text-sm font-mono tracking-wider text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/20 transition-colors'
              />
            </div>

            {deleteError && (
              <p className='text-xs text-destructive'>{deleteError}</p>
            )}

            <div className='flex gap-2'>
              <button
                type='button'
                disabled={deleteStep === 'deleting'}
                onClick={resetDelete}
                className='flex-1 h-9 rounded-xl border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50'
              >
                {t('deleteAccountCancel')}
              </button>
              <button
                type='button'
                disabled={!canDelete || deleteStep === 'deleting'}
                onClick={handleDelete}
                className='flex-1 h-9 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {deleteStep === 'deleting' ? (
                  <>
                    <span className='w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin' />
                    {t('deletingAccount')}
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    {t('deleteAccountConfirm')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
