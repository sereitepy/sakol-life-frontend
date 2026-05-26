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

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'km')) {
    notFound()
  }

  // Fetch messages server-side and pass to client provider
  const messages = await getMessages()
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
            <TooltipProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </TooltipProvider>
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
