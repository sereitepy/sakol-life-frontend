import {
  BrainIcon,
  BuildingApartmentIcon,
  NotepadIcon,
} from '@phosphor-icons/react/ssr'

export default function HowItWorks() {
  const data = [
    {
      id: 'take-survey',
      title: 'Take the Quiz',
      des: 'Quick and easy interest assessment designed to understand your strengths and compatibilities.',
      icon: NotepadIcon,
      color: '#',
      bg_color: '#4ABF90',
    },
    {
      id: 'get-recommendation',
      title: 'Get Recommendations',
      des: 'Mathematical computation matches for technology majors that fit your profile perfectly.',
      icon: BrainIcon,
      color: '#9333EA',
      bg_color: '#B9BDAC',
    },
    {
      id: 'university-info',
      title: 'University Information',
      des: 'Select a major and receives all local universities in Cambodia that offer your selected major.',
      icon: BuildingApartmentIcon,
      color: '#EA580C',
      bg_color: '#BFBF97',
    },
  ]
  return (
    <div className='flex items-center justify-center p-10 bg-chart-3/20 dark:bg-secondary flex-col gap-10'>
      <section className='flex flex-col gap-3 items-center justify-center'>
        <h1 className='text-2xl font-bold'>How it works</h1>
        <p className='text-accent-foreground'>
          Your jouney to a dream major in 3 simple steps
        </p>
      </section>
      <section className='flex flex-col md:flex-row gap-5 w-full max-w-5xl mx-auto'>
        {data.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className='relative p-7 rounded-md bg-chart-3/40 border-input flex flex-col gap-3 flex-1 
            transition-all duration-300 ease-out
            hover:-translate-y-2 hover:shadow-lg hover:bg-chart-3/60
            cursor-pointer group'
            >
              <div
                className='p-2 rounded-md dark:bg-accent w-fit transition-transform duration-300 group-hover:scale-110'
                style={{ backgroundColor: item.bg_color }}
              >
                <Icon color={item.color} size={24} />
              </div>
              <h1 className='font-bold text-lg'>{item.title}</h1>
              <p className='text-accent-foreground'>{item.des}</p>
              <p className='absolute top-0 right-5 opacity-30 text-8xl font-extrabold transition-opacity duration-300 group-hover:opacity-50'>
                {index + 1}
              </p>
            </div>
          )
        })}
      </section>
    </div>
  )
}
