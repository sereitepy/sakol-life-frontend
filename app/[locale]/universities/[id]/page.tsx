'use client'

import { Button } from '@/components/ui/button'
import {
  AuthIdentity,
  fetchUniversityDetail,
  UniversityDetailResponse,
} from '@/lib/profile/action'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Code2,
  DollarSign,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Info,
  Library,
  MapPin,
  Utensils,
  Wifi,
} from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


const FACILITY_ICONS: Record<string, React.ElementType> = {
  library: Library,
  lab: FlaskConical,
  cafeteria: Utensils,
  sports: Building2,
  wifi: Wifi,
  default: BookOpen,
}

function getFacilityIcon(key: string | null): React.ElementType {
  return FACILITY_ICONS[key ?? 'default'] ?? FACILITY_ICONS.default
}

const ADMISSION_ICONS: Record<string, React.ElementType> = {
  diploma: GraduationCap,
  star: CheckCircle2,
  clipboard: ClipboardList,
  default: BookOpen,
}

function getAdmissionIcon(key: string | null): React.ElementType {
  return ADMISSION_ICONS[key ?? 'default'] ?? ADMISSION_ICONS.default
}

// Nav sections

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'major', label: 'Selected Major', icon: GraduationCap },
  { id: 'admission', label: 'Admission', icon: ClipboardList },
  { id: 'tuition', label: 'Tuition & Fees', icon: DollarSign },
  { id: 'scholarships', label: 'Scholarships', icon: BookOpen },
  { id: 'facilities', label: 'Facilities', icon: Building2 },
]

// Section anchor wrapper 

function SectionAnchor({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className='scroll-mt-24'>
      {children}
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='text-xl font-bold text-foreground mb-5 flex items-center gap-2'>
      {children}
    </h2>
  )
}

// Main page 

