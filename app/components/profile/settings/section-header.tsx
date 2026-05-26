type Props = {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: Props) {
  return (
    <div className='mb-6'>
      <h2 className='text-base font-bold text-foreground'>{title}</h2>
      {description && (
        <p className='text-sm text-muted-foreground mt-1'>{description}</p>
      )}
    </div>
  )
}
