'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  fetchMajorDetail,
  MajorDetailResponse,
  selectMajor,
  AuthIdentity,
} from '@/lib/profile/action'
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Globe2,
  TrendingUp,
  Code2,
  Database,
  Shield,
  Cpu,
  Monitor,
  Smartphone,
  Megaphone,
  Palette,
  BarChart3,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Icon map for subjects / career opps

const ICON_MAP: Record<string, React.ElementType> = {
  code: Code2,
  database: Database,
  shield: Shield,
  cpu: Cpu,
  monitor: Monitor,
  smartphone: Smartphone,
  megaphone: Megaphone,
  palette: Palette,
  'bar-chart': BarChart3,
  globe: Globe2,
  book: BookOpen,
  default: HelpCircle,
}

function getIcon(key: string | null): React.ElementType {
  return ICON_MAP[key ?? 'default'] ?? ICON_MAP.default
}

const DEMAND_CONFIG: Record<
  string,
  { label: string; color: string; barColor: string; width: string }
> = {
  VERY_HIGH: {
    label: 'Very High',
    color: 'text-red-500',
    barColor: 'bg-red-500',
    width: 'w-full',
  },
  HIGH: {
    label: 'High',
    color: 'text-green-500',
    barColor: 'bg-green-500',
    width: 'w-4/5',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-yellow-500',
    barColor: 'bg-yellow-500',
    width: 'w-3/5',
  },
  LOW: {
    label: 'Low',
    color: 'text-muted-foreground',
    barColor: 'bg-muted-foreground',
    width: 'w-2/5',
  },
}

const MAJOR_ICONS: Record<string, string> = {
  AI: '🤖',
  NET: '🌐',
  CYB: '🛡️',
  DS: '💻',
  MWD: '📱',
  DD: '🎨',
  DB: '🗄️',
  MIS: '📊',
  CS: '⚙️',
  DEFAULT: '📚',
}

// Stat pill

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className='flex items-center gap-3 py-3 px-4 bg-background rounded-xl border border-border'>
      <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
        <Icon size={15} className='text-primary' />
      </div>
      <div>
        <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
          {label}
        </p>
        <p className='text-sm font-bold text-foreground'>{value}</p>
      </div>
    </div>
  )
}

// Section wrapper

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <div className='bg-card border border-border rounded-2xl p-6'>
      <h2 className='font-bold text-lg text-foreground flex items-center gap-2 mb-4'>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  )
}

// Main page

