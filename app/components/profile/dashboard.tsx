'use client'

import { useRouter } from 'next/navigation'
import {
  Calendar,
  Target,
  Bookmark,
  Pencil,
  GraduationCap,
  Building2,
  FileText,
  ChevronRight,
  RotateCcw,
  User,
  MapPin,
  Bot,
  Globe,
  Shield,
  Cpu,
  Monitor,
  Smartphone,
  Megaphone,
  Palette,
  BarChart3,
  BookOpen,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileResponse } from '@/lib/profile/action'
import Image from 'next/image'

type Props = {
  profile: ProfileResponse
  accessToken: string
}


const MAJOR_ICONS: Record<
  string,
  { Icon: React.ElementType; gradient: string }
> = {
  AI: { Icon: Bot, gradient: 'from-violet-500/80 to-violet-700/80' },
  NET: { Icon: Globe, gradient: 'from-emerald-500/80 to-emerald-700/80' },
  CYB: { Icon: Shield, gradient: 'from-orange-500/80 to-orange-700/80' },
  CE: { Icon: Cpu, gradient: 'from-sky-500/80 to-sky-700/80' },
  DS: { Icon: Monitor, gradient: 'from-indigo-500/80 to-indigo-700/80' },
  MWD: { Icon: Smartphone, gradient: 'from-purple-500/80 to-purple-700/80' },
  DM: { Icon: Megaphone, gradient: 'from-amber-500/80 to-amber-700/80' },
  GD: { Icon: Palette, gradient: 'from-rose-500/80 to-rose-700/80' },
  BA: { Icon: BarChart3, gradient: 'from-teal-500/80 to-teal-700/80' },
  DEFAULT: { Icon: BookOpen, gradient: 'from-primary/70 to-primary/90' },
}

function getMajorIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}


type PersonalityTag = { label: string; color: string }

function derivePersonalityTags(
  answers: ProfileResponse['latestAnswers']
): PersonalityTag[] {
  const map: Record<string, string | number> = {}
  for (const a of answers) map[a.questionCode] = a.answerValue

  const q4a = Number(map['Q4_A'] ?? 0)
  const q4b = Number(map['Q4_B'] ?? 0)
  const q4c = Number(map['Q4_C'] ?? 0)
  const q4d = Number(map['Q4_D'] ?? 0)
  const q4e = Number(map['Q4_E'] ?? 0)
  const q4f = Number(map['Q4_F'] ?? 0)
  const q4g = Number(map['Q4_G'] ?? 0)

  const tags: PersonalityTag[] = []
  if (q4d >= 4 || q4a >= 4)
    tags.push({
      label: 'Visual Thinker',
      color: 'bg-primary/10 text-primary border-primary/20',
    })
  if (q4b >= 4 || q4g >= 4)
    tags.push({
      label: 'Problem Solver',
      color: 'bg-accent text-accent-foreground border-accent-foreground/10',
    })
  if (q4c >= 4 || q4f >= 4)
    tags.push({
      label: 'Logical',
      color:
        'bg-secondary text-secondary-foreground border-secondary-foreground/10',
    })
  if (q4e >= 3)
    tags.push({
      label: 'Detail Oriented',
      color: 'bg-muted text-muted-foreground border-border',
    })
  if (q4a >= 3 && q4d >= 3)
    tags.push({
      label: 'Creative Learner',
      color: 'bg-primary/10 text-primary border-primary/20',
    })

  if (tags.length === 0) {
    tags.push({
      label: 'Curious Learner',
      color: 'bg-accent text-accent-foreground border-accent-foreground/10',
    })
    tags.push({
      label: 'Analytical',
      color:
        'bg-secondary text-secondary-foreground border-secondary-foreground/10',
    })
  }
  return tags
}


function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className='bg-card border border-border rounded-2xl p-5 flex flex-col gap-2'>
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Icon size={14} className='text-primary' />
        <span className='text-[10px] font-bold tracking-[0.12em] uppercase'>
          {label}
        </span>
      </div>
      <div className='text-2xl font-bold text-foreground leading-tight'>
        {value}
      </div>
    </div>
  )
}

