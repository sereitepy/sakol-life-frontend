import type { Metadata } from 'next'
import { Lexend, JetBrains_Mono } from 'next/font/google'
import '../globals.css'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from '../components/theme/providers'
import Header from '../components/header'
import TheSetting from '../components/the-setting'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
})

const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Sakol Life',
  description: 'Navigate your future scholar',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  // 1. Validate locale against your i18n routing setup
  if (!routing.locales.includes(locale as 'en' | 'km')) {
    notFound()
  }

  // 2. Fetch messages server-side for the current locale
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={cn(lexend.variable, jetbrains_mono.variable)}
      suppressHydrationWarning
    >
      <body className='font-sans antialiased flex flex-col justify-between min-h-screen'>
        {/* 3. NextIntlClientProvider wraps at a high level so all Client Components get translations */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {/* Sticky Header Navigation */}
            <div className='sticky top-0 shadow-xs shadow-input z-10 bg-background'>
              <div className='max-w-687.5 mx-auto'>
                <Header />
              </div>
            </div>

            {/* Main Application Area */}
            <div className='grow'>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </div>

            {/* Settings Widget */}
            <div className='fixed bottom-10 right-10 z-50'>
              <TheSetting />
            </div>

            <p className='p-4 text-center text-sm text-muted-foreground'>footer</p>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}