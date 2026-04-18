export function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className='bg-card border border-border rounded-2xl p-6'>
      <div className='flex items-center gap-2 mb-5 pb-4 border-b border-border'>
        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
          <Icon size={15} className='text-primary' />
        </div>
        <h3 className='font-bold text-base text-foreground'>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-1.5 mb-4 last:mb-0'>
      <label className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
        {label}
      </label>
      {children}
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    </div>
  )
}
