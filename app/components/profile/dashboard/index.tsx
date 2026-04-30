'use client'

import { Calendar, Target, Bookmark } from 'lucide-react'
import { ProfileResponse } from '@/lib/profile/action'
import { derivePersonalityTags } from '../shared/personality-tags'
import { ProfileHero } from './profile-hero'
import { StatCard } from '../shared/stat-card'
import { RecommendationsPanel } from './recommendations-panel'
import { AssessmentStatus } from './assessment-status'
import { GuidanceCTA, QuickShortcuts } from './sidebar'
import { QuizStateResult } from '@/lib/profile/latest-quiz-result'

type Props = {
  profile: ProfileResponse
  accessToken: string
  quizState: QuizStateResult
}

export default function DashboardTab({ profile, quizState }: Props) {
  const {
    displayName,
    profilePictureUrl,
    totalAttempts,
    selectedMajor,
    latestAnswers,
    role,
  } = profile

  const { recommendations, topMatch } = quizState

  const personalityTags = derivePersonalityTags(latestAnswers)
  const answeredCount = latestAnswers.length
  const hasQuiz = totalAttempts > 0

  return (
    <div className='space-y-6'>
      <ProfileHero
        displayName={displayName}
        profilePictureUrl={profilePictureUrl}
        selectedMajor={selectedMajor}
        role={role}
      />

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard
          icon={Calendar}
          label='Total Assessments'
          value={hasQuiz ? `${totalAttempts} taken` : '—'}
        />
        <StatCard
          icon={Target}
          label='Top Match'
          value={topMatch ? topMatch.nameEn : '—'}
        />
        <StatCard
          icon={Bookmark}
          label='Selected Major'
          value={selectedMajor ? selectedMajor.nameEn : 'None chosen'}
        />
      </div>

      <div className='flex flex-col lg:flex-row gap-6 items-start'>
        <div className='flex-1 min-w-0 space-y-6'>
          <RecommendationsPanel
            recommendations={recommendations}
            selectedMajor={selectedMajor}
            hasQuiz={hasQuiz}
          />
          <AssessmentStatus
            hasQuiz={hasQuiz}
            answeredCount={answeredCount}
            personalityTags={personalityTags}
          />
        </div>
        <div className='w-full lg:w-64 shrink-0 space-y-4'>
          <QuickShortcuts />
          <GuidanceCTA />
        </div>
      </div>
    </div>
  )
}
