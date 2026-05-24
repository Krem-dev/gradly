'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

const SOURCES = [
  'Social media',
  'Search engine',
  'Friend or family',
  'School or university',
  'Advertisement',
  'Other',
]

const PURPOSES = [
  'Calculate WASSCE aggregate',
  'Convert university grades',
  'Find university programs',
  'Graduate school applications',
  'Career planning',
  'Just exploring',
]

export default function OnboardingPage() {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [source, setSource] = useState<string>('')
  const [purpose, setPurpose] = useState<string>('')

  const canContinue = Boolean(source && purpose)

  const handleContinue = () => {
    try {
      localStorage.setItem('onboarding_source', source)
      localStorage.setItem('onboarding_purpose', purpose)
    } catch {}
    router.push('/start')
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Top bar with progress */}
      <header className="w-full px-6 py-6 lg:px-10 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white font-display text-xl leading-none">G</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-900">Gradly</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            <span className="h-1 w-10 rounded-full bg-amber" />
            <span className="h-1 w-10 rounded-full bg-ink-100" />
            <span className="ml-2">Step 1 of 2</span>
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-start lg:items-center justify-center py-8 lg:py-16">
        <Container size="default">
          <div className="max-w-2xl">
            <SectionLabel>Welcome to Gradly</SectionLabel>
            <h1 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
              Tell us a bit about <span className="italic text-amber-dark">you.</span>
            </h1>
            <p className="mt-5 text-base text-ink-500 max-w-md leading-relaxed">
              Two quick questions so we can tailor the experience. Takes 10 seconds.
            </p>
          </div>

          <div className="mt-12 md:mt-16 space-y-12">
            <Question
              number="01"
              prompt="How did you hear about Gradly?"
              options={SOURCES}
              value={source}
              onChange={setSource}
              reduce={reduce}
            />
            <Question
              number="02"
              prompt="What are you here to do?"
              options={PURPOSES}
              value={purpose}
              onChange={setPurpose}
              reduce={reduce}
            />
          </div>

          <div className="mt-14 flex items-center justify-between gap-4">
            <button
              onClick={() => router.push('/start')}
              className="text-sm text-ink-500 hover:text-ink-900 transition-colors"
            >
              Skip for now
            </button>
            <div className="flex items-center gap-3">
              {!canContinue && (
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-ink-400">
                  Pick one in each
                </span>
              )}
              <Button
                variant="pill"
                size="lg"
                onClick={handleContinue}
                className={!canContinue ? 'opacity-40 pointer-events-none' : ''}
              >
                Continue
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

function Question({
  number,
  prompt,
  options,
  value,
  onChange,
  reduce,
}: {
  number: string
  prompt: string
  options: string[]
  value: string
  onChange: (v: string) => void
  reduce: boolean | null
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-dark">{number}/</span>
        <span className="h-px flex-1 max-w-12 bg-ink-100" />
        <h2 className="font-display text-xl md:text-2xl text-ink-900 tracking-tight">
          {prompt}
        </h2>
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.04 } },
        }}
        className="flex flex-wrap gap-2.5"
      >
        {options.map((o) => {
          const active = o === value
          return (
            <motion.button
              key={o}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              onClick={() => onChange(o)}
              type="button"
              className={`group inline-flex items-center gap-2 rounded-full px-4 h-10 text-sm transition-all ring-1
                ${active
                  ? 'bg-ink-900 text-white ring-ink-900'
                  : 'bg-white text-ink-700 ring-ink-100 hover:ring-ink-400'}`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full transition-all
                  ${active ? 'bg-amber text-ink-900' : 'bg-ink-50 text-ink-300 group-hover:bg-ink-100'}`}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {o}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
