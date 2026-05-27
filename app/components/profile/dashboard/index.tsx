'use client'

import { Calendar, Target, Bookmark } from 'lucide-react'
import { ProfileResponse } from '@/lib/profile/action'
import { derivePersonalityTags } from '../shared/personality-tags'
import { ProfileHero } from './profile-hero'
import { StatCard } from '../shared/stat-card'
import { RecommendationsPanel } from './recommendations-panel'
import { AssessmentStatus } from './assessment-status'
import { QuickShortcuts } from './sidebar'
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
    <main className='flex-1 p-[clamp(16px,3vw,48px)] min-w-0'>
      <div className='max-w-[min(1000px,100%)] mx-auto space-y-[clamp(12px,2vw,24px)]'>
        <QuickShortcuts />

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
            meta='Updated Today'
          />
          <StatCard
            icon={Target}
            label='Top Match'
            value={topMatch ? topMatch.nameEn : '—'}
            meta={
              topMatch
                ? `${topMatch.similarityPercentage}% Accuracy`
                : undefined
            }
          />
          <StatCard
            icon={Bookmark}
            label='Selected Major'
            value={selectedMajor ? selectedMajor.nameEn : '—'}
            meta='Active Journey'
          />
        </div>

        <AssessmentStatus
          hasQuiz={hasQuiz}
          answeredCount={answeredCount}
          personalityTags={personalityTags}
        />

        <RecommendationsPanel
          recommendations={recommendations}
          selectedMajor={selectedMajor}
          hasQuiz={hasQuiz}
        />
      </div>
    </main>
  )
}
