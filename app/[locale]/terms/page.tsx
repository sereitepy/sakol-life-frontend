'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const sections = [
  { id: 'overview', number: '1', title: 'Overview' },
  { id: 'eligibility', number: '2', title: 'Eligibility' },
  { id: 'rules', number: '3', title: 'Rules of User Conduct' },
  { id: 'intellectual', number: '4', title: 'Intellectual Property' },
  { id: 'third-party', number: '5', title: 'Links to Third-Party Websites' },
  { id: 'disclaimer', number: '6', title: 'Disclaimer of Warranties' },
  { id: 'liability', number: '7', title: 'Limitation of Liability' },
  { id: 'indemnity', number: '8', title: 'Indemnity' },
  { id: 'data-transfer', number: '9', title: 'Data Transfer' },
  { id: 'availability', number: '10', title: 'Availability of Website' },
  { id: 'discontinued', number: '11', title: 'Discontinued Services' },
  { id: 'third-party-beneficiaries', number: '12', title: 'No Third-Party Beneficiaries' },
  { id: 'compliance', number: '13', title: 'Compliance with Local Laws' },
  { id: 'governing', number: '14', title: 'Governing Law' },
  { id: 'dispute', number: '15', title: 'Dispute Resolution' },
  { id: 'headings', number: '16', title: 'Titles and Headings' },
  { id: 'severability', number: '17', title: 'Severability' },
  { id: 'contact', number: '18', title: 'Contact Information' },
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className='flex flex-col gap-2'>
      {items.map((item, i) => (
        <li key={i} className='flex items-start gap-2 text-sm leading-relaxed text-foreground/80'>
          <span className='mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function TermsPage() {
  const [activeId, setActiveId] = useState('overview')

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
          <h1 className='text-4xl font-extrabold tracking-tight'>Terms of Service</h1>
          <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground'>
            Last Revised: June 6, 2026
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
                src='/images/hero-bg.png'
                alt='Sakol Life academic guidance'
                fill
                className='object-cover'
              />
            </div>

            {/* Intro callout */}
            <div className='bg-card border border-border rounded-xl px-6 py-5'>
              <p className='text-sm leading-relaxed text-muted-foreground italic'>
                PLEASE READ THIS TERMS OF SERVICE AGREEMENT CAREFULLY, AS IT CONTAINS IMPORTANT
                INFORMATION REGARDING YOUR LEGAL RIGHTS AND REMEDIES.
              </p>
            </div>

            {/* 1. Overview */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='overview' number='1' title='Overview' />
              <Para>
                This Terms of Service Agreement (&quot;Agreement&quot;) is entered into by and
                between Sakol Life, registered address No. 8, Street 315, Boeng Kak 1, Tuol Kork,
                Phnom Penh, Cambodia (&quot;Company&quot;) and you, and is made effective as of the
                date of your use of this website http://sakollife.com (&quot;Site&quot;) or the date
                of electronic acceptance.
              </Para>
              <Para>
                This Agreement sets forth the general terms and conditions of your use of
                http://sakollife.com as well as the products and/or services purchased or accessed
                through this Site (the &quot;Services&quot;). Whether you are simply browsing or
                using this Site or purchase Services, your use of this Site and your electronic
                acceptance of this Agreement signifies that you have read, understand, acknowledge
                and agree to be bound by this Agreement and our Privacy Policy.
              </Para>
              <Para>
                Company may, in its sole and absolute discretion, change or modify this Agreement at
                any time, and such changes shall be effective immediately upon posting to this Site.
                Your continued use of this Site after such changes shall constitute your acceptance
                of this Agreement as last revised.
              </Para>
              <div className='bg-destructive/10 border border-destructive/20 rounded-xl px-5 py-4'>
                <p className='text-sm font-semibold text-destructive'>
                  IF YOU DO NOT AGREE TO BE BOUND BY THIS AGREEMENT AS LAST REVISED, DO NOT USE (OR
                  CONTINUE TO USE) THIS SITE OR THE SERVICES.
                </p>
              </div>
            </div>

            {/* 2. Eligibility */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='eligibility' number='2' title='Eligibility' />
              <Para>
                This Site and the Services are available only to Users who can form legally binding
                contracts under applicable law. By using this Site, you represent and warrant that
                you are (i) at least eighteen (18) years of age, (ii) otherwise recognized as being
                able to form legally binding contracts under applicable law, and (iii) are not a
                person barred from purchasing or receiving the Services under the laws of Cambodia or
                other applicable jurisdiction.
              </Para>
              <Para>
                If you are entering into this Agreement on behalf of a company or corporate entity,
                you represent and warrant that you have the legal authority to bind such entity to
                the terms contained in this Agreement.
              </Para>
            </div>

            {/* 3. Rules */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='rules' number='3' title='Rules of User Conduct' />
              <Para>By using this Site you acknowledge and agree that:</Para>
              <BulletList items={[
                'Your use of this Site, including any content you submit, will comply with this Agreement and all applicable local, state, national and international laws, rules and regulations.',
              ]} />
              <Para>You will not use this Site in a manner that:</Para>
              <BulletList items={[
                'Is illegal, or promotes or encourages illegal activity;',
                'Promotes, encourages or engages in child pornography or the exploitation of children;',
                'Promotes, encourages or engages in terrorism, violence against people, animals, or property;',
                'Promotes, encourages or engages in any spam or other unsolicited bulk email, or computer or network hacking or cracking;',
                'Infringes on the intellectual property rights of another User or any other person or entity;',
                'Violates the privacy or publicity rights of another User or any other person or entity;',
                'Interferes with the operation of this Site;',
                'Contains or installs any viruses, worms, bugs, Trojan horses, Cryptocurrency Miners or other code designed to disrupt, damage, or limit the functionality of any software or hardware.',
              ]} />
              <Para>You will not:</Para>
              <BulletList items={[
                'Copy or distribute in any medium any part of this Site, except where expressly authorized by Company;',
                'Modify or alter any part of this Site or any of its related technologies;',
                'Access Company\'s Content through any technology or means other than through this Site itself.',
              ]} />
            </div>

            {/* 4. Intellectual Property */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='intellectual' number='4' title='Intellectual Property' />
              <Para>
                All content on this Site, including without limitation the text, software, scripts,
                source code, API, graphics, photos, sounds, music, videos and interactive features
                and the trademarks, service marks and logos contained therein (&quot;Company
                Content&quot;), are owned by or licensed to Sakol Life in perpetuity, and are
                subject to copyright, trademark, and/or patent protection.
              </Para>
              <Para>
                Company Content is provided to you &quot;as is&quot; and &quot;as available&quot;
                for your information and personal, non-commercial use only and may not be downloaded,
                copied, reproduced, distributed, transmitted, broadcast, displayed, sold, licensed,
                or otherwise exploited for any purposes whatsoever without the express prior written
                consent of Company.
              </Para>
            </div>

            {/* 5. Third-Party Links */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='third-party' number='5' title='Links to Third-Party Websites' />
              <Para>
                This Site may contain links to third-party websites that are not owned or controlled
                by Company. Company assumes no responsibility for the content, terms and conditions,
                privacy policies, or practices of any third-party websites. By using this Site you
                expressly release Company from any and all liability arising from your use of any
                third-party website.
              </Para>
            </div>

            {/* 6. Disclaimer */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='disclaimer' number='6' title='Disclaimer of Representations and Warranties' />
              <Para>
                YOU SPECIFICALLY ACKNOWLEDGE AND AGREE THAT YOUR USE OF THIS SITE SHALL BE AT YOUR
                OWN RISK AND THAT THIS SITE IS PROVIDED &quot;AS IS&quot;, &quot;AS
                AVAILABLE&quot; AND &quot;WITH ALL FAULTS&quot;. COMPANY, ITS OFFICERS, DIRECTORS,
                EMPLOYEES, AGENTS, DISCLAIM ALL WARRANTIES, STATUTORY, EXPRESS OR IMPLIED,
                INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
              </Para>
              <Para>
                THE FOREGOING DISCLAIMER OF REPRESENTATIONS AND WARRANTIES SHALL APPLY TO THE
                FULLEST EXTENT PERMITTED BY LAW, and shall survive any termination or expiration of
                this Agreement or your use of this Site or the Services found at this Site.
              </Para>
            </div>

            {/* 7. Limitation of Liability */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='liability' number='7' title='Limitation of Liability' />
              <Para>
                IN NO EVENT SHALL COMPANY, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND ALL
                THIRD PARTY SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY OTHER PERSON OR ENTITY FOR
                ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES
                WHATSOEVER, INCLUDING ANY DAMAGES THAT MAY RESULT FROM YOUR USE OF THIS SITE OR THE
                SERVICES FOUND AT THIS SITE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER
                LEGAL OR EQUITABLE THEORY.
              </Para>
              <Para>
                IN ADDITION, any cause of action arising out of or related to this Site or the
                Services must be commenced within one (1) year after the cause of action accrues,
                otherwise such cause of action shall be permanently barred.
              </Para>
              <Para>
                THE FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED
                BY LAW, and shall survive any termination or expiration of this Agreement.
              </Para>
            </div>

            {/* 8. Indemnity */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='indemnity' number='8' title='Indemnity' />
              <Para>
                You agree to protect, defend, indemnify and hold harmless Company and its officers,
                directors, employees, agents from and against any and all claims, demands, costs,
                expenses, losses, liabilities and damages of every kind and nature imposed upon or
                incurred by Company directly or indirectly arising from (i) your use of and access
                to this Site; (ii) your violation of any provision of this Agreement; and/or (iii)
                your violation of any third-party right, including without limitation any
                intellectual property or other proprietary right.
              </Para>
            </div>

            {/* 9. Data Transfer */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='data-transfer' number='9' title='Data Transfer' />
              <Para>
                If you are visiting this Site from a country other than the country in which our
                servers are located, your communications with us may result in the transfer of
                information across international boundaries. By visiting this Site and communicating
                electronically with us, you consent to such transfers.
              </Para>
            </div>

            {/* 10. Availability */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='availability' number='10' title='Availability of Website' />
              <Para>
                Subject to the terms and conditions of this Agreement, we shall use commercially
                reasonable efforts to provide this Site on a 24/7 basis. You acknowledge and agree
                that from time to time this Site may be inaccessible for any reason including
                periodic maintenance, repairs or replacements, or other causes beyond our control.
              </Para>
              <Para>
                You acknowledge and agree that we have no control over the availability of this Site
                on a continuous or uninterrupted basis, and that we assume no liability to you or
                any other party with regard thereto.
              </Para>
            </div>

            {/* 11. Discontinued Services */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='discontinued' number='11' title='Discontinued Services' />
              <Para>
                Company reserves the right to cease offering or providing any of the Services at any
                time, for any or no reason, and without prior notice. If a Service is discontinued,
                Company will either offer a comparable Service for you to migrate to or a refund.
                Company will not be liable to you or any third party for any modification,
                suspension, or discontinuance of any of the Services.
              </Para>
            </div>

            {/* 12. No Third-Party Beneficiaries */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='third-party-beneficiaries' number='12' title='No Third-Party Beneficiaries' />
              <Para>
                Nothing in this Agreement shall be deemed to confer any third-party rights or
                benefits.
              </Para>
            </div>

            {/* 13. Compliance */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='compliance' number='13' title='Compliance with Local Laws' />
              <Para>
                Company makes no representation or warranty that the content available on this Site
                is appropriate in every country or jurisdiction, and access to this Site from
                countries or jurisdictions where its content is illegal is prohibited. Users who
                choose to access this Site are responsible for compliance with all local laws, rules
                and regulations.
              </Para>
            </div>

            {/* 14. Governing Law */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='governing' number='14' title='Governing Law' />
              <Para>
                This Agreement and any dispute or claim arising out of or in connection with it or
                its subject matter or formation shall be governed by and construed in accordance with
                the laws of Cambodia, Phnom Penh, to the exclusion of conflict of law rules.
              </Para>
            </div>

            {/* 15. Dispute Resolution */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='dispute' number='15' title='Dispute Resolution' />
              <Para>
                Any controversy or claim arising out of or relating to these Terms of Service will
                be settled by binding arbitration on an individual basis, and must not be
                consolidated in any arbitration with any claim or controversy of any other party.
                The arbitration must be conducted in Cambodia, Phnom Penh, and judgment on the
                arbitration award may be entered into any court having jurisdiction thereof.
              </Para>
            </div>

            {/* 16. Titles and Headings */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='headings' number='16' title='Titles and Headings' />
              <Para>
                The titles and headings of this Agreement are for convenience and ease of reference
                only and shall not be utilized in any way to construe or interpret the agreement of
                the parties as otherwise set forth herein.
              </Para>
            </div>

            {/* 17. Severability */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='severability' number='17' title='Severability' />
              <Para>
                Each covenant and agreement in this Agreement shall be construed for all purposes to
                be a separate and independent covenant or agreement. If a court of competent
                jurisdiction holds any provision of this Agreement to be illegal, invalid, or
                otherwise unenforceable, the remaining provisions shall not be affected thereby and
                shall be found to be valid and enforceable to the fullest extent permitted by law.
              </Para>
            </div>

            {/* 18. Contact */}
            <div className='flex flex-col gap-4'>
              <SectionHeading id='contact' number='18' title='Contact Information' />
              <Para>
                If you have any questions about this Agreement, please contact us by email or regular
                mail at the following address:
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
            <div className='bg-card border border-dashed border-border rounded-xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <h3 className='font-bold text-lg text-foreground'>Questions about our terms?</h3>
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
        </div>
      </div>
    </main>
  )
}