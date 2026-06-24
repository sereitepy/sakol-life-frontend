'use client'

import { ClipboardCheck, ListTodo, MessageSquare, Sliders } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
  const tSummary = useTranslations('survey_summary')
  const TOTAL_QUESTIONS = 12

  const CARDS = [
    {
      title: tSummary('total_attempts'),
      value: tSummary('attempts_suffix', { count: totalAttempts }),
      icon: <ClipboardCheck className='w-4 h-4 text-primary' />,
      bg: 'bg-primary/5 border-primary/10',
    },
    {
      title: tSummary('questions_answered'),
      value: tSummary('answered_suffix', { count: answeredCount, total: TOTAL_QUESTIONS }),
      icon: <ListTodo className='w-4 h-4 text-chart-2' />,
      bg: 'bg-chart-2/5 border-chart-2/10',
    },
    {
      title: tSummary('scale_ratings'),
      value: tSummary('count_suffix', { count: scaleCount }),
      icon: <Sliders className='w-4 h-4 text-chart-3' />,
      bg: 'bg-chart-3/5 border-chart-3/10',
    },
    {
      title: tSummary('multiple_choice'),
      value: tSummary('count_suffix', { count: choiceCount }),
      icon: <MessageSquare className='w-4 h-4 text-chart-4' />,
      bg: 'bg-chart-4/5 border-chart-4/10',
    },
  ]

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-[clamp(10px,1.5vw,16px)] w-full'>
      {CARDS.map((card, idx) => (
        <div
          key={idx}
          className={`p-[clamp(12px,2vw,20px)] rounded-xl border flex flex-col justify-between gap-3 bg-card min-w-0 ${card.bg}`}
        >
          <div className='flex items-center justify-between gap-2 w-full'>
            <span className='text-[clamp(11px,1.2vw,13px)] font-bold text-muted-foreground truncate leading-tight'>
              {card.title}
            </span>
            <div className='p-1.5 rounded-lg bg-card border border-border shrink-0 select-none hidden sm:block'>
              {card.icon}
            </div>
          </div>
          <span className='text-[clamp(16px,2vw,22px)] font-extrabold text-foreground tracking-tight leading-none truncate mt-0.5'>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  )
}