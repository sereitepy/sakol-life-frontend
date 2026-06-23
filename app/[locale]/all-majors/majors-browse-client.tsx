'use client'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { PublicMajor } from '@/lib/view/view-all'
import FilterPanelPublic, { EXPLORE_CAREER_CATEGORY_OPTIONS, EXPLORE_JOB_OUTLOOK_OPTIONS } from './filter-panel-public'
import MajorCardPublic from './major-card-public'


export default function MajorsBrowseClient({
  majors,
}: {
  majors: PublicMajor[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selCategories, setSelCategories] = useState<string[]>([])
  const [selOutlooks, setSelOutlooks] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const availableCategories = useMemo(() => {
    const cats = new Set(
      majors.map(m => m.careerCategory).filter(Boolean) as string[]
    )
    return Array.from(cats)
  }, [majors])

  const availableOutlooks = useMemo(() => {
    const set = new Set(
      majors.map(m => m.jobOutlook).filter(Boolean) as string[]
    )
    return Array.from(set)
  }, [majors])

  const filtered = useMemo(() => {
    let items = [...majors]
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
      items = items.filter(
        m => m.careerCategory && selCategories.includes(m.careerCategory)
      )
    if (selOutlooks.length > 0)
      items = items.filter(
        m => m.jobOutlook && selOutlooks.includes(m.jobOutlook)
      )
    return items
  }, [majors, searchQuery, selCategories, selOutlooks])

  const visibleMajors = showAll ? filtered : filtered.slice(0, 9)
  const hasActiveFilters = selCategories.length > 0 || selOutlooks.length > 0
  const activeFilterCount = selCategories.length + selOutlooks.length

  function toggleCategory(val: string) {
    setSelCategories(prev =>
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    )
    setShowAll(false)
  }

  function toggleOutlook(val: string) {
    setSelOutlooks(prev =>
      prev.includes(val) ? prev.filter(o => o !== val) : [...prev, val]
    )
    setShowAll(false)
  }

  function clearAll() {
    setSelCategories([])
    setSelOutlooks([])
    setInputValue('')
    setSearchQuery('')
    setShowAll(false)
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
          <h1 className='text-2xl font-bold text-foreground'>All Majors</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Browse {majors.length} available majors
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        <div className='flex gap-2 mb-5'>
          <div className='relative flex-1'>
            <Search
              size={16}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
            />
            <Input
              placeholder='Search majors…'
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value)
                setSearchQuery(e.target.value)
                setShowAll(false)
              }}
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
            <FilterPanelPublic
              availableCategories={availableCategories}
              availableOutlooks={availableOutlooks}
              selCategories={selCategories}
              selOutlooks={selOutlooks}
              hasActiveFilters={hasActiveFilters}
              onToggleCategory={toggleCategory}
              onToggleOutlook={toggleOutlook}
              onClearAll={clearAll}
            />
          </div>
        )}

        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {selCategories.map(f => (
              <Badge
                key={f}
                variant='secondary'
                className='cursor-pointer text-xs rounded-full'
                onClick={() => toggleCategory(f)}
              >
                {EXPLORE_CAREER_CATEGORY_OPTIONS.find(o => o.value === f)
                  ?.label ?? f}{' '}
                <X size={10} className='ml-1' />
              </Badge>
            ))}
            {selOutlooks.map(f => (
              <Badge
                key={f}
                variant='secondary'
                className='cursor-pointer text-xs rounded-full'
                onClick={() => toggleOutlook(f)}
              >
                {EXPLORE_JOB_OUTLOOK_OPTIONS.find(o => o.value === f)?.label ??
                  f}{' '}
                <X size={10} className='ml-1' />
              </Badge>
            ))}
          </div>
        )}

        <div className='flex gap-5 items-start'>
          <aside className='hidden lg:block w-60 shrink-0'>
            <FilterPanelPublic
              availableCategories={availableCategories}
              availableOutlooks={availableOutlooks}
              selCategories={selCategories}
              selOutlooks={selOutlooks}
              hasActiveFilters={hasActiveFilters}
              onToggleCategory={toggleCategory}
              onToggleOutlook={toggleOutlook}
              onClearAll={clearAll}
            />
          </aside>

          <div className='flex-1 min-w-0'>
            {filtered.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <p className='text-3xl mb-2'>🔍</p>
                <p className='font-semibold text-foreground'>No majors found</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Try adjusting your search or filters
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-4'
                  onClick={clearAll}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <p className='text-xs text-muted-foreground mb-4'>
                  {filtered.length} major{filtered.length !== 1 ? 's' : ''}
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {visibleMajors.map(major => (
                    <MajorCardPublic
                      key={major.majorId}
                      major={major}
                      onView={() =>
                        startTransition(() =>
                          router.push(`/majors/${major.majorId}`)
                        )
                      }
                    />
                  ))}
                </div>
                {!showAll && filtered.length > 9 && (
                  <div className='flex justify-center mt-6'>
                    <button
                      onClick={() => setShowAll(true)}
                      className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
                    >
                      Show {filtered.length - 9} more <ChevronDown size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
