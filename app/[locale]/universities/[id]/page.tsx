'use client'

import { Button } from '@/components/ui/button'
import {
  AuthIdentity,
  fetchUniversityDetail,
  UniversityDetailResponse,
} from '@/lib/profile/action'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { 
  ArrowLeft,
  BookOpen,
  Building2,
  Briefcase,
  CalendarDays,
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
  Shield,       // <-- ADD THIS LINE
  Users,        // <-- ADD THIS IF YOU ARE USING COMMON AREA
  Coffee,       // <-- ADD THIS IF YOU ARE USING CANTEEN
  Lightbulb,
  Activity,
  Monitor, 
  TreeDeciduous, 
  Building, 
  Mic, 
  Cpu, 
  Search,
  Rocket,
  Award,
  Wrench,
  FileText,         // For Documents
  ScrollText,       // For Exams
  Languages,
  CreditCard,        // For English
  User,     // Used for Human/Student
  Globe,    // Used for Globe
  Crown,    // Used for Leader
  Home,
  LanguagesIcon,
  ​Music,
  Sprout,
  Server,
  Palette,
  Network,
  Radio,
  Gavel,
  ChartBar,
  Stethoscope,
  Camera,
  Settings,
  Group,
  BuildingIcon,
  Video,
  Banknote,
  Hotel,
  AudioLinesIcon,
} from 'lucide-react';

// Comprehensive translation map for Cambodian provinces and cities
const CAMBODIA_PROVINCES_KM: Record<string, string> = {
  'Phnom Penh': 'ភ្នំពេញ',
  'Siem Reap': 'សៀមរាប',
  'Battambang': 'បាត់ដំបង',
  'Sihanoukville': 'ព្រះសីហនុ',
  'Preah Sihanouk': 'ព្រះសីហនុ',
  'Kampong Cham': 'កំពង់ចាម',
  'Kampong Chhnang': 'កំពង់ឆ្នាំង',
  'Kampong Speu': 'កំពង់ស្ពឺ',
  'Kampong Thom': 'កំពង់ធំ',
  'Kampot': 'កំពត',
  'Kandal': 'កណ្តាល',
  'Kep': 'កែប',
  'Koh Kong': 'កោះកុង',
  'Kratie': 'ក្រចេះ',
  'Mondulkiri': 'មណ្ឌលគីរី',
  'Oddar Meanchey': 'ឧត្តរមានជ័យ',
  'Pailin': 'ប៉ៃលិន',
  'Preah Vihear': 'ព្រះវិហារ',
  'Prey Veng': 'ព្រៃវែង',
  'Pursat': 'ពោធិ៍សាត់',
  'Ratanakiri': 'រតនគីរី',
  'Stung Treng': 'ស្ទឹងត្រែង',
  'Svay Rieng': 'ស្វាយរៀង',
  'Takeo': 'តាកែវ',
  'Thbongkhmum': 'ត្បូងឃ្មុំ',
  'Banteay Meanchey': 'បន្ទាយមានជ័យ'
}

// Frontend fallback translation map for University Names
const UNIVERSITY_NAMES_KM: Record<string, string> = {
  'Royal University of Phnom Penh': 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
  'Institute of Technology of Cambodia': 'វិទ្យាស្ថានបច្គេកវិទ្យាកម្ពុជា',
  'Norton University': 'សាកលវិទ្យាល័យ ន័រតុន',
  'Cambodia Academy of Digital Technology': 'បណ្ឌិត្យសភានិនវានុវត្តន៍ឌីជីថមកម្ពុជា',
  'Paññāsāstra University of Cambodia': 'សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា',
  'Paragon International University': 'សាកលវិទ្យាល័យអន្តរជាតិផារ៉ាហ្គន',
  'Kirirom Institute of Technology': 'វិទ្យាស្ថានបច្ចេកវិទ្យាគិរីរម្យ',
  'American University of Phnom Penh': 'សាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ',
  'De Montfort University Cambodia': 'សាកលវិទ្យាល័យ ដឺ ម៉ុនហ្វត កម្ពុជា '
}

