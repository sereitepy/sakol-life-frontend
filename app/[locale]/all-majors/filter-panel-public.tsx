'use client'

import FilterSection from '@/app/components/quiz/results/major-filters'
import { Checkbox } from '@/components/ui/checkbox'
import { Briefcase, TrendingUp, X } from 'lucide-react'

export const EXPLORE_CAREER_CATEGORY_OPTIONS = [
  { value: 'STEM', label: 'STEM' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'ARTS', label: 'Arts' },
  { value: 'SOCIAL', label: 'Social Sciences' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'LAW', label: 'Law' },
  { value: 'OTHER', label: 'Other' },
  { value: 'SOFTWARE_DEVELOPMENT', label: 'Software Development' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'AI & Machine Learning' },
  { value: 'DATA_ANALYTICS', label: 'Data Analytics' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'DIGITAL_DESIGN', label: 'Digital Design' },
  { value: 'INFORMATION_SYSTEMS', label: 'Information Systems' },
  { value: 'DATABASE', label: 'Database' },
  { value: 'SOFTWARE_ENGINEERING', label: 'Software Engineering' },
]

export const EXPLORE_JOB_OUTLOOK_OPTIONS = [
  {
    value: 'HIGH',
    label: 'High Demand',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    value: 'MEDIUM',
    label: 'Medium Demand',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  { value: 'LOW', label: '📉 Low Demand', color: 'text-muted-foreground' },
]

type Props = {
  availableCategories: string[] // only show categories that exist in the data
  availableOutlooks: string[]
  selCategories: string[]
  selOutlooks: string[]
  hasActiveFilters: boolean
  onToggleCategory: (val: string) => void
  onToggleOutlook: (val: string) => void
  onClearAll: () => void
}

export default function FilterPanelPublic({
  availableCategories,
  availableOutlooks,
  selCategories,
  selOutlooks,
  hasActiveFilters,
  onToggleCategory,
  onToggleOutlook,
  onClearAll,
}: Props) {
  const categoryOpts = EXPLORE_CAREER_CATEGORY_OPTIONS.filter(o =>
    availableCategories.includes(o.value)
  )
  const outlookOpts = EXPLORE_JOB_OUTLOOK_OPTIONS.filter(o =>
    availableOutlooks.includes(o.value)
  )

  return (
    <div className='bg-card border border-border rounded-2xl p-4 space-y-1'>
      <div className='flex items-center justify-between mb-3'>
        <span className='font-bold text-sm text-foreground'>Filters</span>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className='text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1'
          >
            <X size={11} /> Clear All
          </button>
        )}
      </div>

      {categoryOpts.length > 0 && (
        <FilterSection title='Field Category' icon={Briefcase}>
          {categoryOpts.map(opt => (
            <label
              key={opt.value}
              className='flex items-center gap-2 cursor-pointer'
            >
              <Checkbox
                checked={selCategories.includes(opt.value)}
                onCheckedChange={() => onToggleCategory(opt.value)}
                className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
              />
              <span className='text-sm text-foreground'>{opt.label}</span>
            </label>
          ))}
        </FilterSection>
      )}

      {outlookOpts.length > 0 && (
        <FilterSection title='Job Outlook' icon={TrendingUp}>
          {outlookOpts.map(opt => (
            <label
              key={opt.value}
              className='flex items-center gap-2 cursor-pointer'
            >
              <Checkbox
                checked={selOutlooks.includes(opt.value)}
                onCheckedChange={() => onToggleOutlook(opt.value)}
                className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
              />
              <span className={`text-sm ${opt.color}`}>{opt.label}</span>
            </label>
          ))}
        </FilterSection>
      )}
    </div>
  )
}
