'use client'

import { ProfileResponse } from '@/lib/profile/action'
import { useState } from 'react'
import SurveyTab from './survey'
import DashboardTab from './dashboard'
import SettingsTab from './settings'

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
          <div className='max-w-300 mx-auto px-6 py-8'>
            <SurveyTab profile={profile} />
          </div>
        )}
        {activeTab === 'settings' && (
          <div className='max-w-300 mx-auto px-6 py-8'>
            <SettingsTab profile={profile} accessToken={accessToken} />
          </div>
        )}
      </div>
    </div>
  )
}
