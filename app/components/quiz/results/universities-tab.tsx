'use client'

import UniversityCard from "./university-card"
import { SelectMajorResponse } from "@/lib/profile/action"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation" // Standard fallback to next/navigation while routing config initializes

export default function UniversitiesTab({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const locale = useLocale()
  const tCard = useTranslations('uni_card')
  
  const [data, setData] = useState<SelectMajorResponse | null>(null)
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>(
    'ALL'
  )

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('chosenMajorData')
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
          {tCard('no_uni_data')}
        </h2>
        <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
          {tCard('reselect_major_desc')}
        </p>
        <Button variant='outline' className='mt-4' onClick={onBack}>
          {tCard('back_to_majors')}
        </Button>
      </div>
    )
  }

  const filtered =
    typeFilter === 'ALL'
      ? data.universities
      : data.universities.filter(u => u.type === typeFilter)

  // Choose the dynamic major name translation safely
  const currentMajorName = locale === 'km' ? (data.major.nameKm || data.major.nameEn) : data.major.nameEn

  return (
    <div>
      <div className='mb-6'>
        <button
          onClick={onBack}
          className='text-xs text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1 cursor-pointer'
        >
          {tCard('back_to_majors')}
        </button>
        <h1 className='text-xl font-bold text-foreground'>
          {tCard('universities_offering')}{' '}
          <span className='text-primary'>{currentMajorName}</span>
        </h1>
        <p className='text-sm text-muted-foreground mt-0.5'>
          {tCard('universities_found', { count: filtered.length })}
        </p>
      </div>

      {/* Type filter chips */}
      <div className='flex gap-2 mb-5'>
        {(['ALL', 'PUBLIC', 'PRIVATE'] as const).map(t => {
          const label = t === 'ALL' 
            ? tCard('all_types') 
            : t === 'PUBLIC' 
              ? tCard('public') 
              : tCard('private')

          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filtered.map(uni => (
          <UniversityCard
            key={uni.universityId}
            uni={uni}
            onClick={() => router.push(`/${locale}/universities/${uni.universityId}`)} // Explicitly inject locale to prevent router context drops
          />
        ))}
      </div>
    </div>
  )
}