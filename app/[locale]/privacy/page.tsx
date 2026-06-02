import Link from 'next/link'
import {
  UserCircle,
  ClipboardText,
  ChartBar,
  GraduationCap,
  Bell,
  ShieldCheck,
  CaretRight,
} from '@phosphor-icons/react/ssr'

export default function PrivacyPolicyPage() {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      <div className='max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10'>

        {/* Header */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-lg font-semibold text-primary'>Privacy Policy</h1>
          <p className='text-xs font-semibold tracking-widest uppercase text-muted-foreground'>
            Last Updated: May 26, 2026
          </p>
          <hr className='border-border mt-2' />
        </div>

        {/* Intro */}
        <p className='text-sm leading-relaxed text-foreground/80'>
          At Sakol Life, we are committed to empowering Cambodian students
          through organic academic growth while maintaining the highest
          standards of data privacy. This policy explains how we collect, use,
          and protect your personal information when you use our platform to
          explore your future.
        </p>

        {/* 1. Information We Collect */}
        <section className='flex flex-col gap-4'>
          <h2 className='text-base font-semibold text-primary'>
            1. Information We Collect
          </h2>
          <div className='bg-card border border-border rounded-xl p-5 flex flex-col gap-4'>
            <p className='text-sm text-foreground/80'>
              We collect information that helps us personalize your academic
              journey:
            </p>
            <div className='flex flex-col gap-4'>
              <div className='flex items-start gap-3'>
                <UserCircle
                  size={20}
                  weight='duotone'
                  className='text-primary shrink-0 mt-0.5'
                />
                <div>
                  <p className='text-sm font-semibold text-foreground'>
                    Account Data
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Name, email address, and educational background provided
                    during registration.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <ClipboardText
                  size={20}
                  weight='duotone'
                  className='text-primary shrink-0 mt-0.5'
                />
                <div>
                  <p className='text-sm font-semibold text-foreground'>
                    Assessment Responses
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Answers to interest quizzes and personality assessments
                    used to recommend majors.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <ChartBar
                  size={20}
                  weight='duotone'
                  className='text-primary shrink-0 mt-0.5'
                />
                <div>
                  <p className='text-sm font-semibold text-foreground'>
                    Usage Information
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Data about how you interact with our university listings
                    and scholarship database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. How We Use Your Data */}
        <section className='flex flex-col gap-4'>
          <h2 className='text-base font-semibold text-primary'>
            2. How We Use Your Data
          </h2>
          <p className='text-sm leading-relaxed text-foreground/80'>
            Your data is the fuel for our personalized recommendation engine.
            We use it to:
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-card border border-border rounded-xl p-5 flex flex-col gap-2'>
              <GraduationCap
                size={22}
                weight='duotone'
                className='text-primary'
              />
              <p className='text-sm font-semibold text-foreground'>
                Academic Matching
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Suggesting majors and universities that align with your natural
                strengths and interests.
              </p>
            </div>
            <div className='bg-card border border-border rounded-xl p-5 flex flex-col gap-2'>
              <Bell size={22} weight='duotone' className='text-primary' />
              <p className='text-sm font-semibold text-foreground'>
                Scholarship Alerts
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed'>
                Notifying you about financial aid opportunities that you are
                specifically eligible for.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Data Security */}
        <section className='flex flex-col gap-4'>
          <h2 className='text-base font-semibold text-primary'>
            3. Data Security
          </h2>
          <p className='text-sm leading-relaxed text-foreground/80'>
            We implement industry-standard security measures to ensure your
            data remains protected. Our biophilic design isn&apos;t just for
            looks; it represents our commitment to a healthy, secure digital
            ecosystem. We utilize end-to-end encryption for sensitive
            transmissions and conduct regular security audits of our
            &quot;organic&quot; growth databases.
          </p>
          <div className='bg-secondary/40 dark:bg-secondary border border-border rounded-xl px-5 py-4 flex items-center gap-3'>
            <ShieldCheck
              size={18}
              weight='duotone'
              className='text-primary shrink-0'
            />
            <p className='text-sm text-foreground/80'>
              Your data is stored in encrypted servers with strict access
              controls.
            </p>
          </div>
        </section>

        {/* 4. Your Rights */}
        <section className='flex flex-col gap-4'>
          <h2 className='text-base font-semibold text-primary'>
            4. Your Rights
          </h2>
          <p className='text-sm leading-relaxed text-foreground/80'>
            You maintain full ownership of your academic profile. You have the
            right to:
          </p>
          <div className='flex flex-col gap-2'>
            {[
              'Request a copy of your personal data',
              'Update or correct inaccurate information',
              'Request permanent deletion of your account',
            ].map(right => (
              <div
                key={right}
                className='bg-card border border-border rounded-xl px-5 py-3.5 flex items-center justify-between gap-3'
              >
                <p className='text-sm text-foreground/80'>{right}</p>
                <CaretRight
                  size={16}
                  className='text-muted-foreground shrink-0'
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className='bg-primary rounded-xl px-6 py-7 flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <h3 className='font-bold text-lg text-primary-foreground'>
              Questions about Privacy?
            </h3>
            <p className='text-sm text-primary-foreground/70 leading-relaxed'>
              Our dedicated support team is here to help you understand how we
              protect your information while you focus on your studies.
            </p>
          </div>
          <Link
            href='/contact'
            className='self-start flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary-foreground text-primary rounded-(--radius) hover:brightness-95 transition-all'
          >
            Contact Privacy Team
          </Link>
        </div>

      </div>
    </main>
  )
}