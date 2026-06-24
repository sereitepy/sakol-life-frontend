'use server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export type PublicMajor = {
  majorId: string
  code: string
  nameEn: string
  nameKh: string
  descriptionEn: string | null
  descriptionKh: string | null
  careerCategory: string | null
  jobOutlook: string | null
}

export type PublicUniversity = {
  universityId: string
  nameEn: string
  nameKh: string
  locationCity: string
  logoUrl: string | null
  bannerUrl: string | null
  websiteUrl: string | null
  type: 'PUBLIC' | 'PRIVATE'
}

export async function fetchAllMajors(): Promise<PublicMajor[]> {
  const res = await fetch(`${BACKEND_URL}/api/v1/majors`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch majors: ${res.statusText}`)
  return res.json()
}

export async function fetchAllUniversities(filters?: {
  type?: string
  city?: string
}): Promise<PublicUniversity[]> {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.city) params.set('city', filters.city)

  const url = `${BACKEND_URL}/api/v1/universities/all${params.toString() ? `?${params}` : ''}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok)
    throw new Error(`Failed to fetch universities: ${res.statusText}`)
  return res.json()
}