function RecommendationCard({
  code,
  nameEn,
  percentage,
  isChosen,
  onClick,
}: {
  code: string
  nameEn: string
  percentage: number
  isChosen: boolean
  onClick: () => void
}) {
  const { Icon, gradient } = getMajorIcon(code)
  return (
    <button
      onClick={onClick}
      className={`
        group text-left bg-card border rounded-2xl overflow-hidden transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 cursor-pointer w-full
        ${isChosen ? 'border-primary ring-1 ring-primary/30' : 'border-border'}
      `}
    >
      <div
        className={`h-28 bg-linear-to-br ${gradient} flex items-center justify-center`}
      >
        <Icon size={32} className='text-white/90' />
      </div>
      <div className='p-3.5'>
        <p className='font-bold text-sm text-foreground leading-snug'>
          {nameEn}
        </p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          {percentage}% Match
        </p>
        {isChosen && (
          <Badge className='mt-2 text-[10px] bg-primary/10 text-primary border-primary/20 rounded-full px-2 py-0'>
            ✓ Chosen
          </Badge>
        )}
      </div>
    </button>
  )
}

function ShortcutRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className='w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 group cursor-pointer'
    >
      <div className='flex items-center gap-3'>
        <Icon size={16} className='text-primary' />
        <span className='text-sm font-semibold text-foreground'>{label}</span>
      </div>
      <ChevronRight
        size={14}
        className='text-muted-foreground group-hover:text-primary transition-colors'
      />
    </button>
  )
}


