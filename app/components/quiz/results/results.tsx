'use client'

import { useEffect, useState, useCallback, useMemo, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MajorResult, QuizSubmitResponse } from '@/lib/quiz/actions'
import { createClient } from '@/lib/supabase/client'
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  SlidersHorizontal,
  X,
  TrendingUp,
  Briefcase,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  selectMajor,
  deselectMajor,
  SelectMajorResponse,
  AuthIdentity,
  University,
} from '@/lib/profile/action'
import Image from 'next/image'

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
  { value: 'SOFTWARE_ENGINEERING', label: 'Software Engineering' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence' },
  { value: 'DATA_ANALYTICS', label: 'Data Analytics' },
  { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'DIGITAL_DESIGN', label: 'Digital Design' },
  { value: 'DATABASE', label: 'Database' },
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

const MAJOR_ICONS: Record<string, { emoji: string; bg: string }> = {
  AI: { emoji: '🤖', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  NET: { emoji: '🌐', bg: 'bg-green-100 dark:bg-green-900/30' },
  CYB: { emoji: '🛡️', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  DS: { emoji: '💻', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  MWD: { emoji: '📱', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  DD: { emoji: '🎨', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  DB: { emoji: '🗄️', bg: 'bg-sky-100 dark:bg-sky-900/30' },
  MIS: { emoji: '📊', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  CS: { emoji: '⚙️', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  DEFAULT: { emoji: '📚', bg: 'bg-muted' },
}

function getIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}

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

function matchBadge(pct: number) {
  if (pct >= 75)
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (pct >= 50)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

// Filter section

function FilterSection({
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
        onClick={() => setOpen(v => !v)}
        className='flex items-center justify-between w-full mb-3 cursor-pointer'
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
      {open && <div className='space-y-2'>{children}</div>}
    </div>
  )
}

// Major card

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
        <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap'>
          🏆 TOP MATCH
        </div>
      )}
      {isChosen && (
        <div className='absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1'>
          <CheckCircle2 size={10} /> CHOSEN
        </div>
      )}

      <div className='flex items-start justify-between'>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${icon.bg}`}
        >
          {icon.emoji}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${matchBadge(major.similarityPercentage ?? 0)}`}
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

      {/* Badges row */}
      <div className='flex flex-wrap gap-1.5'>
        {major.careerCategory && (
          <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20'>
            {major.careerCategory.replace(/_/g, ' ')}
          </span>
        )}
        {major.jobOutlook && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              major.jobOutlook === 'HIGH'
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                : major.jobOutlook === 'MEDIUM'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {major.jobOutlook === 'HIGH'
              ? '🔥'
              : major.jobOutlook === 'MEDIUM'
                ? '📈'
                : '📉'}{' '}
            {major.jobOutlook}
          </span>
        )}
      </div>

      {/* Progress bar */}
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
          className={`flex-1 text-xs rounded-lg cursor-pointer ${isChosen ? 'bg-green-500 hover:bg-green-600' : ''}`}
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

// Universities tab

function UniversitiesTab({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const [data, setData] = useState<SelectMajorResponse | null>(null)
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>(
    'ALL'
  )

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('chosenMajorData')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setData(JSON.parse(stored))
    } catch {
      /* ignore */
    }
  }, [])

  if (!data) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <p className='text-3xl mb-3'>🏫</p>
        <h2 className='text-xl font-bold text-foreground'>
          No university data
        </h2>
        <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
          Please re-select your major.
        </p>
        <Button variant='outline' className='mt-4' onClick={onBack}>
          ← Back to Majors
        </Button>
      </div>
    )
  }

  const filtered =
    typeFilter === 'ALL'
      ? data.universities
      : data.universities.filter(u => u.type === typeFilter)

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
          <span className='text-primary'>{data.major.nameEn}</span>
        </h1>
        <p className='text-sm text-muted-foreground mt-0.5'>
          {filtered.length} universit{filtered.length !== 1 ? 'ies' : 'y'} found
        </p>
      </div>

      {/* Type filter chips */}
      <div className='flex gap-2 mb-5'>
        {(['ALL', 'PUBLIC', 'PRIVATE'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              typeFilter === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {t === 'ALL' ? 'All Types' : t === 'PUBLIC' ? 'Public' : 'Private'}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filtered.map(uni => (
          <UniversityCard
            key={uni.universityId}
            uni={uni}
            onClick={() => router.push(`/universities/${uni.universityId}`)}
          />
        ))}
      </div>
    </div>
  )
}

function UniversityCard({
  uni,
  onClick,
}: {
  uni: University
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className='bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group'
    >
      {/* Banner */}
      <div className='relative h-32 bg-muted overflow-hidden'>
        {uni.bannerUrl ? (
          <Image
            src={uni.bannerUrl}
            alt={uni.nameEn}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-4xl'>
            🏫
          </div>
        )}
        <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent' />
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
            uni.type === 'PUBLIC'
              ? 'bg-primary/90 text-white'
              : 'bg-white/90 text-foreground'
          }`}
        >
          {uni.type}
        </span>
      </div>

      <div className='p-4 flex flex-col gap-2'>
        {/* Logo + Name */}
        <div className='flex items-start gap-3'>
          {uni.logoUrl && (
            <div className='w-10 h-10 rounded-lg border border-border bg-background shrink-0 overflow-hidden'>
              <Image
                src={uni.logoUrl}
                alt={uni.nameEn}
                width={40}
                height={40}
                className='object-contain'
              />
            </div>
          )}
          <div className='min-w-0'>
            <h3 className='font-bold text-sm text-foreground leading-snug line-clamp-2'>
              {uni.nameEn}
            </h3>
            <p className='text-xs text-muted-foreground mt-0.5'>
              📍 {uni.locationCity}
            </p>
          </div>
        </div>

        <div className='h-px bg-border' />

        <div className='flex items-center justify-between'>
          <span className='text-xs text-muted-foreground'>
            {uni.durationYears ? `${uni.durationYears} yrs` : '—'}
          </span>
          <span className='text-sm font-bold text-foreground'>
            {uni.tuitionFeeUsd
              ? `$${uni.tuitionFeeUsd.toLocaleString()}/yr`
              : 'Fee varies'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Main component

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
    let items = [...result.results].sort((a, b) => a.rank ?? 0 - (b.rank ?? 0))

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
    items = items.filter(m => m.similarityPercentage ?? 0 / 100 >= minScore)

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
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
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
              className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
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
                Based on your quiz answers — {filtered.length} major
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
                  placeholder='Search majors, skills, or industries...'
                  value={searchQuery}
                  onChange={e => updateUrl({ q: e.target.value || null })}
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
