'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { MajorResult } from '@/lib/quiz/actions'
import { useTranslations, useLocale } from 'next-intl'

const MAJOR_ICONS: Record<string, { emoji: string; bg: string }> = {
  AI: { emoji: '🤖', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  NET: { emoji: '🌐', bg: 'bg-green-100 dark:bg-green-900/30' },
  CYB: { emoji: '🛡️', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  DS: { emoji: '💻', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  MWD: { emoji: '📱', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  DD: { emoji: '🎨', bg: 'bg-rose-100 dark:bg-rose-100/30' },
  DB: { emoji: '🗄️', bg: 'bg-sky-100 dark:bg-sky-900/30' },
  MIS: { emoji: '📊', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  CS: { emoji: '⚙️', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  SD: { emoji: '📚', bg: 'bg-teal-100 dark:bg-teal-900/30' },
  DEFAULT: { emoji: '📚', bg: 'bg-muted' },
}

export const MAJOR_META: Record<
  string,
  { careerCategory: string; jobOutlook: string }
> = {
  SD: { careerCategory: 'SOFTWARE_DEVELOPMENT', jobOutlook: 'HIGH' },
  AI: { careerCategory: 'ARTIFICIAL_INTELLIGENCE', jobOutlook: 'HIGH' },
  DS: { careerCategory: 'DATA_SCIENCE', jobOutlook: 'HIGH' },
  CYB: { careerCategory: 'CYBERSECURITY', jobOutlook: 'HIGH' },
  CS: { careerCategory: 'COMPUTER_SCIENCE_IT', jobOutlook: 'HIGH' },
  NET: { careerCategory: 'NETWORKING', jobOutlook: 'MEDIUM' },
  DD: { careerCategory: 'DIGITAL_DESIGN', jobOutlook: 'MEDIUM' },
  MIS: { careerCategory: 'MANAGEMENT_INFORMATION_SYSTEMS', jobOutlook: 'MEDIUM' },
  DB: { careerCategory: 'DIGITAL_BUSINESS', jobOutlook: 'MEDIUM' },
}

function getIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}

function matchBadge(pct: number) {
  if (pct >= 75)
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (pct >= 50)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

interface MajorCardProps {
  major: MajorResult
  isTop: boolean
  isChosen: boolean
  isSelecting: boolean
  onView: () => void
  onChoose: () => void
}

export default function MajorCard({
  major,
  isTop,
  isChosen,
  isSelecting,
  onView,
  onChoose,
}: MajorCardProps) {
  const locale = useLocale()
  
  const tCard = useTranslations('major_card')
  const tCategories = useTranslations('career_categories')

  const icon = getIcon(major.code)
  const score = major.similarityPercentage ?? 0

  // Fallbacks work seamlessly if properties are null from backend queries
  const rawCat = major.careerCategory || MAJOR_META[major.code]?.careerCategory || ''
  const rawOutlook = major.jobOutlook || MAJOR_META[major.code]?.jobOutlook || ''

  const displayCategory = tCategories.has(rawCat) 
    ? tCategories(rawCat) 
    : rawCat.replace(/_/g, ' ')

  const displayOutlook = tCard.has(`outlooks.${rawOutlook}`)
    ? tCard(`outlooks.${rawOutlook}`)
    : rawOutlook

  const majorName = locale === 'km' ? (major.nameKh || major.nameEn) : major.nameEn
  const majorDesc = locale === 'km' ? (major.descriptionKh || major.descriptionEn) : major.descriptionEn

  // ==========================================
  // BULLETPROOF INTERPOLATION FALLBACK
  // ==========================================
  const renderMatchPercentage = () => {
    if (tCard.has('match_percentage')) {
      const translation = tCard('match_percentage')
      if (translation !== 'major_card.match_percentage') {
        return translation.replace('{{percentage}}', score.toString())
      }
    }
    return locale === 'km' ? `ត្រូវគ្នា ${score}%` : `${score}% Match`
  }

  return (
    <div
      className={`
      relative bg-card rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200
      ${
        isChosen
          ? 'ring-2 ring-primary shadow-lg shadow-primary/10'
          : isTop
            ? 'ring-2 ring-primary/40 shadow-md'
            : 'border border-border hover:shadow-md hover:-translate-y-0.5'
      }
    `}
    >
      {isTop && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap uppercase'>
          🏆 {tCard('top_match')}
        </div>
      )}

      <div className='flex items-start justify-between'>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${icon.bg}`}
        >
          {icon.emoji}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${matchBadge(score)}`}
        >
          ✦ {renderMatchPercentage()}
        </span>
      </div>

      <div>
        <h3 className='font-bold text-base text-foreground line-clamp-1'>{majorName}</h3>
        <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed h-8'>
          {majorDesc}
        </p>
      </div>

      {/* Badges row */}
      <div className='flex flex-wrap gap-1.5 min-h-[22px]'>
        {rawCat && (
          <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap'>
            {displayCategory}
          </span>
        )}
        {rawOutlook && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
              rawOutlook === 'HIGH'
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                : rawOutlook === 'MEDIUM'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {rawOutlook === 'HIGH' ? '🔥 ' : rawOutlook === 'MEDIUM' ? '📈 ' : '📉 '}
            {displayOutlook}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="pt-1">
        <div className='flex justify-between text-xs mb-1'>
          <span className='text-muted-foreground'>{tCard('compatibility')}</span>
          <span className='font-semibold text-primary'>
            {score}%
          </span>
        </div>
        <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary rounded-full transition-all duration-700'
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className='h-px bg-border my-1' />

      {/* Action Option Controls */}
      <div className='flex gap-2 mt-auto'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1 text-xs rounded-lg cursor-pointer'
          onClick={onView}
        >
          {tCard('view_details')}
        </Button>
        <Button
          size='sm'
          disabled={isSelecting}
          className={`flex-1 text-xs rounded-lg cursor-pointer transition-colors ${
            isChosen ? 'bg-chart-2 hover:bg-green-600 text-white' : ''
          }`}
          onClick={onChoose}
        >
          {isSelecting ? (
            <span className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin' />
              {tCard('saving')}
            </span>
          ) : isChosen ? (
            tCard('chosen')
          ) : (
            tCard('choose_major')
          )}
        </Button>
      </div>
    </div>
  )
}