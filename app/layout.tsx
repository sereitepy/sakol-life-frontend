import type { Metadata } from 'next'
import { Lexend, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Header from './components/header'
import { TooltipProvider } from '@/components/ui/tooltip'
import TheSetting from './components/the-setting'
import { Providers } from './components/theme/providers'

const lexend = Lexend({
  variable: '--font-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sakol Life',
  description: 'Navigate your future scholar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={cn(lexend.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className='font-sans antialiased flex flex-col justify-between min-h-screen'>
        <Providers>
          <div className='sticky top-0 shadow-xs shadow-input z-10 bg-background'>
            <div className='max-w-687.5 mx-auto'>
              <Header />
            </div>
          </div>
          <div className='grow'>
            <TooltipProvider>{children}</TooltipProvider>
          </div>
          <div className='fixed bottom-10 right-10 z-50'>
            <TheSetting />
          </div>
          <p>footer</p>
        </Providers>
      </body>
    </html>
  )
}
