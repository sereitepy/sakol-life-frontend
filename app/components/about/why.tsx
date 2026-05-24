import { ArrowRight, Landmark, MapPin, School, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const insightCards = [
  {
    icon: <MapPin size={24} className='text-[var(--icon-bg-teal)]' />,
    label: 'Tuition Fee',
    desc: 'Check tuition fee',
  },
  {
    icon: <Landmark size={24} className='text-[var(--icon-bg-amber)]' />,
    label: 'Scholarships',
    desc: 'Hidden funding gems',
  },
  {
    icon: <School size={24} className='text-[var(--icon-bg-violet)]' />,
    label: 'Campus Facilities',
    desc: 'What campus provides',
  },
  {
    icon: <TrendingUp size={24} className='text-[var(--icon-bg-teal)]' />,
    label: 'Job Outlook',
    desc: 'Real salary data',
  },
]

export default function WhySakolLife() {
  return (
    <section className='py-24 px-10 relative overflow-hidden bg-muted transition-all duration-150'>
      <div className='max-w-screen-xl mx-auto relative z-10'>

        {/* heading */}
        <div className='text-center mb-20'>
          <h2 className='text-4xl font-extrabold mb-4 text-foreground'>
            Why Sakol Life?
          </h2>
          <p className='text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground'>
            We have built the tools you need to make the biggest decision of your
            academic life easier, smarter, and way more fun.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>

          {/* Quiz card — col-span-5 */}
          <div className='md:col-span-5'>
            <div className='h-full p-10 rounded-[2.5rem] flex flex-col bg-card border border-border shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-xl'>
              <div className='w-20 h-20 rounded-3xl flex items-center justify-center mb-8 rotate-3 bg-[var(--icon-bg-teal)]'>
                {/* sparkle */}
                <svg className='w-10 h-10 text-primary' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-foreground'>Magic Match Quiz</h3>
              <p className='text-base sm:text-lg flex-grow text-muted-foreground'>
                Our system analyzes your personality and passions to suggest tech
                majors you will actually love.
              </p>
              <div className='mt-8'>
                <Link
                  href='/quiz'
                  className='inline-flex items-center gap-2 font-bold text-primary hover:gap-4 transition-all duration-200'
                >
                  Start your journey <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* University insights card — col-span-7 */}
          <div className='md:col-span-7'>
            <div className='h-full p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden bg-[oklch(0.22_0.04_140)] dark:bg-sidebar transition-all duration-300 ease-in-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl'>
              {/* watermark icon */}
              <div className='absolute top-0 right-0 p-8 opacity-10 pointer-events-none'>
                <School size={144} />
              </div>

              <div className='relative z-10'>
                <h3 className='text-2xl font-bold mb-8'>
                  University Insights. All in One Place.
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  {insightCards.map(({ icon, label, desc }) => (
                    <div
                      key={label}
                      className='p-6 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5'
                    >
                      <div className='mb-3'>{icon}</div>
                      <p className='font-bold'>{label}</p>
                      <p className='text-sm opacity-70'>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
