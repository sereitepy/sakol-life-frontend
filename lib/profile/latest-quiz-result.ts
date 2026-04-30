'use server'

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export type QuizStateResult = {
  recommendations: {
    code: string
    nameEn: string
    majorId: string
    similarityPercentage: number
  }[]
  topMatch: {
    code: string
    nameEn: string
    majorId: string
    similarityPercentage: number
  } | null
}

export async function fetchDashboardQuizState(
  accessToken: string
): Promise<QuizStateResult> {
  try {
    const res = await fetch(
      `${NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/latest-results`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      }
    )
    if (!res.ok) return { recommendations: [], topMatch: null }

    const data = await res.json()
    const results: {
      code?: string
      nameEn: string
      majorId: string
      similarityPercentage?: number
    }[] = data.results ?? []

    const mapped = results.map(r => ({
      code: r.code ?? '',
      nameEn: r.nameEn,
      majorId: r.majorId,
      similarityPercentage: r.similarityPercentage ?? 0,
    }))

    return {
      recommendations: mapped.slice(0, 3),
      topMatch: mapped[0] ?? null,
    }
  } catch {
    return { recommendations: [], topMatch: null }
  }
}
