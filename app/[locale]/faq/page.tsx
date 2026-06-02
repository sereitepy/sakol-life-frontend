'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CaretDown } from '@phosphor-icons/react'
import Image from 'next/image'

const categories = ['General', 'Assessment & Quiz', 'University Matching', 'Scholarships']

const faqs: Record<string, { question: string; answer: string }[]> = {
  'General': [
    {
      question: 'What is Sakol Life?',
      answer:
        'Sakol Life is a guidance platform helping Cambodian students find their ideal majors and universities through organic academic growth. We bridge the gap between high school dreams and higher education reality.',
    },
    {
      question: 'Is there a fee for using the platform?',
      answer:
        'The basic guidance and university listings are accessible to all students. We believe in democratizing academic information for all Cambodian learners.',
    },
    {
      question: 'Who is Sakol Life designed for?',
      answer:
        'Sakol Life is designed primarily for Cambodian high school and early university students who are exploring their academic and career paths. Whether you are unsure of your major or looking for the right university, our platform is built for you.',
    },
    {
      question: 'Do I need to create an account to use the platform?',
      answer:
        'You can take the quiz and browse university information as a guest. However, creating an account allows you to save your results, track your progress, and receive personalized scholarship alerts.',
    },
  ],
  'Assessment & Quiz': [
    {
      question: 'How accurate is the Interest Quiz?',
      answer:
        'Our assessment algorithm is designed based on educational psychology to provide highly personalized recommendations tailored specifically to the Cambodian job market and academic landscape.',
    },
    {
      question: 'How long does the quiz take?',
      answer:
        'The quiz consists of 12 carefully crafted questions and typically takes 5–10 minutes to complete. We recommend finding a quiet space so you can answer thoughtfully.',
    },
    {
      question: 'Can I retake the quiz?',
      answer:
        'Yes, you can retake the quiz as many times as you like. We encourage students to retake it as their interests evolve over time. Signed-in users can compare results across attempts.',
    },
    {
      question: 'What happens after I complete the quiz?',
      answer:
        'After completing the quiz, you will receive a personalized list of recommended majors ranked by compatibility, along with universities in Cambodia that offer those programs.',
    },
  ],
  'University Matching': [
    {
      question: 'How are universities ranked on the platform?',
      answer:
        'We categorize universities based on official accreditation, faculty quality, and student outcome data. Our matching system prioritizes your interests and strengths over simple vanity metrics.',
    },
    {
      question: 'Which universities are currently listed?',
      answer:
        'We currently partner with Paragon International University (PIU), the Institute of Technology of Cambodia (ITC), and the Royal University of Phnom Penh (RUPP), with more institutions being added regularly.',
    },
    {
      question: 'Can I compare multiple universities?',
      answer:
        'Yes, our university pages include details on tuition, available majors, accreditation status, and campus facilities so you can make an informed comparison between institutions.',
    },
  ],
  'Scholarships': [
    {
      question: 'How do I apply for scholarships?',
      answer:
        'We provide a curated database of available scholarships and direct links to application portals. Our advisors also host webinars to help you polish your application essays.',
    },
    {
      question: 'What types of scholarships are listed?',
      answer:
        'We list government scholarships, university-specific grants, private foundation awards, and international scholarship opportunities relevant to Cambodian students.',
    },
    {
      question: 'Will I be notified of new scholarships?',
      answer:
        'Signed-in users receive scholarship alerts based on their quiz results and profile. We match you with opportunities you are specifically eligible for so you never miss a deadline.',
    },
  ],
}

function AccordionItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 ${open ? 'shadow-sm' : ''}`}
    >
      <button
        onClick={() => setOpen(prev => !prev)}
        className='w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer'
      >
        <span className='text-sm font-semibold text-primary'>{question}</span>
        <CaretDown
          size={18}
          className={`text-primary shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className='px-6 pb-5 text-sm text-muted-foreground leading-relaxed'>
          {answer}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('General')

  return (
    <main className='min-h-screen bg-background text-foreground'>
      {/* Hero */}
      <section className='flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 gap-4'>
        <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight text-primary'>
          Frequently Asked Questions
        </h1>
        <p className='text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed'>
          Find answers to common questions about your academic journey in
          Cambodia. We are here to guide you toward growth and clarity.
        </p>
      </section>

      {/* Content */}
      <section className='max-w-5xl mx-auto px-6 pb-20 flex flex-col md:flex-row gap-8'>
        {/* Sidebar */}
        <aside className='md:w-1/3 flex flex-col gap-3 md:sticky md:top-24 h-fit'>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Decorative image */}
          <div className='mt-6 rounded-xl overflow-hidden hidden md:block h-48 relative'>
            <Image
              src='/images/green_livingroom.jpg'
              alt='A serene green living space'
              fill
              className='object-cover'
            />
          </div>
        </aside>

        {/* Accordion */}
        <div className='md:w-2/3 flex flex-col gap-3'>
          {faqs[activeCategory].map(item => (
            <AccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}

          {/* CTA */}
          <div className='mt-6 bg-secondary dark:bg-secondary border border-border rounded-2xl p-8 flex flex-col gap-4'>
            <h4 className='text-2xl font-bold text-primary'>
              Still have questions?
            </h4>
            <p className='text-sm text-foreground/80 leading-relaxed'>
              Our academic advisors are ready to help you navigate your unique
              journey.
            </p>
            <Link
              href='/contact'
              className='self-start px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-(--radius) hover:brightness-110 transition-all'
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}