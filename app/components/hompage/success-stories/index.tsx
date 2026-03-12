'use client'

import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  StarIcon,
} from '@phosphor-icons/react'
import { animate, motion, PanInfo, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

const data = [
  {
    id: 'sophea-chan',
    profile:
      'https://thumbs.dreamstime.com/b/avatar-asian-girl-happy-eastern-student-social-networks-vector-flat-illustration-188797892.jpg',
    name: 'Sophea Chan',
    role: 'Scholarship Winner, 2026',
    text: "I was confused about which major to pick, and the quiz questions were spot on! I'm now studying Computer Science and I love it!",
  },
  {
    id: 'sereitepy-or',
    profile:
      'https://www.shutterstock.com/image-vector/vector-bright-portrait-beautiful-brunette-600nw-2452267975.jpg',
    name: 'Sereitepy Or',
    role: 'MIS student at Paragon IU',
    text: 'The university information were really helpful! Highly recommended!',
  },
  {
    id: 'bopha-ly',
    profile:
      'https://t4.ftcdn.net/jpg/02/79/66/93/360_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg',
    name: 'Bopha Ly',
    role: 'Digital Design Major',
    text: 'Sakol Life helped me realized that my hobby could be a career. And the start of that career is a perfect fit technology major.',
  },
  {
    id: 'sereitepsy-or',
    profile:
      'https://www.shutterstock.com/image-vector/vector-bright-portrait-beautiful-brunette-600nw-2452267975.jpg',
    name: 'Sereitepy Or',
    role: 'MIS student at Paragon IU',
    text: 'The university information were really helpful! Highly recommended!',
  },
  {
    id: 'bopha-sly',
    profile:
      'https://t4.ftcdn.net/jpg/02/79/66/93/360_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6.jpg',
    name: 'Bopha Ly',
    role: 'Digital Design Major',
    text: 'Sakol Life helped me realized that my hobby could be a career. And the start of that career is a perfect fit technology major.',
  },
]

export default function SuccessStories() {
  const [current, setCurrent] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [cardWidth, setCardWidth] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentRef = useRef(0)
  const x = useMotionValue(0)
  const maxIndex = Math.max(0, data.length - visibleCount)

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const count =
        window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
      const width = trackRef.current.offsetWidth / count
      setVisibleCount(count)
      setCardWidth(width)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const slideTo = useCallback(
    (index: number, instant = false) => {
      if (cardWidth === 0) return
      animate(
        x,
        -(index * cardWidth),
        instant
          ? { duration: 0 }
          : { type: 'spring', stiffness: 60, damping: 20, mass: 1 }
      )
      setCurrent(index)
      currentRef.current = index
    },
    [cardWidth, x]
  )

  // Re-snap position when cardWidth changes due to resize
  useLayoutEffect(() => {
    if (cardWidth > 0) {
      animate(x, -(currentRef.current * cardWidth), { duration: 0 })
    }
  }, [cardWidth, x])

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      const next = currentRef.current >= maxIndex ? 0 : currentRef.current + 1
      slideTo(next)
    }, 3500)
  }, [maxIndex, slideTo])

  useLayoutEffect(() => {
    startAutoPlay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [startAutoPlay])

  const go = useCallback(
    (index: number) => {
      slideTo(index)
      startAutoPlay()
    },
    [slideTo, startAutoPlay]
  )

  const onDragEnd = useCallback(
    (_: never, info: PanInfo) => {
      const threshold = cardWidth * 0.2
      if (info.offset.x < -threshold && currentRef.current < maxIndex)
        go(currentRef.current + 1)
      else if (info.offset.x > threshold && currentRef.current > 0)
        go(currentRef.current - 1)
      else slideTo(currentRef.current)
    },
    [cardWidth, maxIndex, go, slideTo]
  )

  return (
    <div className='flex p-8 md:p-10'>
      <div className='max-w-5xl mx-auto w-full flex flex-col gap-5'>
        {/* title and arrows */}
        <div className='flex items-center justify-between gap-3'>
          <section className='flex flex-col gap-3'>
            <h1 className='text-2xl lg:text-3xl font-extrabold tracking-tight'>
              Success Stories
            </h1>
            <p className='text-accent-foreground'>
              Hear from students who found their path with Sakol Life
            </p>
          </section>

          <div className='flex items-center gap-1'>
            <button
              onClick={() => go(current - 1)}
              disabled={current === 0}
              className='transition-opacity duration-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed'
            >
              <ArrowCircleLeftIcon size={40} weight='thin' color='#27762f' />
            </button>
            <button
              onClick={() => go(current + 1)}
              disabled={current >= maxIndex}
              className='transition-opacity duration-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed'
            >
              <ArrowCircleRightIcon size={40} weight='fill' color='#27762f' />
            </button>
          </div>
        </div>

        {/* carousel viewport */}
        <div ref={trackRef} className='overflow-hidden'>
          <motion.div
            className='flex cursor-grab active:cursor-grabbing'
            style={{ x }}
            drag='x'
            dragConstraints={{ left: -(maxIndex * cardWidth), right: 0 }}
            dragElastic={0.08}
            onDragEnd={onDragEnd}
          >
            {data.map(item => (
              <motion.div
                key={item.id}
                className='shrink-0 px-2.5'
                style={{
                  width: cardWidth > 0 ? cardWidth : `${100 / visibleCount}%`,
                }}
              >
                <div className='p-6 bg-accent rounded-md flex flex-col gap-3 h-full hover:shadow-md  transition-transform duration-300'>
                  <div className='flex items-center gap-3'>
                    <Image
                      src={item.profile}
                      alt={item.name}
                      width={45}
                      height={45}
                      className='rounded-full w-11 h-11 object-cover shrink-0'
                    />
                    <div>
                      <h2 className='font-semibold'>{item.name}</h2>
                      <p className='text-accent-foreground font-light text-sm'>
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-0.5'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={18}
                        color='#FFD700'
                        weight='fill'
                        className=''
                      />
                    ))}
                  </div>

                  <p className='text-sm leading-relaxed'>
                    &quot;{item.text}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 5 stars rating */}
        <div className='flex items-center justify-center gap-2 mt-1'>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-primary' : 'w-2 bg-accent-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
