import Image from 'next/image'

const crew = [
  {
    name: 'Sereitepy Or',
    role: 'Full-Stack Developer',
    src: '/images/sereitepy-or.png',
    rotate: 'group-hover:rotate-6',
  },
  {
    name: 'Reaskmey Meas',
    role: 'Project Researcher',
    src: '/images/reaksmey-meas.png',
    rotate: 'group-hover:-rotate-6',
  },
  {
    name: 'Ratanakvisal Chhouk',
    role: 'Market Researcher',
    src: '/images/ratanakvisal-chhouk.png',
    rotate: 'group-hover:rotate-12',
  },
]

export default function MeettheCrew() {
  return (
    <section className='py-24 px-10 relative overflow-hidden bg-background transition-all duration-150'>
      <div className='max-w-screen-xl mx-auto text-center relative z-10'>

        <h2 className='text-4xl font-extrabold mb-4 text-foreground'>
          Meet the Crew
        </h2>
        <p className='text-base sm:text-lg max-w-2xl mx-auto mb-20 text-muted-foreground'>
          We are a group of MIS students, passionate about bridging the gap between
          high school and a successful tech university decision.
        </p>

        <div className='flex flex-wrap justify-center gap-12 lg:gap-20'>
          {crew.map(({ name, role, src, rotate }) => (
            <div key={name} className='group text-center w-64'>
              <div className='relative mb-6 mx-auto w-48 h-48 overflow-hidden rounded-full'>
                {/* coloured ring */}
                <div
                  className={`absolute inset-0 rounded-full scale-105 group-hover:scale-110 ${rotate} transition-all bg-secondary`}
                />
                <Image
                  src={src}
                  alt={name}
                  width={192}
                  height={192}
                  className='relative w-full h-full object-cover object-top [clip-path:circle(48%_at_50%_50%)] filter grayscale group-hover:grayscale-0 transition-all duration-500'
                />
              </div>
              <h3 className='text-lg font-bold mb-1 text-foreground'>{name}</h3>
              <p className='font-bold text-primary'>{role}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
