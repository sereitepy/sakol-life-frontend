import {
  CircleGauge,
  Star,
  Radio,
  Map,
  Monitor,
  BarChart2,
  Shield,
  Wifi,
  Palette,
  Briefcase,
  Brain,
  Code,
  Lock,
  Globe,
  Database,
  Settings,
  Lightbulb,
  Rocket,
  Users,
  BookOpen,
} from 'lucide-react'

export const OPTION_ICONS = [
  CircleGauge,
  Star,
  Radio,
  Map,
  Monitor,
  BarChart2,
  Shield,
  Wifi,
  Palette,
  Briefcase,
  Brain,
  Code,
  Lock,
  Globe,
  Database,
  Settings,
  Lightbulb,
  Rocket,
  Users,
  BookOpen,
]

export const LIKERT_LABELS: Record<string, { low: string; high: string }> = {
  Q2: { low: 'Not confident at all', high: 'Extremely confident' },
  Q7: { low: 'Dislike it', high: 'Love it' },
  Q8: { low: 'Not interested', high: 'Extremely interested' },
  Q9: { low: 'Very uncomfortable', high: 'Very comfortable' },
  Q11: { low: 'Not important', high: 'Extremely important' },
  Q13: { low: 'Not excited at all', high: 'Extremely excited' },
  Q4A: { low: 'Not interested', high: 'Extremely interested' },
  Q4B: { low: 'Not interested', high: 'Extremely interested' },
  Q4C: { low: 'Not interested', high: 'Extremely interested' },
  Q4D: { low: 'Not interested', high: 'Extremely interested' },
  Q4E: { low: 'Not interested', high: 'Extremely interested' },
  Q4F: { low: 'Not interested', high: 'Extremely interested' },
  Q4G: { low: 'Not interested', high: 'Extremely interested' },
}
export const DEFAULT_LABELS = {
  low: 'Strongly disagree',
  high: 'Strongly agree',
}
export const getLikertLabels = (code: string) =>
  LIKERT_LABELS[code] ?? DEFAULT_LABELS

export const ADVANCE_DELAY_MS = 550