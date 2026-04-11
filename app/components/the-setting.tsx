import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Settings } from 'lucide-react'
import SignOutButton from './signout-button'

export default function TheSetting() {
  return (
    <div className='hidden md:flex'>
      <Popover>
        <PopoverTrigger asChild>
          <Settings
            size={23}
            className='text-primary cursor-pointer hover:text-accent-foreground'
          />
        </PopoverTrigger>
        <PopoverContent className='w-fit p-3 rounded-md'>
          <ThemeTogglerButton />
          <SignOutButton className='rounded-md text-md font-semibold h-9' />
        </PopoverContent>
      </Popover>
    </div>
  )
}