function getUniversityName(nameEn: string, isKhmer: boolean): string {
  if (!isKhmer) return nameEn;
  return UNIVERSITY_NAMES_KM[nameEn] || nameEn; // Returns Khmer name or falls back to English
}

// Frontend fallback translation map for Accreditations
const ACCREDITATION_MAPPINGS_KM: Record<string, string> = {
  'Accredited by MoEYS and ACC': 'ទទួលស្គាល់គុណភាពអប់រំដោយក្រសួងអប់រំ យុវជន និងកីឡា និងគណៈកម្មាធិការ ACC',
  'Accredited by Ministry of Education, Youth and Sport (MoEYS) and ACC': 'ទទួលស្គាល់គុណភាពអប់រំដោយក្រសួងអប់រំ យុវជន និងកីឡា និងគណៈកម្មាធិការ ACC',
  'Accredited by the Ministry of Education, Youth and Sport (MoEYS)': 'ទទួលស្គាល់គុណភាពអប់រំដោយក្រសួងអប់រំ យុវជន និងកីឡា',
  'Accredited by MoEYS': 'ទទួលស្គាល់គុណភាពអប់រំដោយក្រសួងអប់រំ យុវជន និងកីឡា',
  'Accredited by MoEYS, ACC, WSCUC​​ and HLC': 'ទទួលស្គាល់គុណភាពអប់រំដោយក្រសួងអប់រំ យុវជន និងកីឡា និងគណៈកម្មាធិការ ACC, WSCUC និង HLC', 
  'Accredited by Ministry of Labour and Vocational Training (MLVT)': 'ទួលស្គាល់ដោយក្រសួងការងារ និងបណ្តុះបណ្តាលវិជ្ជាជីវៈ (MLVT)', 
  'Accredited by the UK Quality Assurance Agency (QAA) and recognized internationally.': 'ទទួលស្គាល់ដោយទីភ្នាក់ងារធានាគុណភាពនៃចក្រភពអង់គ្លេស (QAA) និងត្រូវបានទទួលស្គាល់ជាអន្តរជាតិ។',

}

// Frontend fallback dictionary mapping for specific Admission Text Inputs
const ADMISSION_LABELS_KM: Record<string, string> = {
  'apply now': 'ដាក់ពាក្យឥឡូវនេះ',
  'admission info': 'ព័ត៌មានចុះឈ្មោះចូលរៀន',
  'admissions info': 'ព័ត៌មានចុះឈ្មោះចូលរៀន',
  'view details': 'មើលលម្អិត',
  'view academic details': 'មើលព័ត៌មានលម្អិតផ្នែកសិក្សា',
  'view detail': 'មើលលម្អិត',
  'apply here': 'ដាក់ពាក្យនៅទីនេះ',
  'register here': 'ចុះឈ្មោះនៅទីនេះ',
  'visit portal': 'ចូលទៅកាន់គេហទំព័រ',
  'read more': 'អានបន្ថែម',
  'official link': 'តំណភ្ជាប់ផ្លូវការ',
}

// Traditional Khmer Short Month Names Array
const KHMER_MONTHS_SHORT = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
]

function convertToKhmerDigits(str: string): string {
  const map: Record<string, string> = {
    '0': '០', '1': '១', '2': '២', '3': '៣', '4': '៤',
    '5': '៥', '6': '៦', '7': '៧', '8': '៨', '9': '៩'
  };
  return str.split('').map(char => map[char] || char).join('');
}

