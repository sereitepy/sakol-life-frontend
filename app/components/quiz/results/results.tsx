'use client'

import { useEffect, useState, useCallback, useMemo, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MajorResult, QuizSubmitResponse } from '@/lib/quiz/actions'
import { createClient } from '@/lib/supabase/client'
import { Search, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { selectMajor, SelectMajorResponse } from '@/lib/profile/action'

type SearchParams = {
  q?: string
  duration?: string | string[]
  category?: string | string[]
  tab?: string
}

type Props = { searchParams: SearchParams }

type AuthIdentity =
  | { type: 'user'; userId: string; accessToken: string }
  | { type: 'guest'; guestSessionId: string }

function getGuestSessionId(): string {
  const key = 'guestSessionId'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

const DURATION_OPTIONS = ['2 Years', '4 Years', '> 4 Years']
const CATEGORY_OPTIONS = ['STEM', 'Arts & Humanities', 'Business']

const MAJOR_ICONS: Record<string, { emoji: string; iconBg: string }> = {
  AI: { emoji: '🤖', iconBg: 'bg-violet-100 dark:bg-violet-900/30' },
  NET: { emoji: '🌐', iconBg: 'bg-green-100 dark:bg-green-900/30' },
  CYB: { emoji: '🛡️', iconBg: 'bg-orange-100 dark:bg-orange-900/30' },
  CE: { emoji: '⚙️', iconBg: 'bg-sky-100 dark:bg-sky-900/30' },
  DS: { emoji: '💻', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  MWD: { emoji: '📱', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
  DM: { emoji: '📣', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
  GD: { emoji: '🎨', iconBg: 'bg-rose-100 dark:bg-rose-900/30' },
  BA: { emoji: '📊', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  DEFAULT: { emoji: '📚', iconBg: 'bg-muted' },
}

function getIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

function matchBadgeClasses(pct: number) {
  if (pct >= 70)
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (pct >= 50)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: string[]
  selected: string[]
  onToggle: (opt: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className='border-t border-border pt-4 mb-4'>
      <button
        onClick={() => setOpen(v => !v)}
        className='flex items-center justify-between w-full mb-3 cursor-pointer'
      >
        <span className='text-sm font-semibold text-foreground'>{title}</span>
        {open ? (
          <ChevronUp size={14} className='text-muted-foreground' />
        ) : (
          <ChevronDown size={14} className='text-muted-foreground' />
        )}
      </button>
      {open &&
        options.map(opt => (
          <label
            key={opt}
            className='flex items-center gap-2 mb-2.5 cursor-pointer'
          >
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => onToggle(opt)}
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
            />
            <span className='text-sm text-foreground'>{opt}</span>
          </label>
        ))}
    </div>
  )
}

function MajorCard({
  major,
  isTop,
  isChosen,
  isSelecting,
  onView,
  onChoose,
}: {
  major: MajorResult
  isTop: boolean
  isChosen: boolean
  isSelecting: boolean
  onView: () => void
  onChoose: () => void
}) {
  const icon = getIcon(major.code)

  return (
    <div
      className={`
        relative bg-card rounded-2xl p-5 flex flex-col gap-3 transition-shadow
        ${
          isChosen
            ? 'ring-2 ring-primary shadow-lg shadow-primary/10'
            : isTop
              ? 'ring-2 ring-primary/60 shadow-md'
              : 'border border-border hover:shadow-md'
        }
      `}
    >
      {isTop && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap'>
          🏆 TOP MATCH
        </div>
      )}

      {isChosen && (
        <div className='absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-bold tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1'>
          <CheckCircle2 size={10} /> CHOSEN
        </div>
      )}

      <div className='flex items-start justify-between'>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${icon.iconBg}`}
        >
          {icon.emoji}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${matchBadgeClasses(major.similarityPercentage)}`}
        >
          ✦ {major.similarityPercentage}% Match
        </span>
      </div>

      <div>
        <h3 className='font-bold text-base text-foreground'>{major.nameEn}</h3>
        <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed'>
          {major.descriptionEn}
        </p>
      </div>

      <div>
        <div className='flex justify-between text-xs mb-1'>
          <span className='text-muted-foreground'>Compatibility</span>
          <span className='font-semibold text-primary'>
            {major.similarityPercentage}%
          </span>
        </div>
        <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary rounded-full transition-all duration-700'
            style={{ width: `${major.similarityPercentage}%` }}
          />
        </div>
      </div>

      <div className='h-px bg-border' />

      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1 text-xs rounded-lg cursor-pointer'
          onClick={onView}
        >
          View Details
        </Button>
        <Button
          size='sm'
          disabled={isSelecting}
          className={`flex-1 text-xs rounded-lg cursor-pointer ${
            isChosen ? 'bg-green-500 hover:bg-green-600' : ''
          }`}
          onClick={onChoose}
        >
          {isSelecting ? (
            <span className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin' />
              Saving…
            </span>
          ) : isChosen ? (
            '✓ Chosen'
          ) : (
            'Choose Major'
          )}
        </Button>
      </div>
    </div>
  )
}

// Main component (i will break all components down tmr bruh)

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

  const activeTab = searchParams.tab ?? 'majors'
  const searchQuery = searchParams.q ?? ''
  const selectedDurations = toArray(searchParams.duration)
  const selectedCategories = toArray(searchParams.category)

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult')
    if (!stored) {
      router.replace('/quiz')
      return
    }
    setResult(JSON.parse(stored))

    const savedMajor = sessionStorage.getItem('chosenMajorId')
    if (savedMajor) setChosenMajorId(savedMajor)

    // Resolve identity once, captures access token for the session
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
        setIdentity({
          type: 'guest',
          guestSessionId: getGuestSessionId(),
        })
      }
    })
  }, [router])

  // URL updater
  const updateUrl = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams()

      if (searchParams.q) params.set('q', searchParams.q)
      if (searchParams.tab && searchParams.tab !== 'majors')
        params.set('tab', searchParams.tab)
      toArray(searchParams.duration).forEach(v => params.append('duration', v))
      toArray(searchParams.category).forEach(v => params.append('category', v))

      Object.entries(updates).forEach(([key, val]) => {
        params.delete(key)
        if (val === null) return
        if (Array.isArray(val)) val.forEach(v => params.append(key, v))
        else if (val) params.set(key, val)
      })

      const qs = params.toString()
      startTransition(() => {
        router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
      })
    },
    [searchParams, router, pathname, startTransition]
  )

  function handleSearch(value: string) {
    updateUrl({ q: value || null })
  }

  function toggleDuration(opt: string) {
    const next = selectedDurations.includes(opt)
      ? selectedDurations.filter(d => d !== opt)
      : [...selectedDurations, opt]
    updateUrl({ duration: next.length ? next : null })
  }

  function toggleCategory(opt: string) {
    const next = selectedCategories.includes(opt)
      ? selectedCategories.filter(c => c !== opt)
      : [...selectedCategories, opt]
    updateUrl({ category: next.length ? next : null })
  }

  function clearAll() {
    startTransition(() => router.push(pathname, { scroll: false }))
  }

  async function handleChoose(majorId: string) {
    // deselect locally if already chosen
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
      console.error('Failed to select major:', err)
      setSelectError('Failed to save your selection. Please try again.')
    } finally {
      setSelectingMajorId(null)
    }
  }

  // filtered results
  const filtered = useMemo(() => {
    if (!result) return []
    let items = [...result.results].sort((a, b) => a.rank - b.rank)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        m =>
          m.nameEn.toLowerCase().includes(q) ||
          m.descriptionEn.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q)
      )
    }

    return items
  }, [result, searchQuery])

  const hasActiveFilters =
    searchQuery || selectedDurations.length || selectedCategories.length
  const visibleResults = showAll ? filtered : filtered.slice(0, 6)
  const hasChosen = !!chosenMajorId

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

  return (
    <div className='min-h-screen bg-background'>
      {/* Tabs */}
      <div className='border-b border-border bg-card'>
        <div className='max-w-300 mx-auto px-6 flex gap-6'>
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

      <div className='max-w-300 mx-auto px-6 py-6'>
        {activeTab === 'majors' && (
          <>
            <div className='mb-4'>
              <h1 className='text-xl font-bold text-foreground'>
                Your Recommended Majors
              </h1>
              <p className='text-sm text-muted-foreground mt-0.5'>
                Based on your quiz answers — {filtered.length} major
                {filtered.length !== 1 ? 's' : ''} ranked by compatibility
              </p>
            </div>

            {selectError && (
              <div className='mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive'>
                {selectError}
              </div>
            )}

            <div className='relative mb-5'>
              <Search
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
              />
              <Input
                placeholder='Search for majors, skills, or industries...'
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className='pl-9 bg-card border-border rounded-xl h-11 text-sm'
              />
            </div>

            <div className='flex gap-5 items-start'>
              <aside className='w-56 shrink-0 bg-card border border-border rounded-2xl p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='font-bold text-sm text-foreground'>
                    Filters
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      className='text-xs font-semibold text-primary hover:underline cursor-pointer'
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <FilterSection
                  title='Study Duration'
                  options={DURATION_OPTIONS}
                  selected={selectedDurations}
                  onToggle={toggleDuration}
                />
                <FilterSection
                  title='Field Category'
                  options={CATEGORY_OPTIONS}
                  selected={selectedCategories}
                  onToggle={toggleCategory}
                />
              </aside>

              <div className='flex-1 min-w-0'>
                {(selectedDurations.length > 0 ||
                  selectedCategories.length > 0) && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {[...selectedDurations, ...selectedCategories].map(f => (
                      <Badge
                        key={f}
                        variant='secondary'
                        className='cursor-pointer text-xs rounded-full'
                        onClick={() => {
                          if (DURATION_OPTIONS.includes(f)) toggleDuration(f)
                          else toggleCategory(f)
                        }}
                      >
                        {f} ✕
                      </Badge>
                    ))}
                  </div>
                )}

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
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                          Show more majors <ChevronDown size={14} />
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

// Universities tab (i swear break down the components)

function UniversitiesTab({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<SelectMajorResponse | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('chosenMajorData')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setData(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <p className='text-3xl mb-3'>🏫</p>
        <h2 className='text-xl font-bold text-foreground'>Universities</h2>
        <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
          No university data found. Please re-select your major.
        </p>
        <Button variant='outline' className='mt-4' onClick={onBack}>
          ← Back to Majors
        </Button>
      </div>
    )
  }

  const { selectedMajor, universities } = data

  return (
    <div>
      <div className='mb-6'>
        <button
          onClick={onBack}
          className='text-xs text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1 cursor-pointer'
        >
          ← Back to Majors
        </button>
        <h1 className='text-xl font-bold text-foreground'>
          Universities offering{' '}
          <span className='text-primary'>{selectedMajor.nameEn}</span>
        </h1>
        <p className='text-sm text-muted-foreground mt-0.5'>
          {universities.length} universit
          {universities.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {universities.map(uni => (
          <div
            key={uni.universityMajorId}
            className='bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow'
          >
            <div className='flex items-start justify-between'>
              <span
                className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                  uni.type === 'PUBLIC'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-accent text-accent-foreground'
                }`}
              >
                {uni.type}
              </span>
              <span className='text-xs text-muted-foreground'>
                {uni.durationYears} yrs
              </span>
            </div>

            <div>
              <h3 className='font-bold text-sm text-foreground leading-snug'>
                {uni.nameEn}
              </h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {uni.locationCity}
              </p>
            </div>

            <div className='h-px bg-border' />

            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>
                Tuition / year
              </span>
              <span className='text-sm font-bold text-foreground'>
                ${uni.tuitionFeeUsd.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
