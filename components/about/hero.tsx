import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTranslations } from 'next-intl'


export default function Hero() {
const t = useTranslations('about')
  return (
    <div className='relative px-10 py-24 flex flex-col overflow-hidden bg-accent-foreground dark:bg-secondary/30 transition-all duration-150 ease-in-out'>
      
      <div className='relative w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center z-10'>
        
        <section className='flex flex-col items-center gap-6 max-w-2xl'>
          
          <span className='inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-extrabold tracking-widest bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-container border border-primary/20 dark:border-primary-container/30 backdrop-blur-md shadow-xs select-none transition-colors duration-150'>
            <svg 
              className="w-3.5 h-3.5 text-primary dark:text-primary-container animate-[pulse_2s_infinite]" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M11.48 3.499c.151-.377.689-.377.84 0l1.733 4.318a.45.45 0 0 0 .337.28l4.63.535c.404.047.566.547.262.822l-3.486 3.161a.45.45 0 0 0-.134.412l1.004 4.542c.088.397-.34.707-.694.501l-4.025-2.336a.45.45 0 0 0-.446 0l-4.025 2.336c-.354.206-.782-.104-.694-.501l1.004-4.542a.45.45 0 0 0-.134-.412L3.16 9.986c-.304-.275-.142-.775.262-.822l4.63-.535a.45.45 0 0 0 .337-.28l1.733-4.319Z" />
            </svg>
           {t('mission')}
          </span>

          <h1 className='text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-accent dark:text-secondary-foreground'>
            {t('title-first')}{' '}
            <span className='font-extrabold bg-linear-to-r from-primary to-muted-foreground dark:from-secondary-foreground dark:to-primary bg-clip-text text-transparent'>
              {t('title-second')}
            </span>{' '}
             {t('title-third')}
          </h1>

          <p className='text-accent dark:text-secondary-foreground text-sm sm:text-base leading-relaxed'>
            {t('title-des')}
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-2'>
            <Button
              className='group w-full sm:w-fit rounded-xl text-base h-12 px-8 font-bold bg-linear-to-r from-primary to-emerald-600 dark:from-emerald-500 dark:to-primary text-white shadow-lg shadow-primary/25 dark:shadow-none hover:opacity-95 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-98'
              asChild
            >
              <Link href='/quiz' className='flex items-center gap-2 justify-center'>
                {t('quiz')}
                <svg 
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </div>


        </section>

      </div>
    </div>
  )
}