// Fully custom date formatter that fixes native Intl.DateTimeFormat limitations for Khmer months
function formatDate(dateString: string | Date, isKhmer: boolean): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '—'

  if (isKhmer) {
    const day = convertToKhmerDigits(date.getDate().toString())
    const month = KHMER_MONTHS_SHORT[date.getMonth()]
    const year = convertToKhmerDigits(date.getFullYear().toString())
    return `${day} ${month} ${year}`
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function translateCoverageLabel(rawLabelEn: string, rawLabelKh: string, isKhmer: boolean): string {
  const cleanEn = (rawLabelEn || '').trim();
  const cleanKh = (rawLabelKh || '').trim();

  // 1. Highest Priority: Pre-translated Khmer from DB
  if (isKhmer && cleanKh !== "") {
    return convertToKhmerDigits(cleanKh);
  }

  if (!isKhmer) return cleanEn;

  // 2. Logic for English-to-Khmer translation
  const lowerCoverage = cleanEn.toLowerCase();

  if (lowerCoverage.includes('50') && lowerCoverage.includes('100')) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សា ៥០-១០០%';
  }
  if (lowerCoverage.includes('full')) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សា ១០០%';
  }
    if (lowerCoverage.includes('full') || lowerCoverage.includes('coverage')) {
    return 'អាហារូបករណ៍ពេញលេញ';
  }
       if (lowerCoverage.includes('20% - 100% scholarship'​)) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សា ២០%-១០០%';
  }
      if (lowerCoverage.includes('25-100% scholarship'​)) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សា ២៥-១០០%';
  }
   if (lowerCoverage.includes('up to 30%')) {
    return 'អាហារូបករណ៍រហូតដល់ ៣០%';
  }
  if (lowerCoverage.includes('up to 50%')) {
    return 'អាហារូបករណ៍រហូតដល់ ៥០%';
  }
    if (lowerCoverage.includes('60% tuition scholarship'​)) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សា ៦០%';
  }
    if (lowerCoverage.includes('40-70% scholarship'​)) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សា ៤០-៧០%';
  }
   if (lowerCoverage.includes('5%-35%')) {
    return 'អាហារូបករណ៍ ៥%-៣៥%';
  }
  if (lowerCoverage.includes('partial')) {
    return 'អាហារូបករណ៍មួយផ្នែក';
  }
  if (lowerCoverage.includes('partial (1 year)')) {
    return 'អាហារូបករណ៍មួយផ្នែក (១ ឆ្នាំ)';
  } 
    if (lowerCoverage.includes('partial (4 year)')) {
    return 'អាហារូបករណ៍មួយផ្នែក (៤ ឆ្នាំ)';
  } 
  if (lowerCoverage.includes('full/partial tuition')) {
    return 'អាហារូបករណ៍ថ្លៃសិក្សាពេញ/មួយផ្នែក';
  }
  if (lowerCoverage.includes('50')) {
    return 'អាហារូបករណ៍ ៥០%';
  }
  if (lowerCoverage.includes('tuition')) {
    return 'ថ្លៃសិក្សា';
  }
if (lowerCoverage.includes('additional benefits') || lowerCoverage.includes('extra benefits')) {
  return 'អត្ថប្រយោជន៍បន្ថែម';
}
if (lowerCoverage.includes('merit-based')) {
  return 'ផ្អែកលើសមិទ្ធផលសិក្សា';
}
if (lowerCoverage.includes('merit & need-based')) {
  return 'ផ្អែកលើសមិទ្ធផលសិក្សា និងស្ថានភាពហិរញ្ញវត្ថុ';
}
if (lowerCoverage.includes('financial support')) {
  return 'ផ្តល់ការគាំទ្រផ្នែកហិរញ្ញវត្ថុ';
}
if (lowerCoverage.includes('variable (selective)')) {
  return 'មិនកំណត់ (តាមការសម្រាំងជ្រើសរើស)';
}
if (lowerCoverage.includes('variable')) {
  return 'មិនកំណត់';
}
if (lowerCoverage.includes('selective')) {
  return 'តាមការសម្រាំងជ្រើសរើស';
}
if (lowerCoverage.includes('exchange program') || lowerCoverage.includes('extra benefits')) {
  return 'កម្មវិធីផ្លាស់ប្តូរ';
}

if (lowerCoverage.includes('15% - 100% scholarship')) {
  return 'អាហារូបករណ៍ថ្លៃសិក្សា ១៥%-១០០%';
}

  // 3. Fallback: Extract digits
  const match = cleanEn.match(/\d+/);
  return match ? `អាហារូបករណ៍ ${convertToKhmerDigits(match[0])}%` : cleanEn;
}

