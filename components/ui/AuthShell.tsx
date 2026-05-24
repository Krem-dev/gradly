'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import SectionLabel from '@/components/ui/SectionLabel'

type Testimonial = {
  quote: string
  name: string
  detail: string
}

const QUOTES: Testimonial[] = [
  {
    quote: '"Gradly turned my CWA into a path to Columbia. The conversion was course-by-course and ready to send."',
    name: 'Kwabena Asare',
    detail: 'University of Ghana → Columbia MSc CS',
  },
  {
    quote: '"My WASSCE aggregate was a 12. Gradly showed me 18 universities that wanted my profile."',
    name: 'Ama Owusu',
    detail: 'Wesley Girls → Ashesi, full scholarship',
  },
]

export default function AuthShell({
  children,
  kicker,
  title,
  subtitle,
  footer,
  quoteIndex = 0,
}: {
  children: React.ReactNode
  kicker?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  footer?: React.ReactNode
  quoteIndex?: number
}) {
  const q = QUOTES[quoteIndex % QUOTES.length]

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-surface">
      {/* LEFT — editorial column */}
      <aside className="relative hidden lg:flex lg:w-[44%] xl:w-[42%] bg-ink-900 text-white overflow-hidden">
        {/* Grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Amber blur accent */}
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-[420px] w-[420px] rounded-full bg-amber/15 blur-[140px]" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
            <span className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-ink-900 font-display text-xl leading-none">
                G
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
            </span>
            <span className="text-base font-semibold tracking-tight text-white">Gradly</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Quote className="h-9 w-9 text-amber mb-5 -ml-1" />
            <blockquote>
              <p className="font-display text-2xl xl:text-3xl leading-[1.2] tracking-tight [text-wrap:balance]">
                {q.quote}
              </p>
              <footer className="mt-8">
                <div className="font-display text-lg">{q.name}</div>
                <div className="mt-1 text-sm text-amber">{q.detail}</div>
              </footer>
            </blockquote>
          </motion.div>

          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">
            <span>© 2026 Gradly</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              All systems operational
            </span>
          </div>
        </div>
      </aside>

      {/* RIGHT — form column */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2.5 mb-10">
            <span className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white font-display text-xl leading-none">G</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-900">Gradly</span>
          </Link>

          {kicker && <SectionLabel>{kicker}</SectionLabel>}

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-display-md text-ink-900 [text-wrap:balance] ${kicker ? 'mt-4' : ''}`}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <p className="mt-3 text-base text-ink-500 leading-relaxed">{subtitle}</p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {children}
          </motion.div>

          {footer && <div className="mt-8">{footer}</div>}
        </div>
      </div>
    </main>
  )
}
