import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Settings } from 'lucide-react'
import { signOutAction } from '@/lib/auth/signout'

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
          <form action={signOutAction}>
            <Button
              type='submit'
              variant='ghost'
              className='rounded-md text-md font-semibold h-9'
            >
              Sign Out
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  )
}
