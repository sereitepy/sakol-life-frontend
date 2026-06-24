import { MapPin, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'


export default function Builtby() {
  const t = useTranslations('about')
  return (
    <section className='py-24 px-10 bg-card transition-all duration-150'>
      <div className='max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-16'>

        {/* image */}
        <div className='w-full md:w-1/2'>
          <div className='relative group'>
            <div className='absolute -inset-6 rounded-[3rem] rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-500 opacity-20 bg-primary pointer-events-none' />
            <Image
              src='https://lh3.googleusercontent.com/aida-public/AB6AXuBHtHTC2kMUfzvbCBMdIdJq5Auk6dEoZtsdXlEIA8wVT7IYDzmnePT1LBpAWPbfE3Wz9Ft97OkUY26-2-DVBmHPXMi4Vk-VbtLd7BbcTGIBOAwCl77lFliK4SN-2T94WR_Rfgrqe66ojoRJ3C3o2-r2yvNKfH351KKAqWH7-Rz3RaJDJKvmq7LM2DlxYJIWYyIGWKszuuAnfQN4tJIIozEOKMzAgKULK_TMhQjiN8FcM028H0HJLZ3Vs32oZsRPv2VDOBdhi56jbsOM'
              alt='Tech workspace'
              width={700}
              height={450}
              className='relative rounded-[2.5rem] w-full h-[450px] object-cover shadow-2xl'
            />
          </div>
        </div>

        {/* text */}
        <div className='w-full md:w-1/2 flex flex-col gap-8'>
          <h2 className='text-4xl font-extrabold leading-tight tracking-tight text-foreground'>
            {t('title-first-built')}{' '}
            <span className='bg-linear-to-r from-primary to-muted-foreground dark:from-secondary-foreground dark:to-primary bg-clip-text text-transparent'>
              {t('title-second-built')}
            </span>
          </h2>

          <p className='text-base sm:text-lg leading-relaxed text-muted-foreground'>
         {t('title-built-des')}
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='flex items-start gap-4'>
              <div className='shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--icon-bg-teal)]'>
                <MapPin size={20} className='text-primary' />
              </div>
              <div>
                <h4 className='font-bold mb-1 text-foreground'>{t('subheading4')}</h4>
                <p className='text-sm text-muted-foreground'>
                  {t('body-text-2')}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-secondary'>
                <ShieldCheck size={20} className='text-secondary-foreground' />
              </div>
              <div>
                <h4 className='font-bold mb-1 text-foreground'>{t('subheading5')}</h4>
                <p className='text-sm text-muted-foreground'>
                    {t('body-text-3')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
