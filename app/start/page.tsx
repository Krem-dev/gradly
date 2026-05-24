'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { BookOpen, GraduationCap, ArrowUpRight, Check } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

type Path = {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
  icon: typeof BookOpen
  features: string[]
  cta: string
  href: string
}

const PATHS: Path[] = [
  {
    id: 'shs',
    number: '01',
    eyebrow: 'For SHS students',
    title: 'I have WASSCE grades',
    description:
      'Pick your subjects, enter your grades. We compute your aggregate by board and year, then surface universities that match.',
    icon: BookOpen,
    features: [
      'WAEC, NECO, IEB supported',
      'May/June + NovDec',
      'Ghana universities by cutoff',
      'Programs by aggregate',
    ],
    cta: 'Calculate aggregate',
    href: '/shs/calculator',
  },
  {
    id: 'university',
    number: '02',
    eyebrow: 'For university students',
    title: 'I have university grades',
    description:
      'Translate your CWA or CGPA to any global system. Course-by-course, with credit hour weighting and class equivalence.',
    icon: GraduationCap,
    features: [
      'USA GPA, UK class, ECTS',
      'WES-style methodology',
      'Global recommendations',
      'Upload your transcript',
    ],
    cta: 'Convert grades',
    href: '/university/convert',
  },
]

export default function StartPage() {
  const router = useRouter()
  const reduce = useReducedMotion()

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <header className="w-full px-6 py-6 lg:px-10 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white font-display text-xl leading-none">G</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-900">Gradly</span>
          </Link>
          <Link href="/login" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">
            Have an account? Sign in →
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center py-10 lg:py-20">
        <Container size="wide">
          <div className="max-w-2xl mb-12 md:mb-16">
            <SectionLabel>Get started</SectionLabel>
            <h1 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
              Where are you in your <span className="italic text-amber-dark">academic journey?</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-ink-500 max-w-md leading-relaxed">
              Pick the path that fits — we&apos;ll tailor every conversion and recommendation from here.
            </p>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6"
          >
            {PATHS.map((p) => (
              <motion.button
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
                onClick={() => router.push(p.href)}
                className="group relative text-left rounded-[28px] bg-ink-900 text-white ring-1 ring-white/5 overflow-hidden p-8 md:p-10 hover:ring-amber/40 transition-all duration-500"
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-1/2 left-0 h-full w-2/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(245,158,11,0.18), transparent 60%)',
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/15 text-amber ring-1 ring-amber/20">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-ink-300">
                      {p.number}/ · {p.eyebrow}
                    </span>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-white transition-all group-hover:bg-amber group-hover:text-ink-900 group-hover:ring-amber">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <h2 className="relative mt-10 font-display text-2xl md:text-3xl text-white tracking-tight leading-[1.1]">
                  {p.title}
                </h2>
                <p className="relative mt-4 text-base text-ink-200 leading-relaxed max-w-sm">
                  {p.description}
                </p>

                <ul className="relative mt-8 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink-100">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/15 text-amber ring-1 ring-amber/20">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-10 inline-flex items-center gap-2">
                  <span className="font-display text-base text-amber">{p.cta}</span>
                  <ArrowUpRight className="h-4 w-4 text-amber" />
                </div>
              </motion.button>
            ))}
          </motion.div>

          <p className="mt-12 text-center text-sm text-ink-500">
            Not sure?{' '}
            <Link href="/" className="text-ink-900 font-medium hover:text-amber-dark transition-colors">
              Learn more about Gradly
            </Link>
          </p>
        </Container>
      </section>
    </main>
  )
}
