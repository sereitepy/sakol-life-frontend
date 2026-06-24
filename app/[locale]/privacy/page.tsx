'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const sections = [
  { id: 'information-collected', number: '1', title: 'Information We Collect From You' },
  { id: 'auto-collected', number: '2', title: 'Information We Collect Automatically' },
  { id: 'how-we-use', number: '3', title: 'The Way We Use Your Information' },
  { id: 'how-we-share', number: '4', title: 'How We May Share Your Information' },
  { id: 'cookies', number: '5', title: 'Cookies' },
  { id: 'sensitive', number: '6', title: 'Sensitive Information' },
  { id: 'third-party', number: '7', title: 'Third Party Links' },
  { id: 'retention', number: '8', title: 'Retention' },
  { id: 'security', number: '9', title: 'Security' },
  { id: 'your-rights', number: '10', title: 'Your Rights' },
  { id: 'application', number: '11', title: 'Application of Policy' },
  { id: 'amendments', number: '12', title: 'Amendments' },
  { id: 'acceptance', number: '13', title: 'Acceptance of This Policy' },
  { id: 'further-info', number: '14', title: 'Further Information' },
]

function SectionHeading({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <div id={id} className='flex items-center gap-3 scroll-mt-24'>
      <span className='flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0'>
        {number}
      </span>
      <h2 className='text-lg font-bold tracking-tight uppercase'>{title}</h2>
    </div>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className='text-sm leading-relaxed text-foreground/80'>{children}</p>
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className='flex flex-col gap-2'>
      {items.map((item, i) => (
        <li key={i} className='flex items-start gap-2 text-sm leading-relaxed text-foreground/80'>
          <span className='mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState('information-collected')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <main className='min-h-screen bg-background text-foreground'>
      <div className='max-w-6xl mx-auto px-6 py-16'>

        {/* Header */}
        <div className='flex flex-col gap-2 mb-10'>
          <h1 className='text-4xl font-extrabold tracking-tight'>Privacy Policy</h1>
          <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground'>
            Last Updated: June 6, 2026
          </p>
        </div>

        <div className='flex flex-col md:flex-row gap-10'>

          {/* Sidebar TOC */}
          <aside className='hidden md:flex flex-col gap-1 md:w-56 shrink-0 sticky top-24 h-fit'>
            <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2'>
              Contents
            </p>
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                  activeId === s.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.number}. {s.title}
              </a>
            ))}
          </aside>

          {/* Content */}
          <div className='flex-1 flex flex-col gap-10'>

            {/* Hero image */}
            <div className='w-full h-56 rounded-xl overflow-hidden relative'>
              <Image
                src='/images/green.jpg'
                alt='Privacy policy'
                fill
                className='object-cover'
              />
            </div>

            {/* Intro */}
            <div className='bg-card border border-border rounded-xl px-6 py-5 flex flex-col gap-3'>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                Your privacy is important to us, so Sakol Life, a service provider based in
                Cambodia, has created the following Privacy Policy (&quot;Policy&quot;) to let you
                know what information we collect when you visit our Site{' '}
                <span className='text-primary font-medium'>http://sakollife.com</span>, why we
                collect it and how we use it.
              </p>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                The terms &quot;You,&quot; &quot;Your,&quot; &quot;Yours&quot; and &quot;User&quot;
                refer to the entity/person/organization using our Site. When this Policy mentions
                &quot;We&quot;, &quot;Us,&quot; and &quot;Our&quot; it refers to Sakol Life and its
                subsidiaries and affiliates.
              </p>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                This Privacy Policy is governed by our{' '}
                <Link href='/terms' className='text-primary font-medium hover:underline'>
                  Terms of Service
                </Link>
                . For any questions, please contact us at{' '}
                <a href='mailto:rmeas@paragoniu.edu.kh' className='text-primary font-medium hover:underline'>
                  rmeas@paragoniu.edu.kh
                </a>
                .
              </p>
            </div>

            {/* 1 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='information-collected' number='1' title='Information We Collect From You' />
              <Para>
                We collect the information You provide to us and this information is necessary for
                the adequate performance of the contractual arrangement which is in place between You
                and us and allow us to comply with our legal obligations.
              </Para>
              <BulletList items={[
                'Account Signup Information. When You create the account, we ask You to provide the signup information, such as Email, Name, Username, Passwords.',
                'Communications, Chats, Messaging. When you communicate with us through email or any other way, we collect information about your communication and any information You choose to provide or disclose.',
                'Login information. We collect Login information if You are logging to our account with Authentication Data.',
                'Other Personal Information Provided by You. We may collect other data provided by You from surveys, feedback, financial information, Quiz Responses, Academic Preferences and other similar data.',
              ]} />
            </div>

            {/* 2 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='auto-collected' number='2' title='Information We Collect Automatically' />
              <Para>
                When you use our Site or contact us directly we may collect information, including
                your personal information, about the way you act in our Site, the services You use
                and how You use them.
              </Para>
              <Para>
                This information is necessary for the adequate performance of the contract between
                You and us, to enable us to comply with legal obligations and given our legitimate
                interest in being able to provide and improve the functionalities of the Site.
              </Para>
              <BulletList items={[
                'Log data and Device information. We automatically collect log data and device information when you access and use the Site, even if you have not created an Account or logged in. That information includes: Internet protocol (IP) addresses, Browser type, Operating system, Date/time stamp, Referring/exit pages.',
                'Tracking technologies and Cookies. We use Cookies, Device ID, Phone model. We also automatically collect information about the device\'s operating system.',
              ]} />
            </div>

            {/* 3 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='how-we-use' number='3' title='The Way We Use Your Information' />
              <Para>
                We process your information adhering to the general data processing principles. We
                may use the information we collect through our Site for a number of reasons,
                including to:
              </Para>
              <BulletList items={[
                'Identify user and create account',
                'Stay connected and provide support',
                'Create statistics and analyze market',
                'Improve services and ensure data security and prevent fraud',
                'Comply with applicable laws',
                'Contact user',
                'Generate personalized higher education recommendations based on user quiz responses',
              ]} />
              <Para>
                We will normally collect personal information from you only where we have your
                consent to do so, where we need the personal information to perform a contract with
                you, or where the processing is in our legitimate business interests.
              </Para>
            </div>

            {/* 4 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='how-we-share' number='4' title='How We May Share Your Information' />
              <Para>
                We may share your information with third parties that we use to provide and support
                our Services:
              </Para>
              <BulletList items={[
                'Supabase — database and authentication infrastructure',
                'Google OAuth — third-party sign-in provider',
                'Namecheap — domain registration',
                'Cloudflare — content delivery and security',
              ]} />
              <Para>We may also disclose your information to third parties:</Para>
              <BulletList items={[
                'Where required by law or regulatory requirement, court order or other judicial authorization;',
                'In response to lawful requests by public authorities, including for the purposes of meeting national security and law enforcement requirements;',
                'In connection with the sale, transfer, merger, bankruptcy, restructuring or other reorganization of a business;',
                'To protect or defend our rights, interests or property, or that of third parties;',
                'To investigate any wrongdoing in connection with our products and services;',
                'To protect the vital interests of an individual.',
              ]} />
            </div>

            {/* 5 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='cookies' number='5' title='Cookies' />
              <Para>
                Cookies are small text files stored by your browser on your computer when you visit
                our Site. We use cookies to improve our Site and make it easier to use. Cookies
                permit us to recognize users and avoid repetitive requests for the same information.
                Cookies from our Site cannot be read by other Sites.
              </Para>
              <Para>Cookies we use on our Site:</Para>
              <BulletList items={[
                'Strictly necessary cookies — Required for the operation of our Site. They help us show you the right information, customize your experience, and implement security features. Without these cookies, operation of the Website would be impossible.',
                'Functional cookies — Improve the functional performance of our Website. These cookies remember settings selected by Visitors (e.g., language and time zone) and changes made by you in the Website.',
                'Performance cookies — Show us if the Visitor has visited our Website before. Analytical cookies allow us to recognize and count users and see how they navigate through our Website.',
              ]} />
            </div>

            {/* 6 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='sensitive' number='6' title='Sensitive Information' />
              <Para>
                We do not collect sensitive information such as political opinions, religious or
                philosophical beliefs, racial or ethnic origin, genetic data, biometric data, health
                data or data related to sexual orientation.
              </Para>
              <Para>
                Please do not send, upload, or provide us any sensitive data and contact us using
                the contact details below if you believe that we might have such information. We
                have a right to delete any information we believe it might contain sensitive data.
              </Para>
            </div>

            {/* 7 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='third-party' number='7' title='Third Party Links' />
              <Para>
                Our Site may have links to other websites. Please review their privacy policies to
                learn more about how they collect and use your personal data, because we do not
                control their policies and personal data processing practices.
              </Para>
            </div>

            {/* 8 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='retention' number='8' title='Retention' />
              <Para>
                We retain your personal information to provide services to you and as otherwise
                necessary to comply with our legal obligation, resolve disputes, and enforce our
                agreements. We will retain your personal information no longer than you keep your
                account, unless we are otherwise required by law or regulations to retain your
                personal information longer.
              </Para>
              <Para>
                If you would like to stop us using your personal information, you shall request that
                we erase your personal information and close your Account. Please note that even
                after deletion of your account we may keep some of your information for tax, legal
                reporting and auditing obligations.
              </Para>
            </div>

            {/* 9 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='security' number='9' title='Security' />
              <Para>
                We have implemented security measures designed to protect the personal information
                you share with us, including physical, electronic and procedural measures. Among
                other things, we regularly monitor our systems for possible vulnerabilities and
                attacks.
              </Para>
              <Para>
                Regardless of the measures and efforts taken by us, the transmission of information
                via internet, email or text message is not completely secure. We do not guarantee
                the absolute protection and security of your personal information.
              </Para>
              <div className='bg-secondary/40 dark:bg-secondary border border-border rounded-xl px-5 py-4'>
                <p className='text-sm text-foreground/80'>
                  If you have any questions regarding the security of our Site or Services, contact
                  us at{' '}
                  <a href='mailto:rmeas@paragoniu.edu.kh' className='text-primary font-medium hover:underline'>
                    rmeas@paragoniu.edu.kh
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* 10 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='your-rights' number='10' title='Your Rights' />
              <Para>
                You are entitled to a range of rights regarding the protection of your personal
                information. Those rights are:
              </Para>
              <BulletList items={[
                'The right to access the information we have about you. If you wish to access your personal information that we collect, you can do so at any time by contacting us using the contact details provided below.',
                'The right to rectify inaccurate information about you. You can correct, update or request deletion of your personal information by contacting us.',
                'The right to object the processing. When we rely on your consent to process your personal information, you may withdraw consent at any time by contacting us.',
                'The right to lodge a complaint. You can raise questions or complaints to the national Data Protection Agency in your country of residence in the event where your rights may have been infringed.',
                'The right to erase any data concerning you. You may demand erasure of data without undue delay for legitimate reasons, e.g. where data is no longer necessary for the purposes it was collected.',
              ]} />
            </div>

            {/* 11 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='application' number='11' title='Application of Policy' />
              <Para>
                This Policy applies only to the services offered by our Company. Our Policy does
                not apply to services offered by other companies or individuals, including products
                or sites that may be displayed to you in search results, sites that may include our
                services or other sites linked from our Site or Services.
              </Para>
            </div>

            {/* 12 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='amendments' number='12' title='Amendments' />
              <Para>
                Our Policy may change from time to time. We will post any Policy changes on our
                Site and, if the changes are significant, we may consider providing a more explicit
                notice (including, for certain services, email notification of Policy changes).
              </Para>
            </div>

            {/* 13 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='acceptance' number='13' title='Acceptance of This Policy' />
              <Para>
                We assume that all Users of this Site have carefully read this document and agree to
                its contents. If someone does not agree with this Policy, they should refrain from
                using our Site. We reserve the right to change our Policy at any time and inform by
                using the way as indicated in Section 12. Continued use of this Site implies
                acceptance of the revised Policy.
              </Para>
            </div>

            {/* 14 */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='further-info' number='14' title='Further Information' />
              <Para>
                If you have any further questions regarding the data we collect, or how we use it,
                then please feel free to contact us at the details as indicated above.
              </Para>
              <div className='bg-card border border-border rounded-xl px-6 py-5 flex flex-col gap-1'>
                <p className='text-sm font-semibold text-foreground'>Sakol Life</p>
                <p className='text-sm text-muted-foreground'>No. 8, Street 315, Boeng Kak 1, Tuol Kork, Phnom Penh</p>
                <p className='text-sm text-muted-foreground'>Cambodia</p>
                <a href='mailto:rmeas@paragoniu.edu.kh' className='text-sm text-primary font-medium hover:underline mt-1'>
                  rmeas@paragoniu.edu.kh
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className='bg-primary rounded-xl px-6 py-7 flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <h3 className='font-bold text-lg text-primary-foreground'>
                  Questions about Privacy?
                </h3>
                <p className='text-sm text-primary-foreground/70 leading-relaxed'>
                  Our dedicated support team is here to help you understand how we protect your
                  information while you focus on your studies.
                </p>
              </div>
              <Link
                href='/contact'
                className='self-start px-5 py-2.5 text-sm font-semibold bg-primary-foreground text-primary rounded-(--radius) hover:brightness-95 transition-all'
              >
                Contact Privacy Team
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}