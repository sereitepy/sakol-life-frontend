import { ProfileResponse } from '@/lib/profile/action'

export type PersonalityTag = { 
  key: string // Replaced hardcoded 'label' with global translation key identifier
  color: string 
}

export function derivePersonalityTags(
  answers: ProfileResponse['latestAnswers']
): PersonalityTag[] {
  const map: Record<string, string | number> = {}
  for (const a of answers) map[a.questionCode] = a.answerValue

  const q4a = Number(map['Q4_A'] ?? 0)
  const q4b = Number(map['Q4_B'] ?? 0)
  const q4c = Number(map['Q4_C'] ?? 0)
  const q4d = Number(map['Q4_D'] ?? 0)
  const q4e = Number(map['Q4_E'] ?? 0)
  const q4f = Number(map['Q4_F'] ?? 0)
  const q4g = Number(map['Q4_G'] ?? 0)

  const tags: PersonalityTag[] = []

  if (q4d >= 4 || q4a >= 4)
    tags.push({
      key: 'visual_thinker',
      color: 'bg-primary/10 text-primary border-primary/20',
    })
  if (q4b >= 4 || q4g >= 4)
    tags.push({
      key: 'problem_solver',
      color: 'bg-accent text-accent-foreground border-accent-foreground/10',
    })
  if (q4c >= 4 || q4f >= 4)
    tags.push({
      key: 'logical',
      color:
        'bg-secondary text-secondary-foreground border-secondary-foreground/10',
    })
  if (q4e >= 3)
    tags.push({
      key: 'detail_oriented',
      color: 'bg-muted text-muted-foreground border-border',
    })
  if (q4a >= 3 && q4d >= 3)
    tags.push({
      key: 'creative_learner',
      color: 'bg-primary/10 text-primary border-primary/20',
    })

  if (tags.length === 0) {
    tags.push({
      key: 'curious_learner',
      color: 'bg-accent text-accent-foreground border-accent-foreground/10',
    })
    tags.push({
      key: 'analytical',
      color:
        'bg-secondary text-secondary-foreground border-secondary-foreground/10',
    })
  }

  return tags
}