'use server'

const BACKEND_URL = process.env.BACKEND_URL

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
  descriptionEn: string
  descriptionKh: string
  rank: number
  similarityScore: number
  similarityPercentage: number
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
  const res = await fetch(`${BACKEND_URL}/api/v1/quiz/questions`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch quiz questions: ${res.statusText}`)
  }

  const data: Question[] = await res.json()
  return data.sort((a, b) => a.displayOrder - b.displayOrder)
}

// Submit quiz answers — body is { Q1: "A", Q2: 4, ... }
export async function submitQuizAnswers(
  answers: Answer[]
): Promise<QuizSubmitResponse> {
  // Transform array of answers into the flat { questionCode: value } format the API expects
  const body: Record<string, string | number> = {}
  for (const answer of answers) {
    body[answer.questionCode] = answer.value
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Failed to submit quiz: ${res.statusText}`)
  }

  return res.json()
}

export async function fetchQuizHistory(
  accessKey: string
): Promise<QuizHistory> {
  const res = await fetch(`${BACKEND_URL}/api/v1/quiz/history`, {
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
  const res = await fetch(`${BACKEND_URL}/api/v1/majors/results/${attemptId}`, {
    headers: { Authorization: `Bearer ${accessKey}` },
    cache: 'no-store',
  })
  if (!res.ok)
    throw new Error(`Failed to fetch major results: ${res.statusText}`)
  return res.json()
}
