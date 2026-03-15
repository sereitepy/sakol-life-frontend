import { Question } from "@/lib/quiz/actions";

type SingleStep = { type: 'single'; question: Question }
type GroupStep = { type: 'group'; groupKey: string; questions: Question[] }
type Step = SingleStep | GroupStep

export default function buildSteps(questions: Question[]): Step[] {
  const steps: Step[] = []
  let i = 0
  while (i < questions.length) {
    const code = questions[i].questionCode
    const groupMatch = code.match(/^(Q\d+)[A-Z]$/)
    if (groupMatch) {
      const prefix = groupMatch[1]
      const group: Question[] = []
      while (
        i < questions.length &&
        questions[i].questionCode.startsWith(prefix) &&
        questions[i].questionCode.match(/^(Q\d+)[A-Z]$/)
      ) {
        group.push(questions[i])
        i++
      }
      steps.push({ type: 'group', groupKey: prefix, questions: group })
    } else {
      steps.push({ type: 'single', question: questions[i] })
      i++
    }
  }
  return steps
}