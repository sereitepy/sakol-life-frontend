import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { BackgroundBeams } from '@/components/ui/beams'
import { Button } from '@/components/ui/button'
import { Birdhouse, CircleCheckBig } from 'lucide-react'
import Image from 'next/image'
import CTAButton from './cta'

export default function Hero() {
  return (
    <div className='relative p-8 md:p-10 lg:p-15 flex flex-col gap-5 overflow-hidden bg-accent-foreground dark:bg-secondary/30 transition-all duration-150 ease-in-out'>
      <BackgroundBeams />

      <div className='relative flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-10 w-full max-w-5xl mx-auto'>
        {/* left side */}
        <section className='flex flex-col gap-5 w-full md:w-[60%]'>
          <div className='text-sm font-semibold px-2 py-0.5 rounded-lg bg-secondary w-fit flex items-center gap-1'>
            <Birdhouse size={16} className='text-accent-foreground' />
            <p>EDUCATION PLATFORM</p>
          </div>

          <h1 className='text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-accent dark:text-secondary-foreground'>
            Discover Your&nbsp;
            <span className='font-extrabold text-4xl sm:text-5xl bg-linear-to-r from-accent to-muted-foreground dark:from-secondary-foreground dark:to-primary bg-clip-text text-transparent'>
              Future Path
            </span>
          </h1>

          <p className='text-accent dark:text-secondary-foreground text-sm sm:text-base'>
            Answer 12 simple questions and get personalized recommendations for
            your technology university major!
          </p>

          {/* CTA buttons */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
            <CTAButton />
            <Button
              variant='ghost'
              className='w-full sm:w-fit rounded-md text-md h-12 px-4 font-bold'
            >
              View Demo
            </Button>
          </div>

          {/* trusted avatars */}
          <section className='flex items-center gap-4'>
            <AvatarGroup>
              <Avatar>
                <AvatarImage src='https://img.freepik.com/free-photo/close-up-smiley-woman-library_23-2149204737.jpg?semt=ais_rp_50_assets&w=740&q=80' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src='https://img.freepik.com/premium-photo/college-student-woman-books-portrait-outdoor-happy-research-studying-education-academy-girl-person-smile-with-textbook-scholarship-learning-university-campus_590464-371958.jpg' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src='https://img.freepik.com/free-photo/close-up-beautiful-woman-smiling_23-2148369437.jpg?semt=ais_rp_50_assets&w=740&q=80' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+200</AvatarGroupCount>
            </AvatarGroup>
            <p className='text-accent dark:text-secondary-foreground text-sm'>
              Trusted by 200+ Cambodian students
            </p>
          </section>
        </section>

        {/* right side */}
        <section className='relative w-full md:w-[40%] group cursor-pointer'>
          <div className='relative rounded-xl overflow-hidden'>
            <Image
              src='/images/cambodian_students.png'
              alt='Cambodian Students Studying'
              width={450}
              height={300}
              className='w-full h-55 sm:h-65 md:h-75 object-cover transition-transform duration-500 ease-out group-hover:scale-110'
            />
            {/* a bit of a dark overlay */}
            <div className='absolute inset-0 bg-black/30 dark:bg-black/20 rounded-xl transition-opacity duration-300 group-hover:opacity-60' />
          </div>

          <div className='absolute bottom-3 left-3 right-3 transition-transform duration-300 ease-out group-hover:-translate-y-1'>
            <div className='flex items-center justify-between gap-2 bg-card dark:bg-sidebar-accent px-3 rounded-md py-2 shadow-sm transition-shadow duration-300 group-hover:shadow-md'>
              <div className='flex items-center gap-3'>
                <CircleCheckBig
                  className='text-primary bg-accent dark:bg-secondary-foreground p-1 rounded-sm shrink-0'
                  size={25}
                />
                <div>
                  <p className='font-bold text-sm'>Match Found</p>
                  <p className='text-xs sm:text-sm font-light'>
                    Computer Science at Paragon IU
                  </p>
                </div>
              </div>
              <p className='text-primary font-bold text-xs shrink-0'>
                98% Match
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