export default function MajorDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const majorId = params.id

  const [major, setMajor] = useState<MajorDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [identity, setIdentity] = useState<AuthIdentity | null>(null)
  const [choosing, setChoosing] = useState(false)
  const [chosen, setChosen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      const id: AuthIdentity | null = session?.user
        ? {
            type: 'user',
            userId: session.user.id,
            accessToken: session.access_token,
          }
        : null
      setIdentity(id)

      try {
        const detail = await fetchMajorDetail(majorId, session?.access_token)
        setMajor(detail)

        // Check if already chosen
        const storedId = sessionStorage.getItem('chosenMajorId')
        if (storedId === majorId) setChosen(true)
      } catch (e) {
        console.error(e)
        setError('Failed to load major details.')
      } finally {
        setLoading(false)
      }
    })
  }, [majorId])

  async function handleChoose() {
    if (!identity) {
      router.push('/login')
      return
    }
    setChoosing(true)
    try {
      const guestId =
        sessionStorage.getItem('guestSessionId') ?? crypto.randomUUID()
      const id: AuthIdentity = identity ?? {
        type: 'guest',
        guestSessionId: guestId,
      }
      const data = await selectMajor(majorId, id)
      sessionStorage.setItem('chosenMajorId', majorId)
      sessionStorage.setItem('chosenMajorData', JSON.stringify(data))
      setChosen(true)
    } catch (e) {
      console.error(e)
    } finally {
      setChoosing(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
      </div>
    )
  }

  if (error || !major) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <p className='text-2xl mb-2'>😕</p>
          <p className='font-semibold text-foreground'>
            {error ?? 'Major not found'}
          </p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const demand =
    DEMAND_CONFIG[major.jobMarket.demandLevel] ?? DEMAND_CONFIG.MEDIUM
  const emoji = MAJOR_ICONS[major.code] ?? MAJOR_ICONS.DEFAULT

  return (
    <div className='min-h-screen bg-background'>
      {/* Back nav */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-4'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
        >
          <ArrowLeft size={15} /> Back to Results
        </button>
      </div>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 pb-16'>
        {/* Hero card */}
        <div className='bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              {/* Faculty chip + updated */}
              <div className='flex flex-wrap items-center gap-3 mb-3'>
                {major.faculty && (
                  <span className='text-[11px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20'>
                    {major.faculty}
                  </span>
                )}
                {major.updatedAt && (
                  <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <Clock size={11} />
                    Updated{' '}
                    {new Date(major.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              <h1 className='text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-3'>
                {major.nameEn}
              </h1>
              {major.descriptionEn && (
                <p className='text-muted-foreground leading-relaxed max-w-2xl'>
                  {major.descriptionEn}
                </p>
              )}
            </div>

            {/* Match % badge */}
            {major.similarityPercentage !== null && (
              <div className='shrink-0 bg-background border border-border rounded-2xl p-4 text-center min-w-32.5'>
                <div className='relative w-16 h-16 mx-auto mb-2'>
                  <svg viewBox='0 0 36 36' className='w-16 h-16 -rotate-90'>
                    <circle
                      cx='18'
                      cy='18'
                      r='15.9'
                      fill='none'
                      stroke='var(--border)'
                      strokeWidth='3'
                    />
                    <circle
                      cx='18'
                      cy='18'
                      r='15.9'
                      fill='none'
                      stroke='var(--primary)'
                      strokeWidth='3'
                      strokeDasharray={`${major.similarityPercentage} 100`}
                      strokeLinecap='round'
                    />
                  </svg>
                  <span className='absolute inset-0 flex items-center justify-center text-lg font-extrabold text-foreground'>
                    {major.similarityPercentage}%
                  </span>
                </div>
                <p className='text-xs font-bold text-foreground'>
                  Excellent Match
                </p>
                <p className='text-[10px] text-muted-foreground'>
                  Based on your interests
                </p>
              </div>
            )}
          </div>

          {/* Stat pills */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'>
            {major.degreeType && (
              <StatPill
                icon={GraduationCap}
                label='Degree'
                value={major.degreeType}
              />
            )}
            {major.language && (
              <StatPill icon={Globe2} label='Language' value={major.language} />
            )}
          </div>
        </div>

        {/* Two-column layout*/}
        <div className='flex flex-col lg:flex-row gap-6 items-start'>
          {/* Left column */}
          <div className='flex-1 min-w-0 space-y-6'>
            {/* What You'll Study */}
            {major.subjects.length > 0 && (
              <Section title="What You'll Study" icon='📚'>
                <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>
                  The curriculum balances theoretical foundations with practical
                  application. Key subjects include:
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {major.subjects.map(s => {
                    const Icon = getIcon(s.iconKey)
                    return (
                      <div key={s.id} className='flex gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                          <Icon size={14} className='text-primary' />
                        </div>
                        <div>
                          <p className='font-bold text-sm text-foreground'>
                            {s.nameEn}
                          </p>
                          {s.descriptionEn && (
                            <p className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>
                              {s.descriptionEn}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Section>
            )}

            {/* Skills */}
            {(major.technicalSkills.length > 0 ||
              major.softSkills.length > 0) && (
              <Section title="Skills You'll Gain" icon='🎯'>
                {major.technicalSkills.length > 0 && (
                  <div className='mb-4'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5'>
                      Technical Skills
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {major.technicalSkills.map(s => (
                        <span
                          key={s.id}
                          className='text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20'
                        >
                          {s.nameEn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {major.softSkills.length > 0 && (
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2.5'>
                      Soft Skills
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {major.softSkills.map(s => (
                        <span
                          key={s.id}
                          className='text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent text-accent-foreground border border-border'
                        >
                          {s.nameEn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* Career Opportunities */}
            {major.careerOpportunities.length > 0 && (
              <Section title='Career Opportunities' icon='💼'>
                <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>
                  Graduates are highly sought after across multiple industries
                  in Cambodia and globally.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {major.careerOpportunities.map(c => {
                    const Icon = getIcon(c.iconKey)
                    return (
                      <div
                        key={c.id}
                        className='flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors'
                      >
                        <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0'>
                          <Icon size={15} className='text-muted-foreground' />
                        </div>
                        <span className='font-bold text-sm text-foreground'>
                          {c.titleEn}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Section>
            )}
          </div>

          {/* Right sidebar */}
          <div className='w-full lg:w-72 shrink-0 space-y-4'>
            {/* Job Market */}
            <div className='bg-card border border-border rounded-2xl p-5'>
              <h3 className='font-bold text-base text-foreground flex items-center gap-2 mb-4'>
                <TrendingUp size={16} className='text-primary' /> Job Market in
                Cambodia
              </h3>
              <div className='mb-3'>
                <div className='flex justify-between items-center mb-1.5'>
                  <span className='text-xs text-muted-foreground'>Demand</span>
                  <span className={`text-xs font-bold ${demand.color}`}>
                    {demand.label}
                  </span>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${demand.barColor} ${demand.width}`}
                  />
                </div>
                <p className='text-[10px] text-muted-foreground mt-1.5'>
                  Based on 2024 job posting data in Phnom Penh.
                </p>
              </div>

              {(major.jobMarket.salaryMin > 0 ||
                major.jobMarket.salaryMax > 0) && (
                <div className='bg-background border border-border rounded-xl p-3.5 mb-4'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                    Entry Level Salary
                  </p>
                  <p className='text-2xl font-extrabold text-foreground'>
                    ${major.jobMarket.salaryMin.toLocaleString()}
                    <span className='text-base font-normal text-muted-foreground mx-1'>
                      –
                    </span>
                    ${major.jobMarket.salaryMax.toLocaleString()}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    per {major.jobMarket.period}
                  </p>
                </div>
              )}

              <Button
                className='w-full rounded-xl font-bold'
                onClick={() => router.push(`/quiz/results?tab=universities`)}
              >
                <Building2 size={14} className='mr-2' /> Find Universities
              </Button>
            </div>

            {/* Related Majors */}
            {major.relatedMajors.length > 0 && (
              <div className='bg-card border border-border rounded-2xl p-5'>
                <h3 className='font-bold text-base text-foreground mb-4'>
                  Related Majors
                </h3>
                <div className='space-y-3'>
                  {major.relatedMajors.map(rm => (
                    <button
                      key={rm.majorId}
                      onClick={() => router.push(`/majors/${rm.majorId}`)}
                      className='w-full flex items-center gap-3 hover:bg-muted/50 rounded-xl p-2 -mx-2 transition-colors cursor-pointer group'
                    >
                      <div className='w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0'>
                        {MAJOR_ICONS[rm.code] ?? MAJOR_ICONS.DEFAULT}
                      </div>
                      <div className='text-left min-w-0'>
                        <p className='font-bold text-sm text-foreground leading-snug'>
                          {rm.nameEn}
                        </p>
                        {rm.careerCategory && (
                          <p className='text-xs text-muted-foreground truncate'>
                            {rm.careerCategory.replace(/_/g, ' ')}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        size={14}
                        className='text-muted-foreground ml-auto group-hover:text-primary transition-colors shrink-0'
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => router.push('/majors')}
                  className='mt-3 w-full text-xs font-semibold text-primary hover:underline text-center cursor-pointer'
                >
                  View All Majors
                </button>
              </div>
            )}

            {/* Need Help CTA */}
            <div className='bg-primary rounded-2xl p-5 text-primary-foreground'>
              <div className='text-2xl mb-2 text-center'>🎓</div>
              <h3 className='font-bold text-sm text-center mb-1'>Need Help?</h3>
              <p className='text-xs opacity-80 text-center leading-relaxed mb-4'>
                Reach out to us by detailing the questions that you have.
              </p>
              <Button
                variant='outline'
                className='w-full rounded-xl text-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 font-bold'
                onClick={() => router.push('/contact')}
              >
                Contact Us
              </Button>
            </div>

            {/* Choose Major CTA */}
            <Button
              className={`w-full rounded-xl font-bold py-5 ${chosen ? 'bg-primary hover:bg-green-600' : ''}`}
              disabled={choosing}
              onClick={handleChoose}
            >
              {choosing ? (
                <>
                  <span className='w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2' />
                  Saving…
                </>
              ) : chosen ? (
                '✓ Major Chosen'
              ) : (
                'Choose This Major'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
