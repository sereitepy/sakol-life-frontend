'use server'

const BACKEND_URL = process.env.BACKEND_URL

export type SelectedMajor = {
  majorId: string
  code: string
  nameEn: string
  nameKh: string
  descriptionEn: string
  descriptionKh: string
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

// ─── Major selection types ────────────────────────────────────────────────────

export type University = {
  universityMajorId: string
  universityId: string
  nameEn: string
  nameKh: string
  type: 'PUBLIC' | 'PRIVATE'
  locationCity: string
  tuitionFeeUsd: number
  durationYears: number
}

export type SelectMajorResponse = {
  selectedMajor: {
    id: string
    code: string
    nameEn: string
    nameKh: string
  }
  universities: University[]
}

export type GuestSelectedMajor = {
  majorId: string
  code: string
  nameEn: string
  nameKh: string
  selectedAt: string
}

// ─── Select a major ───────────────────────────────────────────────────────────
//
// Spring Security guards ALL endpoints with Bearer token validation.
// The controller then reads X-User-Id / X-Guest-Session-Id to identify the actor.
//
// So we always need:
//   Authorization: Bearer <token>   ← satisfies Spring Security
//   X-User-Id OR X-Guest-Session-Id ← used by the controller logic
//
// For guests the accessToken is null — the endpoint allows unauthenticated
// requests as long as X-Guest-Session-Id is present (check your SecurityConfig).

export async function selectMajor(
  majorId: string,
  identity:
    | { type: 'user'; userId: string; accessToken: string }
    | { type: 'guest'; guestSessionId: string }
): Promise<SelectMajorResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (identity.type === 'user') {
    // Authenticated user: Spring Security needs the Bearer token,
    // controller reads X-User-Id for the actual user identification
    headers['Authorization'] = `Bearer ${identity.accessToken}`
    headers['X-User-Id'] = identity.userId
  } else {
    // Guest: no Bearer token, controller reads X-Guest-Session-Id
    headers['X-Guest-Session-Id'] = identity.guestSessionId
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/majors/${majorId}/select`, {
    method: 'POST',
    headers,
  })

  if (!res.ok) throw new Error(`Failed to select major: ${res.statusText}`)
  return res.json()
}

// ─── Get current selected major ───────────────────────────────────────────────

export async function fetchSelectedMajor(
  identity:
    | { type: 'user'; userId: string; accessToken: string }
    | { type: 'guest'; guestSessionId: string }
): Promise<GuestSelectedMajor | null> {
  const headers: Record<string, string> = {}

  if (identity.type === 'user') {
    headers['Authorization'] = `Bearer ${identity.accessToken}`
    headers['X-User-Id'] = identity.userId
  } else {
    headers['X-Guest-Session-Id'] = identity.guestSessionId
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/majors/selected`, {
    headers,
    cache: 'no-store',
  })

  if (res.status === 404) return null
  if (!res.ok)
    throw new Error(`Failed to fetch selected major: ${res.statusText}`)
  return res.json()
}


