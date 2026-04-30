'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Briefcase, TrendingUp, X } from 'lucide-react'
import FilterSection from './major-filters'
import {
  CAREER_CATEGORY_OPTIONS,
  JOB_OUTLOOK_OPTIONS,
  MIN_SCORE_OPTIONS,
} from './constants'

type Props = {
  selCategories: string[]
  selOutlooks: string[]
  minScore: number
  hasActiveFilters: boolean
  onToggleFilter: (key: 'category' | 'outlook', val: string) => void
  onUpdateUrl: (updates: Record<string, string | string[] | null>) => void
  onClearAll: () => void
}

export default function FilterPanel({
  selCategories,
  selOutlooks,
  minScore,
  hasActiveFilters,
  onToggleFilter,
  onUpdateUrl,
  onClearAll,
}: Props) {
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

      <FilterSection title='Match Score' icon={TrendingUp}>
        {MIN_SCORE_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className='flex items-center gap-2 cursor-pointer'
          >
            <input
              type='radio'
              name='minScore'
              checked={String(minScore) === opt.value}
              onChange={() =>
                onUpdateUrl({
                  minScore: opt.value === '0.5' ? null : opt.value,
                })
              }
              className='accent-primary'
            />
            <span className='text-sm text-foreground'>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title='Field Category' icon={Briefcase}>
        {CAREER_CATEGORY_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className='flex items-center gap-2 cursor-pointer'
          >
            <Checkbox
              checked={selCategories.includes(opt.value)}
              onCheckedChange={() => onToggleFilter('category', opt.value)}
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
            />
            <span className='text-sm text-foreground'>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title='Job Outlook' icon={TrendingUp}>
        {JOB_OUTLOOK_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className='flex items-center gap-2 cursor-pointer'
          >
            <Checkbox
              checked={selOutlooks.includes(opt.value)}
              onCheckedChange={() => onToggleFilter('outlook', opt.value)}
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
            />
            <span className={`text-sm ${opt.color}`}>{opt.label}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  )
}
