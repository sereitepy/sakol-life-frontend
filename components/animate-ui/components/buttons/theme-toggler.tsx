'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { VariantProps } from 'class-variance-authority'

import {
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
  type ThemeSelection,
  type Resolved,
} from '@/components/animate-ui/primitives/effects/theme-toggler'
import { buttonVariants } from '@/components/animate-ui/components/buttons/icon'
import { cn } from '@/lib/utils'

const getIcon = (resolved: Resolved) =>
  resolved === 'dark' ? <Moon /> : <Sun />

type ThemeTogglerButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange']
    direction?: ThemeTogglerPrimitiveProps['direction']
  }

function ThemeTogglerButton({
  variant = 'default',
  size = 'default',
  direction = 'ltr',
  onImmediateChange,
  onClick,
  className,
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <ThemeTogglerPrimitive
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
      direction={direction}
      onImmediateChange={onImmediateChange}
    >
      {({ resolved, toggleTheme }) => (
        <button
          data-slot='theme-toggler-button'
          className={cn(buttonVariants({ variant, size, className }))}
          onClick={e => {
            onClick?.(e)
            toggleTheme(resolved === 'dark' ? 'light' : 'dark')
          }}
          {...props}
        >
          {getIcon(resolved)}
        </button>
      )}
    </ThemeTogglerPrimitive>
  )
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps }
