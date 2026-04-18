import { LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  onSignOut: () => void
}

export function DangerZone({ onSignOut }: Props) {
  return (
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
            onClick={onSignOut}
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
  )
}
