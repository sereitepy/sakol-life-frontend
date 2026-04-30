'use server'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export type QuestionFormat = 'SINGLE_CHOICE' | 'LIKERT'

export type QuestionOption = {
  id?: string
  optionLetter: string
  textEn: string
  textKh: string
  displayOrder: number
}

export type Question = {
  id: string
  questionCode: string
  textEn: string
  textKh: string
  format: QuestionFormat
  displayOrder: number
  options: QuestionOption[]
}

export type Answer = {
  questionId: string
  questionCode: string
  value: string | number
}

export type MajorResult = {
  majorId: string
  code: string
  nameEn: string
  nameKh: string
  descriptionEn: string | null
  descriptionKh: string | null
  faculty: string | null
  degreeType: string | null
  language: string | null
  iconUrl: string | null
  careerCategory: CareerCategory | null
  jobOutlook: JobOutlook | null
  jobDemandLevel: JobDemandLevel | null
  salaryMin: number | null
  salaryMax: number | null
  riasecR: number
  riasecI: number
  riasecA: number
  riasecS: number
  riasecE: number
  riasecC: number
  subjects: MajorSubject[]
  skills: MajorSkill[]
  careerOpportunities: MajorCareerOpportunity[]
  createdAt: string
  updatedAt: string
  // computed by API
  rank?: number
  similarityScore?: number
  similarityPercentage?: number | undefined
}

export type CareerCategory =
  | 'STEM'
  | 'BUSINESS'
  | 'ARTS'
  | 'SOCIAL'
  | 'HEALTH'
  | 'EDUCATION'
  | 'LAW'
  | 'OTHER'

export type JobOutlook = 'HIGH' | 'MEDIUM' | 'LOW'

export type JobDemandLevel =
  | 'VERY_HIGH'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'VERY_LOW'

export type MajorSubject = {
  id: string
  displayOrder: number
}

export type MajorSkill = {
  id: string
  displayOrder: number
}

export type MajorCareerOpportunity = {
  id: string
  displayOrder: number
}

export type QuizSubmitResponse = {
  attemptId: string
  attemptNumber: number
  studentVector: number[]
  results: MajorResult[]
}

export type QuizHistory = {
  totalAttempts: number
}

// Fetch all quiz questions from the API
export async function fetchQuizQuestions(): Promise<Question[]> {
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/questions`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch quiz questions: ${res.statusText}`)
  }

  const data: Question[] = await res.json()
  return data.sort((a, b) => a.displayOrder - b.displayOrder)
}

// Submit quiz answers
export async function submitQuizAnswers(
  answers: Answer[]
): Promise<QuizSubmitResponse> {
  const body: Record<string, string | number> = {}
  for (const answer of answers) {
    body[answer.questionCode] = answer.value
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Failed to submit quiz: ${res.statusText}`)
  return res.json()
}

export async function fetchQuizHistory(
  accessKey: string
): Promise<QuizHistory> {
  const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/history`, {
    headers: { Authorization: `Bearer ${accessKey}` },
    cache: 'no-store',
  })
  if (!res.ok)
    throw new Error(`Failed to fetch quiz history: ${res.statusText}`)
  return res.json()
}

export async function fetchLatestMajorResults(
  attemptId: string,
  accessKey: string
): Promise<MajorResult[]> {
  const res = await fetch(
    `${NEXT_PUBLIC_BACKEND_URL}/api/v1/majors/results/${attemptId}`,
    {
      headers: { Authorization: `Bearer ${accessKey}` },
      cache: 'no-store',
    }
  )
  if (!res.ok)
    throw new Error(`Failed to fetch major results: ${res.statusText}`)
  return res.json()
}

export async function fetchLatestResults(
  accessToken: string
): Promise<QuizSubmitResponse> {
  const res = await fetch(
    `${NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/latest-results`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  )
  if (res.status === 404) throw new Error('NO_QUIZ_ATTEMPT')
  if (!res.ok)
    throw new Error(`Failed to fetch latest results: ${res.statusText}`)
  return res.json()
}