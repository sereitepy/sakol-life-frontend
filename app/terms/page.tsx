import Link from 'next/link'
import Image from 'next/image'

const sections = [
  {
    number: '01',
    title: 'Acceptance of Terms',
    content: [
      {
        type: 'paragraph',
        text: 'By accessing or using the Sakol Life platform ("the Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Sakol Life.',
      },
      {
        type: 'paragraph',
        text: 'If you do not agree with any part of these terms, you must immediately cease all use of our services, including our web application, assessment tools, and advisory content.',
      },
    ],
  },
  {
    number: '02',
    title: 'User Responsibilities',
    content: [
      {
        type: 'paragraph',
        text: 'To maintain the integrity of our academic community, users are expected to:',
      },
      {
        type: 'list',
        items: [
          'Provide accurate and truthful information during registration and quiz completion.',
          'Maintain the confidentiality of their account credentials and notify us immediately of any unauthorized access.',
          'Use the platform solely for lawful academic and career exploration purposes.',
          'Refrain from any activity that disrupts or interferes with the performance of our servers.',
        ],
      },
    ],
  },
  {
    number: '03',
    title: 'Intellectual Property',
    content: [
      {
        type: 'paragraph',
        text: 'All content, including but not limited to assessment algorithms, quiz questions, graphic design, logos, and academic data, is the exclusive property of Sakol Life and protected by copyright and intellectual property laws of Cambodia.',
      },
      {
        type: 'paragraph',
        text: 'Users are granted a limited, non-exclusive, non-transferable license to access the content for personal, non-commercial educational use only. Reproducing, scraping, or redistributing our data without express written consent is strictly prohibited.',
      },
    ],
  },
  {
    number: '04',
    title: 'Limitation of Liability',
    content: [
      {
        type: 'paragraph',
        text: 'Sakol Life provides recommendations and educational guidance "as is" without any warranties, express or implied. While we strive for maximum accuracy in our assessments, we do not guarantee admission to any specific university or success in any career path.',
      },
      {
        type: 'paragraph',
        text: 'To the maximum extent permitted by law, Sakol Life shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our platform.',
      },
    ],
  },
  {
    number: '05',
    title: 'Governing Law',
    content: [
      {
        type: 'paragraph',
        text: 'These terms and conditions are governed by and construed in accordance with the laws of the Kingdom of Cambodia. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Phnom Penh.',
      },
      {
        type: 'paragraph',
        text: 'In the event that any provision of these Terms is deemed unenforceable, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms shall otherwise remain in full force and effect.',
      },
    ],
  },
]

export default function TermsPage() {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      <div className='max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10'>

        {/* Header */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-extrabold tracking-tight text-foreground'>
            Terms of Service
          </h1>
          <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground'>
            Last Updated: May 26, 2026
          </p>
        </div>

        {/* Intro callout */}
        <div className='bg-card border border-border rounded-xl px-6 py-5'>
          <p className='text-sm leading-relaxed text-muted-foreground italic'>
            Please read these terms carefully before using the Sakol Life
            platform. By accessing our services, you agree to be bound by these
            provisions which ensure a fair and safe academic environment for all
            Cambodian students.
          </p>
        </div>

        {/* Sections */}
        <div className='flex flex-col gap-10'>
          {sections.map((section, i) => (
            <div key={section.number} className='flex flex-col gap-4'>
              {/* Section heading */}
              <div className='flex items-center gap-3'>
                <span className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0'>
                  {section.number}
                </span>
                <h2 className='text-2xl font-bold tracking-tight'>
                  {section.title}
                </h2>
              </div>

              {/* Section content */}
              <div className='flex flex-col gap-3 pl-11'>
                {section.content.map((block, j) =>
                  block.type === 'paragraph' ? (
                    <p
                      key={j}
                      className='text-sm leading-relaxed text-foreground/80'
                    >
                      {block.text}
                    </p>
                  ) : (
                    <ul key={j} className='flex flex-col gap-2'>
                      {block.items?.map((item, k) => (
                        <li
                          key={k}
                          className='flex items-start gap-2 text-sm leading-relaxed text-foreground/80'
                        >
                          <span className='mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>

              {/* Image banner after Intellectual Property */}
              {i === 2 && (
                <div className='mt-4 w-full h-52 rounded-xl overflow-hidden relative'>
                  <Image
                    src='/images/hero-bg.png'
                    alt='Sakol Life academic guidance'
                    fill
                    className='object-cover'
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA callout */}
        <div className='bg-card border border-dashed border-border rounded-xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <h3 className='font-bold text-lg text-foreground'>
              Questions about our terms?
            </h3>
            <p className='text-sm text-muted-foreground'>
              Our legal and support teams are here to help clarify our policies.
            </p>
          </div>
          <Link
            href='/contact'
            className='shrink-0 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-(--radius) hover:brightness-110 transition-all'
          >
            Contact Support
          </Link>
        </div>

      </div>
    </main>
  )
}