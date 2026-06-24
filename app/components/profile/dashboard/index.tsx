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
import { useTranslations, useLocale } from 'next-intl'

type Props = {
  profile: ProfileResponse
  accessToken: string
  quizState: QuizStateResult
}

export default function DashboardTab({ profile, quizState }: Props) {
  const locale = useLocale()
  const tStats = useTranslations('dashboard_stats')

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

  // Fallback indicator string logic
  const na = tStats('not_available')

  // Dynamic localization for major object text properties
  const localizedTopMatchName = topMatch 
    ? (locale === 'km' ? (topMatch.nameKm || topMatch.nameEn) : topMatch.nameEn) 
    : na

  const localizedSelectedMajorName = selectedMajor 
    ? (locale === 'km' ? (selectedMajor.nameKm || selectedMajor.nameEn) : selectedMajor.nameEn) 
    : na

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
          {/* Card 1: Total Assessments */}
          <StatCard
            icon={Calendar}
            label={tStats('total_assessments')}
            value={hasQuiz ? tStats('assessments_taken', { count: totalAttempts }) : na}
            meta={tStats('updated_today')}
          />
          
          {/* Card 2: Top Quiz Result Match */}
          <StatCard
            icon={Target}
            label={tStats('top_match')}
            value={localizedTopMatchName}
            meta={
              topMatch
                ? tStats('accuracy', { percentage: topMatch.similarityPercentage })
                : undefined
            }
          />
          
          {/* Card 3: Saved Selected Major */}
          <StatCard
            icon={Bookmark}
            label={tStats('selected_major')}
            value={localizedSelectedMajorName}
            meta={tStats('active_journey')}
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