// 1. Updated Icons Mapping
const FACILITY_ICONS: Record<string, React.ElementType> = {
  code: Code2,               // Used for Computer Science Laboratories
  shield: Shield,            // Used for Cybersecurity & Networking
  book_open: BookOpen,       // Used for Library & Research Center
  lightbulb: Lightbulb,      // Used for Digital Innovation Hub
  activity: Activity,        // Used for Sports Facilities
  wifi: Wifi,                // Used for Wi-Fi Campus Network
  conference_hall: Building2,// Used for Conference Hall
  common_area: Users,        // Used for Common Area
  canteen: Utensils,  
  monitor: Monitor,
  tree: TreeDeciduous,
  building: Building,
  mic: Mic,
  cpu: Cpu,
  search: Search,   
  coffee: Coffee,
  sport: Award,
  library: Library,
  startup: Rocket,
  laboratory: FlaskConical,
  office: Briefcase,
  event_space: CalendarDays,
  tool: Wrench,
  credit_card: BookOpen,
  student: User,
  globe: Globe,
  leader: BookOpen,
  chinese: LanguagesIcon,
  home: Home,
  music: Music,
  sprout: Sprout,
  server: Server,
  palette: Palette,
  network: Network,
  radio: Radio,
  gavel: Gavel,
  chartbar: ChartBar,
  stethoscope: Stethoscope,
  camera: Camera,
  settings: Settings,
  group: Group,
  build: BuildingIcon,
  video: Video,
  bank: Banknote,
  hotel: Hotel,
  audio: AudioLinesIcon,
  default: BookOpen,         // Fallback
};

// 2. Updated Helper to handle key normalization
function getFacilityIcon(key: string | null): React.ElementType {
  if (!key) return FACILITY_ICONS.default;
  
  // Normalizes iconKey to match the dictionary keys
  // Handles cases where JSON might use hyphens instead of underscores
  const normalizedKey = key.replace(/-/g, '_');
  return FACILITY_ICONS[normalizedKey] ?? FACILITY_ICONS.default;
}

const ADMISSION_ICONS: Record<string, React.ElementType> = {
  diploma: GraduationCap,
  exam: ScrollText,
  english: Languages,
  document: FileText,
  default: BookOpen,
};

function getAdmissionIcon(key: string | null): React.ElementType {
  if (!key) return ADMISSION_ICONS.default;
  
  // Normalizes "Entrance-Exam" or "ENTRANCE-EXAM" to "entrance_exam"
  const normalizedKey = key.replace(/-/g, '_').toLowerCase().trim();
  
  return ADMISSION_ICONS[normalizedKey] ?? ADMISSION_ICONS.default;
}

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

export default function UniversityDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const locale = useLocale()
  const isKhmer = locale === 'km'
  const universityId = params.id
  const [imageError, setImageError] = useState(false);

  const t = useTranslations('university_detail')

  const [uni, setUni] = useState<UniversityDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState('overview')
  const [logoError, setLogoError] = useState(false)

  const NAV_SECTIONS = [
    { id: 'overview', label: t('sections.overview'), icon: BookOpen },
    { id: 'major', label: t('sections.major'), icon: GraduationCap },
    { id: 'admission', label: t('sections.admission'), icon: ClipboardList },
    { id: 'tuition', label: t('sections.tuition'), icon: DollarSign },
    { id: 'scholarships', label: t('sections.scholarships'), icon: BookOpen },
    { id: 'facilities', label: t('sections.facilities'), icon: Building2 },
  ]

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
        setError(t('error_not_found'))
      } finally {
        setLoading(false)
      }
    })
  }, [universityId, t])

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
          <p className='font-semibold text-foreground'>{error ?? t('error_not_found')}</p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => router.back()}
          >
            {t('btn_go_back')}
          </Button>
        </div>
      </div>
    )
  }

  const mp = uni.selectedMajorProgram
  
const rawNameEn = uni.nameEn ? uni.nameEn.trim() : '';
const apiNameKh = (uni.nameKh || (uni as any).nameKM || '').trim();

