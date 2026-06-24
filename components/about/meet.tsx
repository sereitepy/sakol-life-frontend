import Image from 'next/image'
import { useTranslations } from 'next-intl'

// Static layout blueprint safely configured outside the render cycle
const crew = [
  {
    translationKey: 'sereitepy-or',
    src: '/images/sereitepy-or.png',
    rotate: 'group-hover:rotate-6',
  },
  {
    translationKey: 'reaskmey-meas',
    src: '/images/reaksmey-meas.png',
    rotate: 'group-hover:-rotate-6',
  },
  {
    translationKey: 'ratanakvisal Chhouk',
    src: '/images/ratanakvisal-chhouk.png',
    rotate: 'group-hover:rotate-12',
  },
]

export default function MeettheCrew() {
  const t = useTranslations('about')
  
  return (
    <section className='py-24 px-10 relative overflow-hidden bg-background transition-all duration-150'>
      <div className='max-w-screen-xl mx-auto text-center relative z-10'>

        <h2 className='text-4xl font-extrabold mb-4 text-foreground'>
          {t('meet')}
        </h2>
        <p className='text-base sm:text-lg max-w-2xl mx-auto mb-20 text-muted-foreground'>
          {t('meet-des')}
        </p>

        <div className='flex flex-wrap justify-center gap-12 lg:gap-20'>
          {crew.map(({ translationKey, src, rotate }) => (
            <div key={translationKey} className='group text-center w-64'>
              <div className='relative mb-6 mx-auto w-48 h-48 overflow-hidden rounded-full'>
                {/* coloured ring */}
                <div
                  className={`absolute inset-0 rounded-full scale-105 group-hover:scale-110 ${rotate} transition-all bg-secondary`}
                />
                <Image
                  src={src}
                  alt={t(`crew.${translationKey}.name`)}
                  width={192}
                  height={192}
                  className='relative w-full h-full object-cover object-top [clip-path:circle(48%_at_50%_50%)] filter grayscale group-hover:grayscale-0 transition-all duration-500'
                />
              </div>
              
              {/* Dynamic name translation */}
              <h3 className='text-lg font-bold mb-1 text-foreground'>
                {t(`crew.${translationKey}.name`)}
              </h3>
              
              {/* Dynamic role translation */}
              <p className='font-bold text-primary'>
                {t(`crew.${translationKey}.role`)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}