'use server'

const BACKEND_URL = process.env.BACKEND_URL

export type SelectedMajor = {
  majorId: string
  code: string
  nameEn: string
  nameKh: string
  descriptionEn: string
  descriptionKh: string
  careerCategory: string | null
  jobOutlook: string | null
}

export type LatestAnswer = {
  questionCode: string
  answerValue: string
}

export type ProfileResponse = {
  id: string
  displayName: string
  profilePictureUrl: string
  preferredLanguage: 'EN' | 'KH'
  role: 'USER' | 'ADMIN'
  totalAttempts: number
  selectedMajor: SelectedMajor | null
  latestAnswers: LatestAnswer[]
}

export async function initProfile(
  accessToken: string,
  displayName: string
): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/v1/profile/init`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ displayName }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to init profile: ${res.statusText}`)
}

export async function fetchProfile(
  accessToken: string
): Promise<ProfileResponse> {
  const res = await fetch(`${BACKEND_URL}/api/v1/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`)
  return res.json()
}

export async function updateProfile(
  accessToken: string,
  updates: {
    displayName?: string
    preferredLanguage?: 'EN' | 'KH'
    profilePictureUrl?: string
  }
): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/v1/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to update profile: ${res.statusText}`)
}

export type QuizHistory = { totalAttempts: number }

export async function fetchQuizHistory(
  accessToken: string
): Promise<QuizHistory> {
  const res = await fetch(`${BACKEND_URL}/api/v1/quiz/history`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok)
    throw new Error(`Failed to fetch quiz history: ${res.statusText}`)
  return res.json()
}

export type AuthIdentity =
  | { type: 'user'; userId: string; accessToken: string }
  | { type: 'guest'; guestSessionId: string }

function buildIdentityHeaders(identity: AuthIdentity): Record<string, string> {
  if (identity.type === 'user') {
    return {
      Authorization: `Bearer ${identity.accessToken}`,
    }
  }
  return { 'X-Guest-Session-Id': identity.guestSessionId }
}

export type University = {
  universityId: string
  nameEn: string
  nameKh: string
  type: 'PUBLIC' | 'PRIVATE'
  locationCity: string
  logoUrl: string | null
  bannerUrl: string | null
  websiteUrl: string | null
  tuitionFeeUsd: number | null
  durationYears: number | null
}

export type SelectMajorResponse = {
  selected: boolean
  major: {
    majorId: string
    code: string
    nameEn: string
    nameKh: string
    descriptionEn: string
    descriptionKh: string
    careerCategory: string | null
    jobOutlook: string | null
  }
  universities: University[]
}

// PUT /api/v1/selected-major

export async function selectMajor(
  majorId: string,
  identity: AuthIdentity
): Promise<SelectMajorResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...buildIdentityHeaders(identity),
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/selected-major`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ majorId }),
  })

  if (!res.ok) throw new Error(`Failed to select major: ${res.statusText}`)
  return res.json()
}

/**
 * DELETE /api/v1/selected-major
 * Deselects the current major.
 */