const uniName = isKhmer && apiNameKh !== "" 
    ? `${apiNameKh} (${rawNameEn})` 
    : (isKhmer && UNIVERSITY_NAMES_KM[rawNameEn] 
        ? `${UNIVERSITY_NAMES_KM[rawNameEn]} (${rawNameEn})` 
        : rawNameEn);
  
  // 2. Overview Selection
  const uniOverview = isKhmer && uni.overviewKh && uni.overviewKh.trim() !== "" ? uni.overviewKh : uni.overviewEn
  
  // 3. Location Localization
  const apiLocation = (uni.locationCityKh || uni.locationCity || '').trim()
  let uniLocation = apiLocation
  if (isKhmer && apiLocation !== "") {
    uniLocation = CAMBODIA_PROVINCES_KM[apiLocation] || apiLocation
  }

  // 4. Accreditation Mapping
  const rawAccreditationEn = uni.accreditation ? uni.accreditation.trim() : ''
  const apiAccreditationKh = ((uni as any).accreditationKh || '').trim()
  
  let uniAccreditation = isKhmer && apiAccreditationKh !== "" ? apiAccreditationKh : uni.accreditation
  if (isKhmer && apiAccreditationKh === "" && rawAccreditationEn) {
    uniAccreditation = ACCREDITATION_MAPPINGS_KM[rawAccreditationEn] || rawAccreditationEn
  }
  console.log('Banner URL:', uni.bannerUrl)
