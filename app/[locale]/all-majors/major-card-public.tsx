import { Button } from '@/components/ui/button'
import { PublicMajor } from '@/lib/view/view-all';

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

function getIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}

export default function MajorCardPublic({
  major,
  onView,
}: {
  major: PublicMajor
  onView: () => void
}) {
  const icon = getIcon(major.code)

  return (
    <div className='relative bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'>
      <div className='flex items-start gap-3'>
        {/* <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${icon.bg}`}
        >
          {icon.emoji}
        </div> */}
        <div className='min-w-0'>
          <h3 className='font-bold text-base text-foreground leading-snug'>
            {major.nameEn}
          </h3>
          <p className='text-xs text-muted-foreground mt-0.5 font-mono'>
            {major.code}
          </p>
        </div>
      </div>

      <p className='text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1'>
        {major.descriptionEn ?? 'No description available.'}
      </p>

      {/* Badges */}
      <div className='flex flex-wrap gap-1.5'>
        {major.careerCategory && (
          <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20'>
            {major.careerCategory.replace(/_/g, ' ')}
          </span>
        )}
        {major.jobOutlook && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              major.jobOutlook === 'HIGH'
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                : major.jobOutlook === 'MEDIUM'
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {major.jobOutlook === 'HIGH'
              ? ''
              : major.jobOutlook === 'MEDIUM'
                ? ''
                : ''}{' '}
            {major.jobOutlook}
          </span>
        )}
      </div>

      <div className='h-px bg-border' />

      <Button
        size='sm'
        className='w-full text-xs rounded-lg cursor-pointer'
        onClick={onView}
      >
        View Details
      </Button>
    </div>
  )
}
