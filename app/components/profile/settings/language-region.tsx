import { Globe2 } from 'lucide-react'
import { SettingsSection } from './settings-section'

type Props = {
  preferredLanguage: 'EN' | 'KH'
}

export function LanguageRegion({ preferredLanguage }: Props) {
  return (
    <SettingsSection title='Language & Region' icon={Globe2}>
      <div className='flex items-center justify-between py-3 border-b border-border'>
        <div>
          <p className='font-semibold text-sm text-foreground'>
            Interface Language
          </p>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Currently: {preferredLanguage === 'EN' ? 'English' : 'Khmer'}
          </p>
        </div>
        <span className='text-2xl'>
          {preferredLanguage === 'EN' ? '🇬🇧' : '🇰🇭'}
        </span>
      </div>
      <div className='flex items-center justify-between py-3'>
        <div>
          <p className='font-semibold text-sm text-foreground'>Region</p>
          <p className='text-xs text-muted-foreground mt-0.5'>Cambodia</p>
        </div>
        <span className='text-2xl'>🇰🇭</span>
      </div>
    </SettingsSection>
  )
}
