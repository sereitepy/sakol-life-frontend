import {
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
} from 'lucide-react'

export const MAJOR_ICONS: Record<
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

export function getMajorIcon(code: string) {
  return MAJOR_ICONS[code] ?? MAJOR_ICONS.DEFAULT
}
