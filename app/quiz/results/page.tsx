import GuestResultsGuard from "@/app/components/quiz/guest-results-guard"
import ResultsClient from "@/app/components/quiz/results"


type Props = {
  searchParams: Promise<{
    q?: string
    duration?: string | string[]
    category?: string | string[]
    tab?: string
  }>
}

export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams
  return (
    <GuestResultsGuard>
      <ResultsClient searchParams={params} />
    </GuestResultsGuard>
  )
}