export default function UniversityDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const universityId = params.id

  const [uni, setUni] = useState<UniversityDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState('overview')

  // Sidebar scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveNav(e.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    NAV_SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [uni])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      const identity: AuthIdentity | undefined = session?.user
        ? {
            type: 'user',
            userId: session.user.id,
            accessToken: session.access_token,
          }
        : undefined

      try {
        const guestId = sessionStorage.getItem('guestSessionId')
        const id: AuthIdentity | undefined =
          identity ??
          (guestId ? { type: 'guest', guestSessionId: guestId } : undefined)

        const detail = await fetchUniversityDetail(universityId, id)
        setUni(detail)
      } catch (e) {
        console.error(e)
        setError('Failed to load university details.')
      } finally {
        setLoading(false)
      }
    })
  }, [universityId])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin' />
      </div>
    )
  }

  if (error || !uni) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <p className='text-2xl mb-2'>😕</p>
          <p className='font-semibold text-foreground'>
            {error ?? 'University not found'}
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

  const mp = uni.selectedMajorProgram

  return (
    <div className='min-h-screen bg-background'>
      {/* Back nav */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-4'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
        >
          <ArrowLeft size={15} /> Back to University Tab
        </button>
      </div>

      {/* Hero Banner */}
      <div className='relative h-56 sm:h-72 md:h-80 bg-muted overflow-hidden'>
        {uni.bannerUrl ? (
          <Image
            src={uni.bannerUrl}
            alt={uni.nameEn}
            fill
            className='object-cover'
            priority
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-6xl bg-linear-to-br from-muted to-muted/50'>
            🏛️
          </div>
        )}
        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />

        {/* Hero content */}
        <div className='absolute bottom-0 left-0 right-0 p-6 sm:p-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex flex-wrap items-center gap-3 mb-2'>
              <span className='text-[11px] font-bold tracking-widest text-white uppercase bg-primary px-3 py-1 rounded-full'>
                {uni.type === 'PUBLIC'
                  ? 'Public University'
                  : 'Private University'}
              </span>
              <span className='flex items-center gap-1 text-white/80 text-xs'>
                <MapPin size={11} /> {uni.locationCity}, Cambodia
              </span>
            </div>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2'>
              {uni.nameEn}
            </h1>
            {uni.overviewEn && (
              <p className='text-white/75 text-sm leading-relaxed max-w-2xl line-clamp-2'>
                {uni.overviewEn}
              </p>
            )}
            <div className='flex flex-wrap gap-3 mt-4'>
              <Button
                className='rounded-xl font-bold gap-2'
                onClick={() => window.open(uni.websiteUrl ?? '#', '_blank')}
              >
                Apply Now →
              </Button>
              {uni.websiteUrl && (
                <Button
                  variant='outline'
                  className='rounded-xl font-bold gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20'
                  onClick={() => window.open(uni.websiteUrl!, '_blank')}
                >
                  <ExternalLink size={14} /> Visit Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        <div className='flex gap-8 items-start'>
          {/* Left sidebar (sticky nav) */}
          <aside className='hidden lg:flex flex-col gap-3 w-52 shrink-0 sticky top-6'>
            {/* Nav card */}
            <div className='bg-card border border-border rounded-2xl p-4'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-8 h-8 rounded-lg bg-muted overflow-hidden shrink-0'>
                  {uni.logoUrl ? (
                    <Image
                      src={uni.logoUrl}
                      alt=''
                      width={32}
                      height={32}
                      className='object-contain w-full h-full'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-xs'>
                      🏛️
                    </div>
                  )}
                </div>
                <div>
                  <p className='text-xs font-bold text-foreground leading-tight'>
                    Navigation
                  </p>
                  <p className='text-[10px] text-muted-foreground'>
                    Jump to section
                  </p>
                </div>
              </div>

              <div className='space-y-0.5'>
                {NAV_SECTIONS.map(s => {
                  const Icon = s.icon
                  const isActive = activeNav === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() =>
                        document
                          .getElementById(s.id)
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon
                        size={13}
                        className={isActive ? 'text-primary' : ''}
                      />
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Need help CTA */}
            <div className='bg-primary/5 border border-primary/20 rounded-2xl p-4'>
              <p className='font-bold text-sm text-foreground mb-1'>
                Need help applying?
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed mb-3'>
                Our counselors are ready to guide you through the process.
              </p>
              <Button
                size='sm'
                className='w-full rounded-xl text-xs font-bold'
                onClick={() => router.push('/counseling')}
              >
                Chat with Counselor
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <div className='flex-1 min-w-0 space-y-10'>
            {/* Overview */}
            <SectionAnchor id='overview'>
              <SectionTitle>
                <CheckCircle2 size={18} className='text-primary' /> Overview
              </SectionTitle>
              {uni.overviewEn && (
                <p className='text-sm text-muted-foreground leading-relaxed mb-6'>
                  {uni.overviewEn}
                </p>
              )}
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {uni.establishedDate && (
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                      Established
                    </p>
                    <p className='font-bold text-foreground'>
                      {new Date(uni.establishedDate).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                    Type
                  </p>
                  <p className='font-bold text-foreground'>
                    {uni.type === 'PUBLIC'
                      ? 'Public University'
                      : 'Private University'}
                  </p>
                </div>
                {uni.accreditation && (
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                      Accreditation
                    </p>
                    <p className='font-bold text-foreground flex items-center gap-1'>
                      <CheckCircle2 size={13} className='text-primary' />{' '}
                      {uni.accreditation}
                    </p>
                  </div>
                )}
              </div>
            </SectionAnchor>

            {/* Selected Major */}
            {mp && (
              <SectionAnchor id='major'>
                <div className='flex items-center justify-between mb-5'>
                  <SectionTitle>
                    <GraduationCap size={18} className='text-primary' /> The
                    Selected Major
                  </SectionTitle>
                  <button
                    onClick={() => router.push('/quiz/results')}
                    className='text-xs font-semibold text-primary hover:underline cursor-pointer'
                  >
                    Change Major
                  </button>
                </div>

                <div className='bg-gray-900 dark:bg-card rounded-2xl p-6 text-white dark:text-foreground border border-gray-800 dark:border-border'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      {mp.degreeType && (
                        <span className='text-[11px] font-bold tracking-widest text-primary uppercase bg-primary/20 px-3 py-1 rounded-full mb-3 inline-block'>
                          {mp.degreeType}
                        </span>
                      )}
                      <h3 className='text-2xl font-extrabold text-white dark:text-foreground mt-2'>
                        {mp.majorNameEn}
                      </h3>
                      {mp.department && (
                        <p className='text-sm text-gray-400 dark:text-muted-foreground mt-1'>
                          {mp.department}
                        </p>
                      )}
                    </div>
                    <div className='w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0'>
                      <Code2 size={18} className='text-primary' />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4'>
                    {mp.durationYears && (
                      <div className='bg-white/5 rounded-xl p-3'>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                          Duration
                        </p>
                        <p className='font-bold text-white text-sm'>
                          {mp.durationYears} Years
                        </p>
                      </div>
                    )}
                    {mp.credits && (
                      <div className='bg-white/5 rounded-xl p-3'>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                          Credits
                        </p>
                        <p className='font-bold text-white text-sm'>
                          {mp.credits} Credits
                        </p>
                      </div>
                    )}
                    {mp.language && (
                      <div className='bg-white/5 rounded-xl p-3'>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                          Language
                        </p>
                        <p className='font-bold text-white text-sm'>
                          {mp.language}
                        </p>
                      </div>
                    )}
                    <div className='bg-white/5 rounded-xl p-3'>
                      <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                        Internship
                      </p>
                      <p className='font-bold text-white text-sm'>
                        {mp.internshipRequired ? 'Required' : 'Optional'}
                      </p>
                    </div>
                  </div>

                  {mp.careerProspects.length > 0 && (
                    <div>
                      <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2'>
                        Career Prospects
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {mp.careerProspects.map(p => (
                          <span
                            key={p}
                            className='text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/20'
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SectionAnchor>
            )}

            {/* Admission */}
            {uni.admissionRequirements.length > 0 && (
              <SectionAnchor id='admission'>
                <SectionTitle>
                  <ClipboardList size={18} className='text-primary' /> Admission
                  Requirements
                </SectionTitle>
                <div className='space-y-3'>
                  {uni.admissionRequirements.map(a => {
                    const Icon = getAdmissionIcon(a.iconKey)
                    return (
                      <div
                        key={a.id}
                        className='flex gap-4 p-4 bg-card border border-border rounded-2xl'
                      >
                        <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
                          <Icon size={16} className='text-primary' />
                        </div>
                        <div className='min-w-0'>
                          <p className='font-bold text-sm text-foreground'>
                            {a.titleEn}
                          </p>
                          {a.descriptionEn && (
                            <p className='text-xs text-muted-foreground mt-1 leading-relaxed'>
                              {a.descriptionEn}
                            </p>
                          )}
                          {a.linkUrl && a.linkLabelEn && (
                            <a
                              href={a.linkUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs font-semibold text-primary hover:underline mt-1.5 inline-flex items-center gap-1'
                            >
                              {a.linkLabelEn} <ChevronRight size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </SectionAnchor>
            )}

            {/* Tuition & Fees */}
            {uni.tuitionFees.length > 0 && (
              <SectionAnchor id='tuition'>
                <SectionTitle>
                  <DollarSign size={18} className='text-primary' /> Tuition &
                  Fees
                </SectionTitle>
                <div className='bg-card border border-border rounded-2xl overflow-hidden'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b border-border bg-muted/40'>
                        <th className='text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          Program Type
                        </th>
                        <th className='text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          Per Semester
                        </th>
                        <th className='text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          Per Year
                        </th>
                        <th className='text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:table-cell'>
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uni.tuitionFees.map((t, i) => (
                        <tr
                          key={t.id}
                          className={
                            i < uni.tuitionFees.length - 1
                              ? 'border-b border-border'
                              : ''
                          }
                        >
                          <td className='px-4 py-3.5 font-semibold text-foreground'>
                            {t.programTypeEn}
                          </td>
                          <td className='px-4 py-3.5 text-right text-muted-foreground'>
                            {t.feePerSemester
                              ? `$${t.feePerSemester.toLocaleString()}`
                              : '—'}
                          </td>
                          <td className='px-4 py-3.5 text-right font-bold text-foreground'>
                            {t.feePerYear
                              ? `$${t.feePerYear.toLocaleString()}`
                              : '—'}
                          </td>
                          <td className='px-4 py-3.5 text-right text-xs text-muted-foreground hidden sm:table-cell'>
                            {t.notesEn ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className='px-4 py-3 bg-muted/20 border-t border-border flex items-start gap-2'>
                    <Info
                      size={13}
                      className='text-muted-foreground shrink-0 mt-0.5'
                    />
                    <p className='text-[11px] text-muted-foreground leading-relaxed'>
                      Fees are subject to change. Additional costs for books,
                      uniforms, and administrative fees may apply. Contact the
                      bursar office for the most current fee structure.
                    </p>
                  </div>
                </div>
              </SectionAnchor>
            )}

            {/* Scholarships */}
            {uni.scholarships.length > 0 && (
              <SectionAnchor id='scholarships'>
                <div className='flex items-center justify-between mb-5'>
                  <SectionTitle>
                    <BookOpen size={18} className='text-primary' /> Scholarships
                  </SectionTitle>
                  <button className='text-xs font-semibold text-primary hover:underline cursor-pointer'>
                    View All
                  </button>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {uni.scholarships.map(s => (
                    <div
                      key={s.id}
                      className='bg-card border border-border rounded-2xl p-5 relative'
                    >
                      {s.coverageLabel && (
                        <span
                          className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            s.coverageLabel.includes('100')
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}
                        >
                          {s.coverageLabel}
                        </span>
                      )}
                      <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3'>
                        <GraduationCap size={15} className='text-primary' />
                      </div>
                      <h4 className='font-bold text-sm text-foreground mb-1 pr-20'>
                        {s.nameEn}
                      </h4>
                      {s.descriptionEn && (
                        <p className='text-xs text-muted-foreground leading-relaxed mb-2'>
                          {s.descriptionEn}
                        </p>
                      )}
                      {s.deadline && (
                        <p className='text-[10px] text-muted-foreground flex items-center gap-1 mt-2'>
                          <Calendar size={11} />
                          Deadline:{' '}
                          {new Date(s.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </SectionAnchor>
            )}

            {/* Campus Facilities */}
            {(uni.facilities.length > 0 || uni.facilityPhotos.length > 0) && (
              <SectionAnchor id='facilities'>
                <SectionTitle>
                  <Building2 size={18} className='text-primary' /> Campus
                  Facilities
                </SectionTitle>

                {uni.facilities.length > 0 && (
                  <div className='grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6'>
                    {uni.facilities.map(f => {
                      const Icon = getFacilityIcon(f.iconKey)
                      return (
                        <div
                          key={f.id}
                          className='flex flex-col items-center gap-2 text-center'
                        >
                          <div className='w-12 h-12 rounded-2xl bg-muted flex items-center justify-center'>
                            <Icon size={20} className='text-muted-foreground' />
                          </div>
                          <p className='text-xs font-semibold text-foreground leading-tight'>
                            {f.nameEn}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {uni.facilityPhotos.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {uni.facilityPhotos.map(p => (
                      <div
                        key={p.id}
                        className='relative h-36 sm:h-44 rounded-2xl overflow-hidden bg-muted'
                      >
                        <Image
                          src={p.photoUrl}
                          alt={p.altTextEn ?? ''}
                          fill
                          className='object-cover hover:scale-105 transition-transform duration-300'
                        />
                      </div>
                    ))}
                  </div>
                )}
              </SectionAnchor>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
