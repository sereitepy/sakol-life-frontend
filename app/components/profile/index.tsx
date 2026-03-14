'use client'

import { ProfileResponse } from '@/lib/profile/action';
import { useState } from 'react'
import DashboardTab from './dashboard';


type Tab = 'dashboard' | 'survey' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'My Dashboard' },
  { id: 'survey', label: 'Survey Answers' },
  { id: 'settings', label: 'Account Settings' },
]

type Props = {
  profile: ProfileResponse
  accessToken: string
}

export default function ProfileShell({ profile, accessToken }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <div className='min-h-screen bg-background'>
      {/* the tab navigation btw (in profile page) */}
      <div className='border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10'>
        <div className='max-w-300 mx-auto px-6'>
          <nav className='flex gap-0'>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-5 py-4 text-sm font-semibold transition-colors duration-150 cursor-pointer
                    ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full' />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* contents inside each tabs */}
      <div className='max-w-300 mx-auto px-6 py-8'>
        {activeTab === 'dashboard' && (
          <DashboardTab profile={profile} accessToken={accessToken} />
        )}
        {activeTab === 'survey' && (
          <div className='flex items-center justify-center py-32 text-muted-foreground text-sm'>
            Survey Answers tab — coming soon
          </div>
        )}
        {activeTab === 'settings' && (
          <div className='flex items-center justify-center py-32 text-muted-foreground text-sm'>
            Account Settings tab — coming soon
          </div>
        )}
      </div>
    </div>
  )
}
