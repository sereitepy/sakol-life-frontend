'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Briefcase, Flame, Percent, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslations } from 'next-intl'
import { 
  CAREER_CATEGORY_OPTIONS, 
  JOB_OUTLOOK_OPTIONS, 
  MIN_SCORE_OPTIONS 
} from './constants'

// ==========================================
// Collapsible Section Wrapper Component
// ==========================================
export function FilterSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className='border-t border-border pt-4 mb-1'>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className='flex items-center justify-between w-full mb-3 cursor-pointer select-none bg-transparent'
      >
        <div className='flex items-center gap-2'>
          <Icon size={13} className='text-primary' />
          <span className='text-xs font-bold text-foreground uppercase tracking-wide'>
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp size={13} className='text-muted-foreground' />
        ) : (
          <ChevronDown size={13} className='text-muted-foreground' />
        )}
      </button>
      {open && <div className='space-y-2.5 pb-2'>{children}</div>}
    </div>
  )
}

// ==========================================
// Main Filter Panel Component Export
// ==========================================
interface FilterPanelProps {
  selCategories?: string[]
  selOutlooks?: string[]
  minScore?: number | string
  hasActiveFilters: boolean
  onToggleFilter: (key: 'category' | 'outlook', val: string) => void
  onUpdateUrl: (updates: Record<string, string | string[] | null>) => void
  onClearAll: () => void
}

export default function FilterPanel({
  selCategories = [], 
  selOutlooks = [],    
  minScore = '0.5',
  hasActiveFilters,
  onToggleFilter,
  onUpdateUrl,
  onClearAll,
}: FilterPanelProps) {
  const tTab = useTranslations('major-tab')
  const tCategories = useTranslations('career_categories')
  const tOutlooks = useTranslations('job_outlooks')
  const tScores = useTranslations('min_scores')

  // Safe header titles extraction with hardcoded English fallbacks
  const categoriesTitle = tCategories.has('title') ? tCategories('title') : 'Field Category'
  const outlooksTitle = tOutlooks.has('title') ? tOutlooks('title') : 'Job Outlook'
  const compatibilityTitle = tScores.has('compatibility') ? tScores('compatibility') : 'Compatibility'

  // Safely extracts the dictionary translation key, handling both "namespace.key" and raw "key" values
  const getDictKey = (labelKey: string): string => {
    if (!labelKey) return ''
    return labelKey.includes('.') ? labelKey.split('.')[1] : labelKey
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Sidebar Top Header Section */}
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-bold text-foreground">
          {tTab('filters')}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={11} />
            {tTab('clear')}
          </Button>
        )}
      </div>

      {/* 1. Career Category Filters */}
      <FilterSection title={categoriesTitle} icon={Briefcase}>
        {CAREER_CATEGORY_OPTIONS.map((opt) => {
          const dictKey = getDictKey(opt.labelKey)
          
          // Multi-tier defensive fallback chain for labels
          const label = tCategories.has(dictKey) 
            ? tCategories(dictKey) 
            : (opt.label || opt.value?.replace(/_/g, ' '))
            
          const isChecked = selCategories.includes(opt.value)

          return (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${opt.value}`}
                checked={isChecked}
                onCheckedChange={() => onToggleFilter('category', opt.value)}
                className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
              />
              <label
                htmlFor={`cat-${opt.value}`}
                className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors select-none"
              >
                {label}
              </label>
            </div>
          )
        })}
      </FilterSection>

      {/* 2. Job Outlook / Market Demand Filters */}
      <FilterSection title={outlooksTitle} icon={Flame}>
        {JOB_OUTLOOK_OPTIONS.map((opt) => {
          const dictKey = getDictKey(opt.labelKey)
          
          const label = tOutlooks.has(dictKey) 
            ? tOutlooks(dictKey) 
            : (opt.label || opt.value)
            
          const isChecked = selOutlooks.includes(opt.value)

          return (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox
                id={`out-${opt.value}`}
                checked={isChecked}
                onCheckedChange={() => onToggleFilter('outlook', opt.value)}
                className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
              />
              <label
                htmlFor={`out-${opt.value}`}
                className={`text-xs font-medium cursor-pointer transition-colors select-none ${opt.color || ''}`}
              >
                {label}
              </label>
            </div>
          )
        })}
      </FilterSection>

      {/* 3. Minimum Compatibility Score Rules */}
      <FilterSection title={compatibilityTitle} icon={Percent}>
        <div className="space-y-2 pt-1">
          {MIN_SCORE_OPTIONS.map((opt) => {
            const dictKey = getDictKey(opt.labelKey)
            
            const label = tScores.has(dictKey) 
              ? tScores(dictKey) 
              : (opt.label || `${Number(opt.value) * 100}%+`)

            return (
              <div key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="minScore"
                  id={`score-${opt.value}`}
                  value={opt.value}
                  checked={minScore.toString() === opt.value}
                  onChange={() =>
                    onUpdateUrl({
                      minScore: opt.value === '0.5' ? null : opt.value,
                    })
                  }
                  className="h-4 w-4 border-input text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <label
                  htmlFor={`score-${opt.value}`}
                  className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer transition-colors select-none"
                >
                  {label}
                </label>
              </div>
            )
          })}
        </div>
      </FilterSection>
    </div>
  )
}