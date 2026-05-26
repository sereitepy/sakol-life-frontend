import React from 'react'

export function StatCard({
  icon: Icon,
  label,
  value,
  meta,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  meta?: string // Made optional in case some cards don't have meta text
}) {
  return (
    <div className='bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 justify-between min-h-[110px]'>
      <div className='flex flex-col gap-2'>
        {/* Header: Icon & Label */}
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Icon size={14} className='text-primary' />
          <span className='text-[10px] font-bold tracking-[0.12em] uppercase'>
            {label}
          </span>
        </div>

        {/* Main Value */}
        <div className='text-2xl font-bold text-foreground leading-tight'>
          {value}
        </div>
      </div>

      {/* Meta Footer */}
      {meta && (
        <div className='text-[11px] text-muted-foreground/70 border-t border-border/50 pt-2 mt-1'>
          {meta}
        </div>
      )}
    </div>
  )
}