export async function deselectMajor(identity: AuthIdentity): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/v1/selected-major`, {
    method: 'DELETE',
    headers: buildIdentityHeaders(identity),
  })
  if (!res.ok) throw new Error(`Failed to deselect major: ${res.statusText}`)
}

/**
 * GET /api/v1/selected-major/universities
 * Returns universities for the currently selected major with optional filters.
 */
export async function fetchUniversitiesForSelectedMajor(
  identity: AuthIdentity,
  filters?: {
    type?: 'PUBLIC' | 'PRIVATE'
    city?: string
    maxFee?: number
    durationYears?: number
  }
): Promise<{
  selectedMajor: SelectMajorResponse['major']
  universities: University[]
}> {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.city) params.set('city', filters.city)
  if (filters?.maxFee) params.set('maxFee', String(filters.maxFee))
  if (filters?.durationYears)
    params.set('durationYears', String(filters.durationYears))

  const url = `${BACKEND_URL}/api/v1/selected-major/universities${params.toString() ? `?${params}` : ''}`

  const res = await fetch(url, {
    headers: buildIdentityHeaders(identity),
    cache: 'no-store',
  })

  if (res.status === 409) throw new Error('NO_MAJOR_SELECTED')
  if (!res.ok)
    throw new Error(`Failed to fetch universities: ${res.statusText}`)
  return res.json()
}

export type MajorSubject = {
  id: string
  nameEn: string
  nameKh: string | null
  descriptionEn: string | null
  descriptionKh: string | null
  iconKey: string | null
  displayOrder: number
}

export type MajorSkill = {
  id: string
  nameEn: string
  nameKh: string | null
  displayOrder: number
}

export type MajorCareerOpportunity = {
  id: string
  titleEn: string
  titleKh: string | null
  iconKey: string | null
}

export type MajorDetailResponse = {
  majorId: string
  code: string
  nameEn: string
  nameKh: string
  faculty: string | null
  degreeType: string | null
  language: string | null
  iconUrl: string | null
  descriptionEn: string | null
  descriptionKh: string | null
  careerCategory: string | null
  jobOutlook: string | null
  updatedAt: string | null
  similarityPercentage: number | null
  subjects: MajorSubject[]
  technicalSkills: MajorSkill[]
  softSkills: MajorSkill[]
  careerOpportunities: MajorCareerOpportunity[]
  jobMarket: {
    demandLevel: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW'
    salaryMin: number
    salaryMax: number
    currency: string
    period: string
  }
  relatedMajors: {
    majorId: string
    code: string
    nameEn: string
    nameKh: string
    careerCategory: string | null
    iconUrl: string | null
  }[]
}

export async function fetchMajorDetail(
  majorId: string,
  accessToken?: string
): Promise<MajorDetailResponse> {
  const headers: Record<string, string> = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const res = await fetch(`${BACKEND_URL}/api/v1/majors/${majorId}/detail`, {
    headers,
    cache: 'no-store',
  })
  if (!res.ok)
    throw new Error(`Failed to fetch major detail: ${res.statusText}`)
  return res.json()
}

export type AdmissionRequirement = {
  id: string
  titleEn: string
  titleKh: string | null
  descriptionEn: string | null
  descriptionKh: string | null
  linkLabelEn: string | null
  linkUrl: string | null
  iconKey: string | null
  displayOrder: number
}

export type TuitionFeeRow = {
  id: string
  programTypeEn: string
  programTypeKh: string | null
  feePerSemester: number | null
  feePerYear: number | null
  notesEn: string | null
  displayOrder: number
}

export type Scholarship = {
  id: string
  nameEn: string
  nameKh: string | null
  coverageLabel: string | null
  descriptionEn: string | null
  deadline: string | null
}

export type Facility = {
  id: string
  nameEn: string
  iconKey: string | null
  displayOrder: number
}

export type FacilityPhoto = {
  id: string
  photoUrl: string
  altTextEn: string | null
  displayOrder: number
}

export type UniversityDetailResponse = {
  universityId: string
  nameEn: string
  nameKh: string
  type: 'PUBLIC' | 'PRIVATE'
  locationCity: string
  logoUrl: string | null
  bannerUrl: string | null
  websiteUrl: string | null
  establishedDate: string | null
  accreditation: string | null
  overviewEn: string | null
  overviewKh: string | null
  selectedMajorProgram: {
    universityMajorId: string
    majorId: string
    majorCode: string
    majorNameEn: string
    majorNameKh: string | null
    department: string | null
    degreeType: string | null
    durationYears: number | null
    credits: number | null
    language: string | null
    internshipRequired: boolean
    careerProspects: string[]
  } | null
  admissionRequirements: AdmissionRequirement[]
  tuitionFees: TuitionFeeRow[]
  scholarships: Scholarship[]
  facilities: Facility[]
  facilityPhotos: FacilityPhoto[]
}

export async function fetchUniversityDetail(
  universityId: string,
  identity?: AuthIdentity
): Promise<UniversityDetailResponse> {
  const headers: Record<string, string> = {}
  if (identity) Object.assign(headers, buildIdentityHeaders(identity))

  const res = await fetch(
    `${BACKEND_URL}/api/v1/universities/${universityId}/detail`,
    {
      headers,
      cache: 'no-store',
    }
  )
  if (!res.ok)
    throw new Error(`Failed to fetch university detail: ${res.statusText}`)
  return res.json()
}
