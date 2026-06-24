'use client'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { Building2, MapPin } from 'lucide-react'
import FilterSection from '@/app/components/quiz/results/major-filters'
import { PublicUniversity } from '@/lib/view/view-all'
import UniversityCardPublic from './universities-card-public'

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'All Types' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Private' },
] as const

type TypeFilter = 'ALL' | 'PUBLIC' | 'PRIVATE'

function UniversityFilterPanel({
  cities,
  typeFilter,
  selCities,
  hasActiveFilters,
  onTypeChange,
  onToggleCity,
  onClearAll,
}: {
  cities: string[]
  typeFilter: TypeFilter
  selCities: string[]
  hasActiveFilters: boolean
  onTypeChange: (t: TypeFilter) => void
  onToggleCity: (city: string) => void
  onClearAll: () => void
}) {
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

      <FilterSection title='Type' icon={Building2}>
        {TYPE_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className='flex items-center gap-2 cursor-pointer'
          >
            <input
              type='radio'
              name='uniType'
              checked={typeFilter === opt.value}
              onChange={() => onTypeChange(opt.value)}
              className='accent-primary'
            />
            <span className='text-sm text-foreground'>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      {cities.length > 1 && (
        <FilterSection title='City' icon={MapPin}>
          {cities.map(city => (
            <label
              key={city}
              className='flex items-center gap-2 cursor-pointer'
            >
              <Checkbox
                checked={selCities.includes(city)}
                onCheckedChange={() => onToggleCity(city)}
                className='data-[state=checked]:bg-primary data-[state=checked]:border-primary border-accent-foreground/20 rounded-sm'
              />
              <span className='text-sm text-foreground'>{city}</span>
            </label>
          ))}
        </FilterSection>
      )}
    </div>
  )
}

export default function UniversitiesBrowseClient({
  universities,
}: {
  universities: PublicUniversity[]
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL')
  const [selCities, setSelCities] = useState<string[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const cities = useMemo(() => {
    const set = new Set(universities.map(u => u.locationCity).filter(Boolean))
    return Array.from(set).sort() as string[]
  }, [universities])

  const filtered = useMemo(() => {
    let items = [...universities]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        u =>
          u.nameEn.toLowerCase().includes(q) ||
          u.nameKh?.toLowerCase().includes(q) ||
          u.locationCity?.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'ALL') items = items.filter(u => u.type === typeFilter)
    if (selCities.length > 0)
      items = items.filter(u => selCities.includes(u.locationCity))
    return items
  }, [universities, searchQuery, typeFilter, selCities])

  const hasActiveFilters = typeFilter !== 'ALL' || selCities.length > 0
  const activeFilterCount = (typeFilter !== 'ALL' ? 1 : 0) + selCities.length

  function toggleCity(city: string) {
    setSelCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    )
  }

  function clearAll() {
    setTypeFilter('ALL')
    setSelCities([])
    setInputValue('')
    setSearchQuery('')
  }

  const filterProps = {
    cities,
    typeFilter,
    selCities,
    hasActiveFilters,
    onTypeChange: setTypeFilter,
    onToggleCity: toggleCity,
    onClearAll: clearAll,
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b border-border bg-card'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
          <h1 className='text-2xl font-bold text-foreground'>
            All Universities
          </h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Browse {universities.length} universities
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
              placeholder='Search universities or cities…'
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value)
                setSearchQuery(e.target.value)
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
            <UniversityFilterPanel {...filterProps} />
          </div>
        )}

        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {typeFilter !== 'ALL' && (
              <Badge
                variant='secondary'
                className='cursor-pointer text-xs rounded-full'
                onClick={() => setTypeFilter('ALL')}
              >
                {typeFilter} <X size={10} className='ml-1' />
              </Badge>
            )}
            {selCities.map(c => (
              <Badge
                key={c}
                variant='secondary'
                className='cursor-pointer text-xs rounded-full'
                onClick={() => toggleCity(c)}
              >
                {c} <X size={10} className='ml-1' />
              </Badge>
            ))}
          </div>
        )}

        <div className='flex gap-5 items-start'>
          <aside className='hidden lg:block w-60 shrink-0'>
            <UniversityFilterPanel {...filterProps} />
          </aside>

          <div className='flex-1 min-w-0'>
            {filtered.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <p className='text-3xl mb-2'>🔍</p>
                <p className='font-semibold text-foreground'>
                  No universities found
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
                <p className='text-xs text-muted-foreground mb-4'>
                  {filtered.length} universit
                  {filtered.length !== 1 ? 'ies' : 'y'}
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {filtered.map(uni => (
                    <UniversityCardPublic
                      key={uni.universityId}
                      uni={uni}
                      onClick={() =>
                        startTransition(() =>
                          router.push(`/universities/${uni.universityId}`)
                        )
                      }
                      onViewMajors={() =>
                        startTransition(() =>
                          router.push(
                            `/universities/${uni.universityId}#majors`
                          )
                        )
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
