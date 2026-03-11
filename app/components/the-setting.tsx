import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

export default function TheSetting() {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' size='icon' className='rounded-md'>
            <Settings size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit p-3 rounded-md'>
          <ThemeTogglerButton />
        </PopoverContent>
      </Popover>
    </div>
  )
}