export default function DashboardTab({ profile }: Props) {
  const router = useRouter()
  const {
    displayName,
    profilePictureUrl,
    totalAttempts,
    selectedMajor,
    latestAnswers,
    role,
  } = profile

  // Pull top 3 from sessionStorage (populated after quiz)
  let recommendations: Array<{
    code: string
    nameEn: string
    similarityPercentage: number
    majorId: string
  }> = []
  try {
    const stored =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('quizResult')
        : null
    if (stored) recommendations = (JSON.parse(stored).results ?? []).slice(0, 3)
  } catch {
  }

  const personalityTags = derivePersonalityTags(latestAnswers)
  const answeredCount = latestAnswers.length
  const hasQuiz = totalAttempts > 0

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className='space-y-6'>
      {/* Profile hero */}
      <div className='bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5'>
        <div className='relative shrink-0'>
          {profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt={displayName}
              width={64}
              height={64}
              className='w-16 h-16 rounded-full object-cover ring-2 ring-border'
            />
          ) : (
            <div className='w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border'>
              <span className='text-xl font-bold text-primary'>{initials}</span>
            </div>
          )}
          {role === 'ADMIN' && (
            <span className='absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full'>
              ADMIN
            </span>
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <h1 className='text-xl font-bold text-foreground leading-tight'>
            {displayName}
          </h1>
          <div className='flex items-center gap-1.5 mt-1 text-muted-foreground'>
            <MapPin size={12} />
            <span className='text-xs'>Phnom Penh, Cambodia</span>
          </div>
          {/* Selected major badge */}
          {selectedMajor && (
            <div className='mt-2 flex items-center gap-2'>
              <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'>
                🎓 {selectedMajor.nameEn}
              </span>
              {selectedMajor.jobOutlook && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedMajor.jobOutlook === 'HIGH'
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}
                >
                  {selectedMajor.jobOutlook} Demand
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          variant='outline'
          size='sm'
          className='shrink-0 gap-1.5 rounded-xl border-border'
          onClick={() => router.push('/profile/settings')}
        >
          <Pencil size={13} /> Edit Profile
        </Button>
      </div>

      {/* 3 Stat cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard
          icon={Calendar}
          label='Total Assessments'
          value={hasQuiz ? `${totalAttempts} taken` : '—'}
        />
        <StatCard
          icon={Target}
          label='Top Match'
          value={selectedMajor?.nameEn ?? recommendations[0]?.nameEn ?? '—'}
        />
        <StatCard
          icon={Bookmark}
          label='Selected Major'
          value={selectedMajor ? selectedMajor.nameEn : 'None chosen'}
        />
      </div>

      {/* Two-column section */}
      <div className='flex flex-col lg:flex-row gap-6 items-start'>
        {/* Left column */}
        <div className='flex-1 min-w-0 space-y-6'>
          {/* Recommendations */}
          <div className='bg-card border border-border rounded-2xl p-5'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-bold text-base text-foreground'>
                My Recommendations
              </h2>
              {hasQuiz && (
                <button
                  onClick={() => router.push('/quiz/results')}
                  className='text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer'
                >
                  View All <ChevronRight size={12} />
                </button>
              )}
            </div>

            {recommendations.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {recommendations.map(r => (
                  <RecommendationCard
                    key={r.majorId}
                    code={r.code}
                    nameEn={r.nameEn}
                    percentage={r.similarityPercentage}
                    isChosen={selectedMajor?.majorId === r.majorId}
                    onClick={() => router.push(`/majors/${r.majorId}`)}
                  />
                ))}
              </div>
            ) : hasQuiz ? (
              <div className='flex flex-col items-center justify-center py-10 text-center'>
                <p className='text-2xl mb-2'>📊</p>
                <p className='text-sm text-muted-foreground'>
                  Your results are saved on the server.
                </p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-3'
                  onClick={() => router.push('/quiz/results')}
                >
                  View Results
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-10 text-center'>
                <p className='text-2xl mb-2'>🎯</p>
                <p className='text-sm text-muted-foreground'>
                  Take the quiz to get your recommendations
                </p>
                <Button
                  size='sm'
                  className='mt-3'
                  onClick={() => router.push('/quiz')}
                >
                  Start Assessment
                </Button>
              </div>
            )}
          </div>

          {/* Assessment status */}
          <div className='bg-card border border-border rounded-2xl p-5'>
            <div className='flex items-start justify-between mb-1'>
              <div>
                <h2 className='font-bold text-base text-foreground'>
                  Current Assessment Status
                </h2>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {hasQuiz
                    ? `Completed ${answeredCount} of ${answeredCount} questions`
                    : 'No assessment taken yet'}
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5 text-xs rounded-xl shrink-0'
                onClick={() => router.push('/quiz')}
              >
                <RotateCcw size={12} />
                {hasQuiz ? 'Update My Answers' : 'Take Assessment'}
              </Button>
            </div>

            <div className='mt-4 h-2 bg-muted rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary rounded-full transition-all duration-700'
                style={{ width: hasQuiz ? '100%' : '0%' }}
              />
            </div>

            {hasQuiz && personalityTags.length > 0 && (
              <div className='mt-5'>
                <p className='text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2.5'>
                  Your Personality Tags
                </p>
                <div className='flex flex-wrap gap-2'>
                  {personalityTags.map(tag => (
                    <span
                      key={tag.label}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${tag.color}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className='w-full lg:w-64 shrink-0 space-y-4'>
          {/* Quick shortcuts */}
          <div className='bg-card border border-border rounded-2xl p-4 space-y-2'>
            <h3 className='font-bold text-sm text-foreground mb-3'>
              Quick Shortcuts
            </h3>
            <ShortcutRow
              icon={GraduationCap}
              label='Explore Majors'
              onClick={() => router.push('/majors')}
            />
            <ShortcutRow
              icon={Building2}
              label='Universities Match'
              onClick={() => router.push('/universities')}
            />
            <ShortcutRow
              icon={FileText}
              label='Scholarship Guide'
              onClick={() => router.push('/scholarships')}
            />
            <ShortcutRow
              icon={TrendingUp}
              label='My Survey History'
              onClick={() => router.push('/profile/survey')}
            />
          </div>

          {/* Need Guidance CTA */}
          <div className='bg-foreground text-background rounded-2xl p-5'>
            <div className='flex items-start gap-2 mb-1'>
              <User
                size={16}
                className='text-primary mt-0.5 shrink-0'
                style={{ color: 'oklch(0.65 0.12 145)' }}
              />
              <h3 className='font-bold text-sm leading-snug'>Need Guidance?</h3>
            </div>
            <p className='text-xs opacity-70 leading-relaxed mt-1 mb-4'>
              Book a 15-min call with an education counselor to discuss your
              results.
            </p>
            <button
              onClick={() => router.push('/counseling')}
              className='w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all cursor-pointer'
            >
              Schedule Free Call
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
