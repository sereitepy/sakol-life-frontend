import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function FilterSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className='border-t border-border pt-4 mb-1'>
      <button
        onClick={() => setOpen(v => !v)}
        className='flex items-center justify-between w-full mb-3 cursor-pointer'
      >
        <div className='flex items-center gap-2'>
          <Icon size={13} className='text-primary' />
          <span className='text-xs font-bold text-foreground uppercase tracking-wide'>
            {title}
          </span>
        </div>
        {open ? (
          <ChevronUp size={13} className='text-muted-foreground' />
        ) : (
          <ChevronDown size={13} className='text-muted-foreground' />
        )}
      </button>
      {open && <div className='space-y-2'>{children}</div>}
    </div>
  )
}
