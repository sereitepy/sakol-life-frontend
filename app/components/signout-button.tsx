'use client'

import { signOutAction } from '@/lib/auth/signout'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

function clearLocalData() {
  localStorage.removeItem('quizAnswers')
  localStorage.removeItem('postAuthRedirect')
  sessionStorage.removeItem('quizResult')
  sessionStorage.removeItem('chosenMajorId')
  sessionStorage.removeItem('chosenMajorData')
  sessionStorage.removeItem('guestSessionId')
}

export default function SignOutButton({ className }: { className?: string }) {
  async function handleSignOut() {
    clearLocalData()
    await signOutAction()
  }

  return (
    <Button variant='ghost' className={className} onClick={handleSignOut}>
      <LogOut size={13} />
      Sign Out
    </Button>
  )
}