console.log('Full uni object:', uni)

  return (
    <div className='min-h-screen bg-background'>
      {/* Back nav */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-4'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
        >
          <ArrowLeft size={15} /> {t('back_to_tab')}
        </button>
      </div>

      {/* Hero Banner */}
    <div className='relative h-56 sm:h-72 md:h-80 bg-muted overflow-hidden'>
  {uni.bannerUrl ? (
    // Use plain <img> for external URLs - bypasses Next.js server-side fetching
    <img
      src={uni.bannerUrl}
      alt={uniName}
      className='w-full h-full object-cover'
      onError={(e) => {
        e.currentTarget.style.display = 'none'
        setImageError(true)
      }}
    />
  ) : (
    <div className='w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-muted/50'>
      🏛️
    </div>
  )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
        {/* Hero content */}
       <div className='absolute bottom-0 left-0 right-0 p-6 sm:p-8'>
  <div className='max-w-6xl mx-auto'>
    <div className='flex flex-wrap items-center gap-3 mb-2'>
      <span className='text-[11px] font-bold tracking-widest text-white uppercase bg-primary px-3 py-1 rounded-full'>
        {uni.type === 'PUBLIC' ? t('public_uni') : t('private_uni')}
      </span>
      <span className='flex items-center gap-1 text-white/80 text-xs'>
        <MapPin size={11} /> {uniLocation}, {isKhmer ? 'កម្ពុជា' : 'Cambodia'}
      </span>
    </div>
    
    {/* The uniName now contains the bilingual string */}
    <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2'>
      {uniName}
    </h1>

    {uniOverview && (
      <p className='text-white/75 text-sm leading-relaxed max-w-2xl line-clamp-2'>
        {uniOverview}
      </p>
    )}
            <div className='flex flex-wrap gap-3 mt-4'>
              <Button
                className='rounded-xl font-bold gap-2'
                onClick={() => window.open(uni.websiteUrl ?? '#', '_blank')}
              >
                {t('apply_now')} →
              </Button>
              {uni.websiteUrl && (
                <Button
                  variant='outline'
                  className='rounded-xl font-bold gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20'
                  onClick={() => window.open(uni.websiteUrl!, '_blank')}
                >
                  <ExternalLink size={14} /> {t('visit_website')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        <div className='flex gap-8 items-start'>
          {/* Left sidebar */}
          <aside className='hidden lg:flex flex-col gap-3 w-64 shrink-0 sticky top-6'>
            <div className='bg-card border border-border rounded-2xl p-4'>
              
              {/* Sidebar Header Block */}
              <div className='flex items-center gap-3 mb-5 pb-3 border-b border-border/60'>
                <div className='w-11 h-11 shrink-0 rounded-xl border border-border/40 overflow-hidden relative flex items-center justify-center p-0.5'>
                  {!logoError ? (
                    <Image
                      src={uni.logoUrl || '/images/RUPP_logo.png'}
                      alt={uniName}
                      fill
                      className='object-contain rounded-xl'
                      sizes='44px'
                      onError={() => {
                        if (uni.logoUrl) {
                          setUni(prev => prev ? { ...prev, logoUrl: '/images/RUPP_logo.png' } : null)
                        } else {
                          setLogoError(true)
                        }
                      }}
                    />
                  ) : (
                    <span className='text-xl'>🏛️</span>
                  )}
                </div>
                <div className='min-w-0 flex-1 text-left'>
                  <h4 className='text-sm font-bold text-foreground leading-snug break-words'>
                    {uniName}
                  </h4>
                  <p className='text-[11px] text-muted-foreground mt-0.5 font-medium'>
                    {uni.type === 'PUBLIC' ? t('public_uni') : t('private_uni')}
                  </p>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <div className='space-y-1'>
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
                      className={`w-full flex items-center text-left gap-3 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground/80'}`}
                      />
                      <span className='break-words whitespace-normal leading-tight flex-1 font-medium'>
                        {s.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Counselors card */}
            <div className='bg-primary/5 border border-primary/15 rounded-2xl p-4 text-left'>
              <p className='font-bold text-sm text-foreground mb-1'>
                {t('help_title')}
              </p>
              <p className='text-xs text-muted-foreground leading-relaxed mb-3'>
                {t('help_desc')}
              </p>
              <Button
                size='sm'
                className='w-full rounded-xl text-xs font-bold shadow-xs'
                onClick={() => router.push('/counseling')}
              >
                {t('help_cta')}
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <div className='flex-1 min-w-0 space-y-10 text-left'>
            {/* Overview Section */}
            <SectionAnchor id='overview'>
              <SectionTitle>
                <CheckCircle2 size={18} className='text-primary' /> {t('sections.overview')}
              </SectionTitle>
              {uniOverview && (
                <p className='text-sm text-muted-foreground leading-relaxed mb-6'>
                  {uniOverview}
                </p>
              )}
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {uni.establishedDate && (
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                      {t('established')}
                    </p>
                    <p className='font-bold text-foreground'>
                      {formatDate(uni.establishedDate, isKhmer)}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                    {t('type')}
                  </p>
                  <p className='font-bold text-foreground'>
                    {uni.type === 'PUBLIC' ? t('public_uni') : t('private_uni')}
                  </p>
                </div>
                {uniAccreditation && (
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1'>
                      {t('accreditation')}
                    </p>
                    <p className='font-bold text-foreground flex items-center gap-1'>
                      <CheckCircle2 size={13} className='text-primary shrink-0' />{' '}
                      <span className='leading-tight'>{uniAccreditation}</span>
                    </p>
                  </div>
                )}
              </div>
            </SectionAnchor>

            {/* Selected Major Section */}
            {mp && (
              <SectionAnchor id='major'>
                <div className='flex items-center justify-between mb-5'>
                  <SectionTitle>
                    <GraduationCap size={18} className='text-primary' /> {t('sections.major')}
                  </SectionTitle>
                  <button
                    onClick={() => router.push('/quiz/results')}
                    className='text-xs font-semibold text-primary hover:underline cursor-pointer'
                  >
                    {t('change_major')}
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
                        {isKhmer && mp.majorNameKh ? mp.majorNameKh : mp.majorNameEn}
                      </h3>
                      {(isKhmer && mp.departmentKh ? mp.departmentKh : mp.department) && (
                        <p className='text-sm text-gray-400 dark:text-muted-foreground mt-1'>
                          {isKhmer && mp.departmentKh ? mp.departmentKh : mp.department}
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
                          {t('duration')}
                        </p>
                        <p className='font-bold text-white text-sm'>
                          {t('duration_years', { years: mp.durationYears })}
                        </p>
                      </div>
                    )}
                    {mp.credits && (
                      <div className='bg-white/5 rounded-xl p-3'>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                          {t('credits')}
                        </p>
                        <p className='font-bold text-white text-sm'>
                          {t('credits_value', { count: mp.credits })}
                        </p>
                      </div>
                    )}
                    {mp.language && (
                      <div className='bg-white/5 rounded-xl p-3'>
                        <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                          {t('language')}
                        </p>
                        <p className='font-bold text-white text-sm'>
                          {isKhmer && mp.languageKh ? mp.languageKh : mp.language}
                        </p>
                      </div>
                    )}
                    <div className='bg-white/5 rounded-xl p-3'>
                      <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1'>
                        {t('internship')}
                      </p>
                      <p className='font-bold text-white text-sm'>
                        {mp.internshipRequired ? t('internship_required') : t('internship_optional')}
                      </p>
                    </div>
                  </div>

                  {mp.careerProspects && mp.careerProspects.length > 0 && (
                    <div>
                      <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2'>
                        {t('career_prospects')}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {(isKhmer && mp.careerProspectsKh && mp.careerProspectsKh.length > 0 ? mp.careerProspectsKh : mp.careerProspects).map(p => (
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

{/* Admission Requirements */}
{uni.admissionRequirements && uni.admissionRequirements.length > 0 && (
  <SectionAnchor id='admission'>
    <SectionTitle>
      <ClipboardList size={18} className='text-primary' /> {t('sections.admission')}
    </SectionTitle>
    <div className='space-y-3'>
      {uni.admissionRequirements.map((a) => {
        // 1. All logic must be inside the map function body before the return
        const Icon = getAdmissionIcon(a.iconKey);
        const title = isKhmer && a.titleKh?.trim() !== "" ? a.titleKh : a.titleEn;
        const description = isKhmer && a.descriptionKh?.trim() !== "" ? a.descriptionKh : a.descriptionEn;
        
        const rawLabelEn = a.linkLabelEn?.trim() || '';
        const rawLabelKh = (a.linkLabelKh || (a as any).linkLabelKM || (a as any).link_label_kh || '').trim();
        
        let label = isKhmer && rawLabelKh !== "" ? rawLabelKh : a.linkLabelEn;

        if (isKhmer && rawLabelKh === "" && rawLabelEn) {
          const lowerEn = rawLabelEn.toLowerCase().trim();
          if (lowerEn.includes('apply')) label = 'ដាក់ពាក្យឥឡូវនេះ';
          else if (lowerEn.includes('admission')) label = 'ព័ត៌មានចុះឈ្មោះចូលរៀន';
          else if (lowerEn.includes('detail') || lowerEn.includes('more') || lowerEn.includes('info')) label = 'មើលលម្អិត';
          else if (lowerEn.includes('register')) label = 'ចុះឈ្មោះនៅទីនេះ';
          else if (lowerEn.includes('portal') || lowerEn.includes('website') || lowerEn.includes('link')) label = 'ចូលទៅកាន់គេហទំព័រ';
          else label = ADMISSION_LABELS_KM[lowerEn] || t('view_details');
        }

        // 2. Return the JSX
        return (
          <div key={a.id} className='flex gap-4 p-4 bg-card border border-border rounded-2xl'>
            <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
              <Icon size={16} className='text-primary' />
            </div>
            <div className='min-w-0'>
              <p className='font-bold text-sm text-foreground'>{title}</p>
              {description && (
                <p className='text-xs text-muted-foreground mt-1 leading-relaxed'>{description}</p>
              )}
              {a.linkUrl && label && (
                <a
                  href={a.linkUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs font-semibold text-primary hover:underline mt-1.5 inline-flex items-center gap-1'
                >
                  {label} <ChevronRight size={11} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </SectionAnchor>
)}
                    


            {/* Tuition & Fees */}
            {uni.tuitionFees && uni.tuitionFees.length > 0 && (
              <SectionAnchor id='tuition'>
                <SectionTitle>
                  <DollarSign size={18} className='text-primary' /> {t('sections.tuition')}
                </SectionTitle>
                <div className='bg-card border border-border rounded-2xl overflow-hidden'>
                  <table className='w-full text-sm text-left'>
                    <thead>
                      <tr className='border-b border-border bg-muted/40'>
                        <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          {t('th_program_type')}
                        </th>
                        <th className='text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          {t('th_per_semester')}
                        </th>
                        <th className='text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          {t('th_per_year')}
                        </th>
                        <th className='text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:table-cell'>
                          {t('th_notes')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uni.tuitionFees.map((tItem, i) => {
                        const progType = isKhmer && tItem.programTypeKh && tItem.programTypeKh.trim() !== "" ? tItem.programTypeKh : tItem.programTypeEn
                        const notes = isKhmer && tItem.notesKh && tItem.notesKh.trim() !== "" ? tItem.notesKh : tItem.notesEn

                        return (
                          <tr
                            key={tItem.id}
                            className={i < uni.tuitionFees.length - 1 ? 'border-b border-border' : ''}
                          >
                            <td className='px-4 py-3.5 font-semibold text-foreground'>
                              {progType}
                            </td>
                            <td className='px-4 py-3.5 text-right text-muted-foreground'>
                              {tItem.feePerSemester ? `$${tItem.feePerSemester.toLocaleString()}` : '—'}
                            </td>
                            <td className='px-4 py-3.5 text-right font-bold text-foreground'>
                              {tItem.feePerYear ? `$${tItem.feePerYear.toLocaleString()}` : '—'}
                            </td>
                            <td className='px-4 py-3.5 text-right text-xs text-muted-foreground hidden sm:table-cell'>
                              {notes ?? '—'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div className='px-4 py-3 bg-muted/20 border-t border-border flex items-start gap-2'>
                    <Info size={13} className='text-muted-foreground shrink-0 mt-0.5' />
                    <p className='text-[11px] text-muted-foreground leading-relaxed'>
                      {t('tuition_notice')}
                    </p>
                  </div>
                </div>
              </SectionAnchor>
            )}

            {/* Scholarships Section */}
            
            {uni.scholarships && uni.scholarships.length > 0 && (
              <SectionAnchor id='scholarships'>
                <div className='flex items-center justify-between mb-5'>
                  <SectionTitle>
                    <BookOpen size={18} className='text-primary' /> {t('sections.scholarships')}
                  </SectionTitle>
                  <button className='text-xs font-semibold text-primary hover:underline cursor-pointer'>
                    {t('view_all')}
                  </button>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {uni.scholarships.map(s => {
                    const sName = isKhmer && s.nameKh && s.nameKh.trim() !== "" ? s.nameKh : s.nameEn
                    const sDesc = isKhmer && s.descriptionKh && s.descriptionKh.trim() !== "" ? s.descriptionKh : s.descriptionEn
                    
                    // Unified coverage calculation with lookup for updated coverageLabelKh schema fields
                    const sCoverage = translateCoverageLabel(
                      s.coverageLabel, 
                      (s.coverageLabelKh || (s as any).coverageLabelKM || '').trim(), 
                      isKhmer
                    )

                    return (
                      <div
                        key={s.id}
                        className='bg-card border border-border rounded-2xl p-5 relative'
                      >
                        {sCoverage && (
                         <span
  className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
    // Check for both western "100" and khmer "១០០"
    sCoverage.includes('100') || sCoverage.includes('១០០') || sCoverage.toLowerCase().includes('full')
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  }`}
>
  {sCoverage}
</span>
                        )}
                        <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3'>
                          <GraduationCap size={15} className='text-primary' />
                        </div>
                        <h4 className='font-bold text-sm text-foreground mb-1 pr-20'>
                          {sName}
                        </h4>
                        {sDesc && (
                          <p className='text-xs text-muted-foreground leading-relaxed mb-2'>
                            {sDesc}
                          </p>
                        )}
                        {s.deadline && (
                          <p className='text-[10px] text-muted-foreground flex items-center gap-1 mt-2'>
                            <Calendar size={11} />
                            {t('deadline', {
                              date: formatDate(s.deadline, isKhmer)
                            })}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </SectionAnchor>
            )}

            {/* Campus Facilities Section */}
            {(uni.facilities.length > 0 || uni.facilityPhotos.length > 0) && (
              <SectionAnchor id='facilities'>
                <SectionTitle>
                  <Building2 size={18} className='text-primary' /> {t('sections.facilities')}
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
                            {isKhmer && f.nameKh && f.nameKh.trim() !== "" ? f.nameKh : f.nameEn}
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
                          alt={(isKhmer && p.altTextKh ? p.altTextKh : p.altTextEn) ?? ''}
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