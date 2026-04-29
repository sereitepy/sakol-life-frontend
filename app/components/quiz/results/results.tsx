'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  AuthIdentity,
  selectMajor,
  SelectMajorResponse,
} from '@/lib/profile/action'
import { QuizSubmitResponse } from '@/lib/quiz/actions'
import { createClient } from '@/lib/supabase/client'
import {
  Briefcase,
  ChevronDown,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import MajorCard, { MAJOR_META } from './major-card'
import FilterSection from './major-filters'
import UniversitiesTab from './universities-tab'

// Types

type SearchParams = {
  q?: string
  category?: string | string[]
  outlook?: string | string[]
  minScore?: string
  tab?: string
}

type Props = { searchParams: SearchParams }

// Constants

const CAREER_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'SOFTWARE_DEVELOPMENT', label: 'Software Development' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence' },
  { value: 'DATA_ANALYTICS', label: 'Data Analytics' },
  { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'DIGITAL_DESIGN', label: 'Digital Design' },
  { value: 'INFORMATION_SYSTEMS', label: 'Information Systems' },
]

const JOB_OUTLOOK_OPTIONS: { value: string; label: string; color: string }[] = [
  {
    value: 'HIGH',
    label: '🔥 High Demand',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    value: 'MEDIUM',
    label: '📈 Medium Demand',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  { value: 'LOW', label: '📉 Low Demand', color: 'text-muted-foreground' },
]

const MIN_SCORE_OPTIONS = [
  { value: '0.5', label: 'All matches (50%+)' },
  { value: '0.6', label: 'Good (60%+)' },
  { value: '0.75', label: 'Strong (75%+)' },
  { value: '0.9', label: 'Excellent (90%+)' },
]

function getGuestSessionId(): string {
  const key = 'guestSessionId'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

export default function ResultsClient({ searchParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const [result, setResult] = useState<QuizSubmitResponse | null>(null)
  const [identity, setIdentity] = useState<AuthIdentity | null>(null)
  const [chosenMajorId, setChosenMajorId] = useState<string | null>(null)
  const [selectingMajorId, setSelectingMajorId] = useState<string | null>(null)
  const [selectError, setSelectError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const activeTab = searchParams.tab ?? 'majors'
  const searchQuery = searchParams.q ?? ''
  const selCategories = toArray(searchParams.category)
  const selOutlooks = toArray(searchParams.outlook)
  const minScore = parseFloat(searchParams.minScore ?? '0.5')

  const [inputValue, setInputValue] = useState(searchQuery)

  // Debounce the URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl({ q: inputValue || null })
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])
  
  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult')
    if (!stored) {
      router.replace('/quiz')
      return
    }
    setResult(JSON.parse(stored))

    const savedMajor = sessionStorage.getItem('chosenMajorId')
    if (savedMajor) setChosenMajorId(savedMajor)

    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (session?.user && session.access_token) {
        setIdentity({
          type: 'user',
          userId: session.user.id,
          accessToken: session.access_token,
        })
      } else {
        setIdentity({ type: 'guest', guestSessionId: getGuestSessionId() })
      }
    })
  }, [router])

  const updateUrl = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams()
      if (searchParams.q) params.set('q', searchParams.q)
      if (searchParams.tab && searchParams.tab !== 'majors')
        params.set('tab', searchParams.tab)
      if (searchParams.minScore && searchParams.minScore !== '0.5')
        params.set('minScore', searchParams.minScore)
      toArray(searchParams.category).forEach(v => params.append('category', v))
      toArray(searchParams.outlook).forEach(v => params.append('outlook', v))

      Object.entries(updates).forEach(([key, val]) => {
        params.delete(key)
        if (val === null) return
        if (Array.isArray(val)) val.forEach(v => params.append(key, v))
        else if (val) params.set(key, val)
      })

      const qs = params.toString()
      startTransition(() =>
        router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
      )
    },
    [searchParams, router, pathname, startTransition]
  )

  function toggleFilter(key: 'category' | 'outlook', val: string) {
    const current = key === 'category' ? selCategories : selOutlooks
    const next = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val]
    updateUrl({ [key]: next.length ? next : null })
  }

  function clearAll() {
    startTransition(() => router.push(pathname, { scroll: false }))
  }

  async function handleChoose(majorId: string) {
    if (chosenMajorId === majorId) {
      setChosenMajorId(null)
      sessionStorage.removeItem('chosenMajorId')
      sessionStorage.removeItem('chosenMajorData')
      return
    }
    if (!identity) return
    setSelectingMajorId(majorId)
    setSelectError(null)
    try {
      const data: SelectMajorResponse = await selectMajor(majorId, identity)
      sessionStorage.setItem('chosenMajorId', majorId)
      sessionStorage.setItem('chosenMajorData', JSON.stringify(data))
      setChosenMajorId(majorId)
    } catch (err) {
      console.error(err)
      setSelectError('Failed to save your selection. Please try again.')
    } finally {
      setSelectingMajorId(null)
    }
  }

  const filtered = useMemo(() => {
    if (!result) return []

    let items = [...result.results].sort(
      (a, b) => (a.rank ?? 0) - (b.rank ?? 0)
    )

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
  }, [result, searchQuery, selCategories, selOutlooks, minScore])

  const hasActiveFilters =
    searchQuery ||
    selCategories.length > 0 ||
    selOutlooks.length > 0 ||
    minScore > 0.5
  const visibleResults = showAll ? filtered : filtered.slice(0, 6)
  const hasChosen = !!chosenMajorId

  // Active filter count for mobile badge
  const activeFilterCount =
    selCategories.length + selOutlooks.length + (minScore > 0.5 ? 1 : 0)

  if (!result) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
          <p className='text-sm text-muted-foreground'>Loading your results…</p>
        </div>
      </div>
    )
  }

  const FilterPanel = (
    <div className='bg-card border border-border rounded-2xl p-4 space-y-1'>
      <div className='flex items-center justify-between mb-3'>
        <span className='font-bold text-sm text-foreground'>Filters</span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className='text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1'
          >
            <X size={11} /> Clear All
          </button>
        )}
      </div>

      {/* Match % */}
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
                updateUrl({ minScore: opt.value === '0.5' ? null : opt.value })
              }
              className='accent-primary'
            />
            <span className='text-sm text-foreground'>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Career category */}
      <FilterSection title='Field Category' icon={Briefcase}>
        {CAREER_CATEGORY_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className='flex items-center gap-2 cursor-pointer'
          >
            <Checkbox
              checked={selCategories.includes(opt.value)}
              onCheckedChange={() => toggleFilter('category', opt.value)}
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
            />
            <span className='text-sm text-foreground'>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Job outlook */}
      <FilterSection title='Job Outlook' icon={TrendingUp}>
        {JOB_OUTLOOK_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className='flex items-center gap-2 cursor-pointer'
          >
            <Checkbox
              checked={selOutlooks.includes(opt.value)}
              onCheckedChange={() => toggleFilter('outlook', opt.value)}
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
            />
            <span className={`text-sm ${opt.color}`}>{opt.label}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  )

  return (
    <div className='min-h-screen bg-background'>
      {/* Tabs */}
      <div className='border-b border-border bg-card sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex gap-6'>
          {(['majors', 'universities'] as const).map(tab => {
            const isActive = activeTab === tab
            const isDisabled = tab === 'universities' && !hasChosen
            return (
              <button
                key={tab}
                disabled={isDisabled}
                onClick={() =>
                  !isDisabled &&
                  updateUrl({ tab: tab === 'majors' ? null : tab })
                }
                className={`
                  py-3.5 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px cursor-pointer
                  ${
                    isActive
                      ? 'border-primary text-foreground'
                      : isDisabled
                        ? 'border-transparent text-muted-foreground/40 cursor-not-allowed'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tab}
                {tab === 'universities' && !hasChosen && (
                  <span className='ml-1.5 text-[10px] font-normal text-muted-foreground/50'>
                    (choose a major first)
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        {activeTab === 'majors' && (
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

            {/* Search + mobile filter toggle */}
            <div className='flex gap-2 mb-5'>
              <div className='relative flex-1'>
                <Search
                  size={16}
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                />
                <Input
                  placeholder='Search majors...'
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className='pl-9 bg-card border-border rounded-xl h-11 text-sm'
                />
              </div>
              {/* Mobile filter button */}
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

            {/* Mobile filter panel */}
            {showMobileFilters && (
              <div className='lg:hidden mb-5'>{FilterPanel}</div>
            )}

            {/* Active filter chips */}
            {(selCategories.length > 0 || selOutlooks.length > 0) && (
              <div className='flex flex-wrap gap-2 mb-4'>
                {selCategories.map(f => (
                  <Badge
                    key={f}
                    variant='secondary'
                    className='cursor-pointer text-xs rounded-full'
                    onClick={() => toggleFilter('category', f)}
                  >
                    {CAREER_CATEGORY_OPTIONS.find(o => o.value === f)?.label ??
                      f}{' '}
                    <X size={10} className='ml-1' />
                  </Badge>
                ))}
                {selOutlooks.map(f => (
                  <Badge
                    key={f}
                    variant='secondary'
                    className='cursor-pointer text-xs rounded-full'
                    onClick={() => toggleFilter('outlook', f)}
                  >
                    {JOB_OUTLOOK_OPTIONS.find(o => o.value === f)?.label ?? f}{' '}
                    <X size={10} className='ml-1' />
                  </Badge>
                ))}
              </div>
            )}

            <div className='flex gap-5 items-start'>
              {/* Desktop sidebar */}
              <aside className='hidden lg:block w-60 shrink-0'>
                {FilterPanel}
              </aside>

              {/* Grid */}
              <div className='flex-1 min-w-0'>
                {filtered.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-16 text-center'>
                    <p className='text-2xl mb-2'>🔍</p>
                    <p className='font-semibold text-foreground'>
                      No majors found
                    </p>
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                      {visibleResults.map((major, idx) => (
                        <MajorCard
                          key={idx}
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
        )}

        {activeTab === 'universities' && hasChosen && (
          <UniversitiesTab onBack={() => updateUrl({ tab: null })} />
        )}
      </div>
    </div>
  )
}
