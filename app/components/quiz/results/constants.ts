export const CAREER_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'SOFTWARE_DEVELOPMENT', label: 'Software Development' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'Artificial Intelligence' },
  { value: 'DATA_ANALYTICS', label: 'Data Analytics' },
  { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'DIGITAL_DESIGN', label: 'Digital Design' },
  { value: 'INFORMATION_SYSTEMS', label: 'Information Systems' },
]

export const JOB_OUTLOOK_OPTIONS: {
  value: string
  label: string
  color: string
}[] = [
  {
    value: 'HIGH',
    label: '🔥 High Demand',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    value: 'MEDIUM',
    label: '📈 Medium Demand',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  { value: 'LOW', label: '📉 Low Demand', color: 'text-muted-foreground' },
]

export const MIN_SCORE_OPTIONS: { value: string; label: string }[] = [
  { value: '0.5', label: 'All matches (50%+)' },
  { value: '0.6', label: 'Good (60%+)' },
  { value: '0.75', label: 'Strong (75%+)' },
  { value: '0.9', label: 'Excellent (90%+)' },
]
