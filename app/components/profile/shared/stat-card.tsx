export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className='bg-card border border-border rounded-2xl p-5 flex flex-col gap-2'>
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Icon size={14} className='text-primary' />
        <span className='text-[10px] font-bold tracking-[0.12em] uppercase'>
          {label}
        </span>
      </div>
      <div className='text-2xl font-bold text-foreground leading-tight'>
        {value}
      </div>
    </div>
  )
}
