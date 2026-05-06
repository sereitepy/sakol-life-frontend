import { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  label: string
  value: string
  meta?: string
  accent?: boolean // true = left emerald border (the "hero" card)
}

export function StatCard({ icon: Icon, label, value, meta, accent }: Props) {
  return (
    <div
      className={`
        glass-panel p-6 rounded-xl border transition-all duration-200
        hover:border-primary/40 hover:shadow-md
        ${
          accent
            ? 'border-l-4 border-l-primary border-y border-r border-white/10'
            : 'border-white/10'
        }
      `}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='p-2 rounded-lg bg-primary/10'>
          <Icon size={16} className='text-primary' />
        </div>
        {meta && (
          <span className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant'>
            {meta}
          </span>
        )}
      </div>
      <div className='text-[clamp(15px,1.5vw,22px)] font-bold text-on-surface leading-tight mb-1 truncate'>
        {value}
      </div>
      <div className='text-[clamp(10px,0.8vw,12px)] text-on-surface-variant'>
        {label}
      </div>
    </div>
  )
}
