import type { Metadata } from 'next'
import { Lexend, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Header from './components/header'

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
    <html lang='en' className={cn(lexend.variable, jetbrainsMono.variable)}>
      <body className='font-sans antialiased flex flex-col justify-between min-h-screen'>
        <Header />
        <div className='grow'>{children}</div>
        <p>footer</p>
      </body>
    </html>
  )
}
