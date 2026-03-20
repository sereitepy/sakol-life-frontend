import { Button } from '@/components/ui/button'
import { MajorResult } from '@/lib/quiz/actions'
import { CheckCircle2 } from 'lucide-react'

const MAJOR_ICONS: Record<string, { emoji: string; bg: string }> = {
  AI: { emoji: '🤖', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  NET: { emoji: '🌐', bg: 'bg-green-100 dark:bg-green-900/30' },
  CYB: { emoji: '🛡️', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  DS: { emoji: '💻', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  MWD: { emoji: '📱', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  DD: { emoji: '🎨', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  DB: { emoji: '🗄️', bg: 'bg-sky-100 dark:bg-sky-900/30' },
  MIS: { emoji: '📊', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  CS: { emoji: '⚙️', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  DEFAULT: { emoji: '📚', bg: 'bg-muted' },
}

export const MAJOR_META: Record<
  string,
  { careerCategory: string; jobOutlook: string }
> = {
  CS: { careerCategory: 'SOFTWARE_ENGINEERING', jobOutlook: 'HIGH' },
  AI: { careerCategory: 'ARTIFICIAL_INTELLIGENCE', jobOutlook: 'HIGH' },
  DS: { careerCategory: 'DATA_ANALYTICS', jobOutlook: 'HIGH' },
  MWD: { careerCategory: 'WEB_DEVELOPMENT', jobOutlook: 'HIGH' },
  CYB: { careerCategory: 'CYBERSECURITY', jobOutlook: 'HIGH' },
  NET: { careerCategory: 'NETWORKING', jobOutlook: 'MEDIUM' },
  DD: { careerCategory: 'DIGITAL_DESIGN', jobOutlook: 'MEDIUM' },
  MIS: { careerCategory: 'INFORMATION_SYSTEMS', jobOutlook: 'MEDIUM' },
  DB: { careerCategory: 'DATABASE', jobOutlook: 'MEDIUM' },
  CE: { careerCategory: 'SOFTWARE_ENGINEERING', jobOutlook: 'HIGH' },
}

function getIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}

function matchBadge(pct: number) {
  if (pct >= 75)
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (pct >= 50)
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

export default function MajorCard({
  major,
  isTop,
  isChosen,
  isSelecting,
  onView,
  onChoose,
}: {
  major: MajorResult
  isTop: boolean
  isChosen: boolean
  isSelecting: boolean
  onView: () => void
  onChoose: () => void
}) {
  const icon = getIcon(major.code)
  const cat = major.careerCategory ?? MAJOR_META[major.code]?.careerCategory
  const outlook = major.jobOutlook ?? MAJOR_META[major.code]?.jobOutlook

  return (
    <div
      className={`
      relative bg-card rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200
      ${
        isChosen
          ? 'ring-2 ring-primary shadow-lg shadow-primary/10'
          : isTop
            ? 'ring-2 ring-primary/40 shadow-md'
            : 'border border-border hover:shadow-md hover:-translate-y-0.5'
      }
    `}
    >
      {isTop && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap'>
          🏆 TOP MATCH
        </div>
      )}
      {isChosen && (
        <div className='absolute -top-3 right-4 bg-green-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1'>
          <CheckCircle2 size={10} /> CHOSEN
        </div>
      )}

      <div className='flex items-start justify-between'>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${icon.bg}`}
        >
          {icon.emoji}
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${matchBadge(major.similarityPercentage ?? 0)}`}
        >
          ✦ {major.similarityPercentage}% Match
        </span>
      </div>

      <div>
        <h3 className='font-bold text-base text-foreground'>{major.nameEn}</h3>
        <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed'>
          {major.descriptionEn}
        </p>
      </div>

      {/* Badges row */}
      <div className='flex flex-wrap gap-1.5'>
        {(() => {
          const cat =
            major.careerCategory ?? MAJOR_META[major.code]?.careerCategory
          const outlook = major.jobOutlook ?? MAJOR_META[major.code]?.jobOutlook
          return (
            <>
              {cat && (
                <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20'>
                  {cat.replace(/_/g, ' ')}
                </span>
              )}
              {outlook && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    outlook === 'HIGH'
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                      : outlook === 'MEDIUM'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {outlook === 'HIGH'
                    ? '🔥'
                    : outlook === 'MEDIUM'
                      ? '📈'
                      : '📉'}{' '}
                  {outlook}
                </span>
              )}
            </>
          )
        })()}
       
      </div>

      {/* Progress bar */}
      <div>
        <div className='flex justify-between text-xs mb-1'>
          <span className='text-muted-foreground'>Compatibility</span>
          <span className='font-semibold text-primary'>
            {major.similarityPercentage}%
          </span>
        </div>
        <div className='h-1.5 bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary rounded-full transition-all duration-700'
            style={{ width: `${major.similarityPercentage}%` }}
          />
        </div>
      </div>

      <div className='h-px bg-border' />

      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1 text-xs rounded-lg cursor-pointer'
          onClick={onView}
        >
          View Details
        </Button>
        <Button
          size='sm'
          disabled={isSelecting}
          className={`flex-1 text-xs rounded-lg cursor-pointer ${isChosen ? 'bg-green-500 hover:bg-green-600' : ''}`}
          onClick={onChoose}
        >
          {isSelecting ? (
            <span className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin' />
              Saving…
            </span>
          ) : isChosen ? (
            '✓ Chosen'
          ) : (
            'Choose Major'
          )}
        </Button>
      </div>
    </div>
  )
}
