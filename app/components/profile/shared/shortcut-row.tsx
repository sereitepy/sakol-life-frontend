import { ChevronRight } from 'lucide-react'

export function ShortcutRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 group cursor-pointer'
    >
      <div className='flex items-center gap-3'>
        <Icon size={16} className='text-primary' />
        <span className='text-sm font-semibold text-foreground'>{label}</span>
      </div>
      <ChevronRight
        size={14}
        className='text-muted-foreground group-hover:text-primary transition-colors'
      />
    </button>
  )
}
