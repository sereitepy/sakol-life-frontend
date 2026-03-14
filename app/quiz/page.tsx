import { fetchQuizQuestions } from "@/lib/quiz/actions"
import QuizClient from "../components/quiz"


export default async function QuizPage() {
  const questions = await fetchQuizQuestions()

  return <QuizClient questions={questions} />
}
