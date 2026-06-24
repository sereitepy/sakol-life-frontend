'use client'

import { University } from '@/lib/profile/action'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

// Translation map for Cambodian provinces and cities
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
  'Tboung Khmum': 'ត្បូងឃ្មុំ',
  'Banteay Meanchey': 'បន្ទាយមានជ័យ'
}

// Frontend fallback translation map for University Names
const UNIVERSITY_NAMES_KM: Record<string, string> = {
  'Royal University of Phnom Penh': 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
  'Institute of Technology of Cambodia': 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា',
  'Norton University': 'សាកលវិទ្យាល័យ ន័រតុន',
  'Cambodia Academy of Digital Technology': 'បណ្ឌិត្យសភានិនវានុវត្តន៍ឌីជីថមកម្ពុជា',
  'Paññāsāstra University of Cambodia': 'សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា',
  'Paragon International University': 'សាកលវិទ្យាល័យអន្តរជាតិ ផារ៉ាហ្គន',
  'Kirirom Institute of Technology': 'វិទ្យាស្ថានបច្ចេកវិទ្យាគិរីរម្យ'
}

export default function UniversityCard({
  uni,
  onClick,
}: {
  uni: University
  onClick: () => void
}) {
  const t = useTranslations('university_card')
  const locale = useLocale()
  const [logoError, setLogoError] = useState(false)

  const isKhmer = locale === 'km'
  
  // 1. Resolve English Name
  const nameEn = uni.nameEn || ''
  
  // 2. Resolve Khmer Name: Check database property first -> then local map -> fallback to English
  let nameKm = (uni as any).nameKm || (uni as any).nameKM
  if (!nameKm && nameEn) {
    const trimmedEnName = nameEn.trim()
    nameKm = UNIVERSITY_NAMES_KM[trimmedEnName] || nameEn
  }

  // 3. Set structural placement order based on active UI locale
  const primaryName = isKhmer ? nameKm : nameEn
  const secondaryName = isKhmer ? nameEn : (nameKm !== nameEn ? nameKm : null)
  
  // 4. Resolve Location City
  let location = isKhmer && (uni as any).locationCityKm ? (uni as any).locationCityKm : uni.locationCity
  if (isKhmer && location) {
    const trimmedLocation = location.trim()
    if (CAMBODIA_PROVINCES_KM[trimmedLocation]) {
      location = CAMBODIA_PROVINCES_KM[trimmedLocation]
    }
  }

  const hasValidLogoString = uni.logoUrl && (uni.logoUrl.startsWith('/') || uni.logoUrl.startsWith('http'))
  const logoSrc = (!logoError && hasValidLogoString) ? uni.logoUrl! : '/images/RUPP_logo.png'

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between text-left h-full"
    >
      <div>
        {/* Banner */}
        <div className="relative h-32 bg-muted overflow-hidden">
          {uni.bannerUrl && (uni.bannerUrl.startsWith('/') || uni.bannerUrl.startsWith('http')) ? (
            <Image
              src={uni.bannerUrl}
              alt={primaryName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-w-768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-muted">
              🏛️
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
              uni.type === 'PUBLIC'
                ? 'bg-primary/90 text-white'
                : 'bg-white/90 text-black'
            }`}
          >
            {t(`types.${uni.type}`)}
          </span>
        </div>

        {/* Content Details Block */}
        <div className="p-4 pb-2">
          <div className="flex items-start gap-3">
            {/* Logo Container */}
            <div className="w-10 h-10 shrink-0 rounded-xl border border-border/40 overflow-hidden relative flex items-center justify-center p-0.5 mt-0.5">
              <Image
                src={logoSrc}
                alt={primaryName}
                fill
                className="object-contain rounded-xl"
                sizes="40px"
                onError={() => setLogoError(true)}
              />
            </div>
            
            {/* Typography Vertical Stack */}
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              {/* Primary University Name */}
              <h3 className="font-bold text-sm text-foreground leading-snug text-wrap">
                {primaryName}
              </h3>

              {/* Secondary University Name Subtitle */}
              {secondaryName && (
                <span className="text-[11px] font-medium text-muted-foreground leading-tight tracking-normal text-wrap">
                  {secondaryName}
                </span>
              )}
              
              {/* Location Line */}
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium mt-0.5">
                <span className="shrink-0">📍</span> 
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing / Footer Block */}
      <div className="p-4 pt-0 mt-auto flex flex-col gap-2">
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {uni.durationYears 
              ? t('duration_years', { years: uni.durationYears }) 
              : '—'}
          </span>
          <span className="text-sm font-bold text-foreground">
            {uni.tuitionFeeUsd
              ? t('tuition_fee', { fee: uni.tuitionFeeUsd.toLocaleString() })
              : t('fee_varies')}
          </span>
        </div>
      </div>
    </div>
  )
}