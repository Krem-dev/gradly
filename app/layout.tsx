import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/context/ToastContext'
import { ToastContainer } from '@/components/Toast'
import ScrollProgress from '@/components/ui/ScrollProgress'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
})

export const metadata: Metadata = {
  title: {
    default: 'Gradly — From WASSCE to World-Class',
    template: '%s · Gradly',
  },
  description:
    'Calculate WASSCE aggregates, convert university grades to any global system, and discover the universities where you will thrive.',
  applicationName: 'Gradly',
  keywords: [
    'WASSCE',
    'WAEC',
    'aggregate calculator',
    'CWA to CGPA',
    'CGPA conversion',
    'USA GPA',
    'UK class',
    'ECTS',
    'university recommendations',
    'Ghana',
  ],
  authors: [{ name: 'Gradly' }],
  openGraph: {
    title: 'Gradly — From WASSCE to World-Class',
    description:
      'Calculate WASSCE aggregates, convert university grades to any global system, and discover where you will thrive.',
    type: 'website',
    siteName: 'Gradly',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gradly — From WASSCE to World-Class',
    description:
      'Calculate WASSCE aggregates, convert university grades, and discover where you will thrive.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1437' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex flex-col min-h-screen bg-surface text-ink-800 antialiased">
        <ScrollProgress />
        <ToastProvider>
          <div className="flex-1">{children}</div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
