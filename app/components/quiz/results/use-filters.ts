'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SearchParams, toArray } from './types'

export function useFilters(searchParams: SearchParams) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const searchQuery = searchParams.q ?? ''
  const selCategories = toArray(searchParams.category)
  const selOutlooks = toArray(searchParams.outlook)
  const minScore = parseFloat(searchParams.minScore ?? '0.5')
  const activeTab = searchParams.tab ?? 'majors'

  const [inputValue, setInputValue] = useState(searchQuery)

  // Declare updateUrl BEFORE the useEffect that references it
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

  useEffect(() => {
    const current = searchParams.q ?? ''
    if (inputValue === current) return

    const timer = setTimeout(() => {
      updateUrl({ q: inputValue || null })
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue, updateUrl, searchParams.q])

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

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

  const activeFilterCount =
    selCategories.length + selOutlooks.length + (minScore > 0.5 ? 1 : 0)
  const hasActiveFilters =
    !!searchQuery ||
    selCategories.length > 0 ||
    selOutlooks.length > 0 ||
    minScore > 0.5

  return {
    searchQuery,
    selCategories,
    selOutlooks,
    minScore,
    activeTab,
    inputValue,
    setInputValue,
    updateUrl,
    toggleFilter,
    clearAll,
    activeFilterCount,
    hasActiveFilters,
  }
}
