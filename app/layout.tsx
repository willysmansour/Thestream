import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Stream - En person per dag',
  description: 'En exklusiv streamingplattform där endast en person per dag får streama live till hela världen.',
  keywords: 'streaming, live, exklusiv, global, kreatörer',
  authors: [{ name: 'The Stream Team' }],
  openGraph: {
    title: 'The Stream - En person per dag',
    description: 'En exklusiv streamingplattform där endast en person per dag får streama live till hela världen.',
    type: 'website',
    locale: 'sv_SE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
} 