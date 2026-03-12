import Image from 'next/image'

export default function Partnership() {
  return (
    <div className='p-5 flex items-center justify-center flex-col gap-5'>
      <h1 className='text-sm font-semibold text-muted-foreground'>
        PARTNERS & UNIVERSITIES
      </h1>
      <section className='flex items-center gap-3'>
        {/* RUPP */}
        <div className='relative overflow-hidden'>
          <Image
            src={'/images/RUPP_logo.png'}
            alt='RUPP logo'
            width={36}
            height={36}
          />
          <div className='absolute inset-0 dark:bg-black/20 rounded-full' />
        </div>
        {/* ITC */}
        <div className='relative overflow-hidden'>
          <Image
            src={'/images/itc_logo.png'}
            alt='ITC logo'
            width={40}
            height={40}
          />
          <div className='absolute inset-0 dark:bg-black/20 rounded-full' />
        </div>
        {/* NUM */}
        <div className='relative overflow-hidden'>
          <Image
            src={'/images/num_logo1.png'}
            alt='NUM logo'
            width={40}
            height={40}
          />
          <div className='absolute inset-0 dark:bg-black/20 rounded-full' />
        </div>
        {/* Paragon */}
        <div className='relative overflow-hidden dark:hidden'>
          <Image
            src={'/images/piu_logo.png'}
            alt='NUM logo'
            width={110}
            height={70}
          />
        </div>
        <div className='relative overflow-hidden hidden dark:flex'>
          <Image
            src={'/images/piu_darkmode_logo.png'}
            alt='NUM logo'
            width={110}
            height={70}
          />
          <div className='absolute inset-0 dark:bg-black/20 rounded-full' />
        </div>
      </section>
    </div>
  )
}
