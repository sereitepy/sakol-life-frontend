'use client'

import { useRouter } from "next/navigation"
import UniversityCard from "./university-card"
import { SelectMajorResponse } from "@/lib/profile/action"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function UniversitiesTab({ onBack }: { onBack: () => void }) {
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
