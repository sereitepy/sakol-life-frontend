'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AuthIdentity,
  selectMajor,
  SelectMajorResponse,
} from '@/lib/profile/action'
import { MajorResult } from '@/lib/quiz/actions'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { CAREER_CATEGORY_OPTIONS, JOB_OUTLOOK_OPTIONS } from './constants'
import FilterPanel from './filter-panel'
import MajorCard, { MAJOR_META } from './major-card'

type Props = {
  results: MajorResult[]
  identity: AuthIdentity | null
  chosenMajorId: string | null
  searchQuery: string
  selCategories: string[]
  selOutlooks: string[]
  minScore: number
  inputValue: string
  activeFilterCount: number
  hasActiveFilters: boolean
  onSetInputValue: (val: string) => void
  onToggleFilter: (key: 'category' | 'outlook', val: string) => void
  onUpdateUrl: (updates: Record<string, string | string[] | null>) => void
  onClearAll: () => void
  onMajorChosen: (majorId: string) => void
  onMajorDeselected: () => void
}

export default function MajorsTab({
  results,
  identity,
  chosenMajorId,
  searchQuery,
  selCategories,
  selOutlooks,
  minScore,
  inputValue,
  activeFilterCount,
  hasActiveFilters,
  onSetInputValue,
  onToggleFilter,
  onUpdateUrl,
  onClearAll,
  onMajorChosen,
  onMajorDeselected,
}: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [selectingMajorId, setSelectingMajorId] = useState<string | null>(null)
  const [selectError, setSelectError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filtered = useMemo(() => {
    let items = [...results].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        m =>
          m.nameEn.toLowerCase().includes(q) ||
          m.descriptionEn?.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q)
      )
    }

    if (selCategories.length > 0)
      items = items.filter(m => {
        const cat = m.careerCategory ?? MAJOR_META[m.code]?.careerCategory
        return cat && selCategories.includes(cat)
      })

    if (selOutlooks.length > 0)
      items = items.filter(m => {
        const outlook = m.jobOutlook ?? MAJOR_META[m.code]?.jobOutlook
        return outlook && selOutlooks.includes(outlook)
      })

    items = items.filter(m => (m.similarityPercentage ?? 0) >= minScore * 100)

    return items
  }, [results, searchQuery, selCategories, selOutlooks, minScore])

  const visibleResults = showAll ? filtered : filtered.slice(0, 6)

  async function handleChoose(majorId: string) {
    if (chosenMajorId === majorId) {
      onMajorDeselected()
      return
    }
    if (!identity) return
    setSelectingMajorId(majorId)
    setSelectError(null)
    try {
      const data: SelectMajorResponse = await selectMajor(majorId, identity)
      sessionStorage.setItem('chosenMajorData', JSON.stringify(data))
      onMajorChosen(majorId)
    } catch (err) {
      console.error(err)
      setSelectError('Failed to save your selection. Please try again.')
    } finally {
      setSelectingMajorId(null)
    }
  }

  return (
    <>
      <div className='mb-4'>
        <h1 className='text-xl font-bold text-foreground'>
          Your Recommended Majors
        </h1>
        <p className='text-sm text-muted-foreground mt-0.5'>
          Based on your quiz answers: {filtered.length} major
          {filtered.length !== 1 ? 's' : ''} ranked by compatibility
        </p>
      </div>

      {selectError && (
        <div className='mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive'>
          {selectError}
        </div>
      )}

      <div className='flex gap-2 mb-5'>
        <div className='relative flex-1'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />
          <Input
            placeholder='Search majors...'
            value={inputValue}
            onChange={e => onSetInputValue(e.target.value)}
            className='pl-9 bg-card border-border rounded-xl h-11 text-sm'
          />
        </div>
        <Button
          variant='outline'
          className='lg:hidden flex items-center gap-2 h-11 rounded-xl'
          onClick={() => setShowMobileFilters(v => !v)}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className='ml-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {showMobileFilters && (
        <div className='lg:hidden mb-5'>
          <FilterPanel
            selCategories={selCategories}
            selOutlooks={selOutlooks}
            minScore={minScore}
            hasActiveFilters={hasActiveFilters}
            onToggleFilter={onToggleFilter}
            onUpdateUrl={onUpdateUrl}
            onClearAll={onClearAll}
          />
        </div>
      )}

      {(selCategories.length > 0 || selOutlooks.length > 0) && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {selCategories.map(f => (
            <Badge
              key={f}
              variant='secondary'
              className='cursor-pointer text-xs rounded-full'
              onClick={() => onToggleFilter('category', f)}
            >
              {CAREER_CATEGORY_OPTIONS.find(o => o.value === f)?.label ?? f}{' '}
              <X size={10} className='ml-1' />
            </Badge>
          ))}
          {selOutlooks.map(f => (
            <Badge
              key={f}
              variant='secondary'
              className='cursor-pointer text-xs rounded-full'
              onClick={() => onToggleFilter('outlook', f)}
            >
              {JOB_OUTLOOK_OPTIONS.find(o => o.value === f)?.label ?? f}{' '}
              <X size={10} className='ml-1' />
            </Badge>
          ))}
        </div>
      )}

      <div className='flex gap-5 items-start'>
        <aside className='hidden lg:block w-60 shrink-0'>
          <FilterPanel
            selCategories={selCategories}
            selOutlooks={selOutlooks}
            minScore={minScore}
            hasActiveFilters={hasActiveFilters}
            onToggleFilter={onToggleFilter}
            onUpdateUrl={onUpdateUrl}
            onClearAll={onClearAll}
          />
        </aside>

        <div className='flex-1 min-w-0'>
          {filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <p className='text-2xl mb-2'>🔍</p>
              <p className='font-semibold text-foreground'>No majors found</p>
              <p className='text-sm text-muted-foreground mt-1'>
                Try adjusting your search or filters
              </p>
              <Button
                variant='outline'
                size='sm'
                className='mt-4'
                onClick={onClearAll}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                {visibleResults.map((major, idx) => (
                  <MajorCard
                    key={major.majorId}
                    major={major}
                    isTop={idx === 0 && !searchQuery}
                    isChosen={chosenMajorId === major.majorId}
                    isSelecting={selectingMajorId === major.majorId}
                    onView={() =>
                      startTransition(() =>
                        router.push(`/majors/${major.majorId}`)
                      )
                    }
                    onChoose={() => handleChoose(major.majorId)}
                  />
                ))}
              </div>
              {!showAll && filtered.length > 6 && (
                <div className='flex justify-center mt-6'>
                  <button
                    onClick={() => setShowAll(true)}
                    className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
                  >
                    Show more <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
