'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { useStore } from '@/stores/globalStore'
import { getTimeValue } from '@/utils/functions'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { timer } = useStore()

  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>{`${getTimeValue(timer, 'minutes')}:${getTimeValue(timer, 'seconds')}  - Work Mood`}</title>
        <meta name="description" content="Customize your work schedule and ambience, with your own music and timers." />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

