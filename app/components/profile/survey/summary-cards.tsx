type Props = {
  totalAttempts: number
  answeredCount: number
  scaleCount: number
  choiceCount: number
}

export function SurveySummaryCards({
  totalAttempts,
  answeredCount,
  scaleCount,
  choiceCount,
}: Props) {
  const stats = [
    { value: totalAttempts, label: 'Total Attempts' },
    { value: answeredCount, label: 'Questions Answered' },
    { value: scaleCount, label: 'Interest Ratings' },
    { value: choiceCount, label: 'Preference Choices' },
  ]

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
      {stats.map(s => (
        <div
          key={s.label}
          className='bg-card border border-border rounded-2xl p-4 text-center'
        >
          <p className='text-2xl font-extrabold text-foreground'>{s.value}</p>
          <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1'>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}
