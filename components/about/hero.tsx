import { Button } from '@/components/ui/button'
import { BackgroundBeams } from '@/components/ui/beams'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className='relative px-10 py-24 flex flex-col overflow-hidden bg-accent-foreground dark:bg-secondary/30 transition-all duration-150 ease-in-out'>
      <BackgroundBeams />

      <div className='relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-screen-xl mx-auto'>

        {/* left side */}
        <section className='flex flex-col gap-6 z-10'>
          <span className='inline-block py-1 px-3 rounded-full text-xs font-bold tracking-widest w-fit bg-secondary text-secondary-foreground'>
            OUR MISSION
          </span>

          <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-accent dark:text-secondary-foreground'>
            Empowering Cambodian{' '}
            <span className='font-extrabold bg-linear-to-r from-primary to-muted-foreground dark:from-secondary-foreground dark:to-primary bg-clip-text text-transparent'>
              Tech Leaders
            </span>{' '}
            of Tomorrow
          </h1>

          <p className='text-accent dark:text-secondary-foreground text-sm sm:text-base max-w-xl leading-relaxed'>
            Sakol Life is a dedicated platform designed to bridge the gap between
            high school and higher education for Cambodian students. We focus on
            tech-driven majors to align with national STEM development goals.
          </p>

          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
            <Button
              variant='ghost'
              className='w-full sm:w-fit rounded-xl text-base h-12 px-8 font-semibold border border-primary text-primary hover:bg-primary/10'
              asChild
            >
              <Link href='/quiz'>Take the Quiz</Link>
            </Button>
          </div>
        </section>

        {/* right side */}
        <section className='relative w-full group cursor-pointer mt-12 lg:mt-0'>
          <div className='absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-30 bg-primary pointer-events-none' />

          <div className='relative rounded-3xl overflow-hidden shadow-2xl rotate-1'>
            <Image
              src='/images/cambodian-graduates.png'
              alt='Cambodian graduates celebrating'
              width={650}
              height={400}
              className='w-full h-[400px] object-cover transition-transform duration-500 ease-out group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black/10 dark:bg-black/20 rounded-3xl transition-opacity duration-300 group-hover:opacity-60' />
          </div>
        </section>

      </div>
    </div>
  )
}
