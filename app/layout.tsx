import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/context/ToastContext'
import { ToastContainer } from '@/components/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gradly - Academic Score Conversion & Guidance',
  description: 'Convert CWA to CGPA and receive university recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen pt-16`}>
        <ToastProvider>
          <div className="flex-1">{children}</div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
