'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import SectionLabel from '@/components/ui/SectionLabel'

export default function Hero() {
  const reduce = useReducedMotion()

  const ease = [0.22, 1, 0.36, 1] as const
  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease },
        }

  return (
    <section className="relative w-full overflow-hidden bg-surface pt-32 md:pt-36 pb-24 md:pb-32">
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-amber/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-indigo/20 blur-[120px]" />
      </div>

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT: headline */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div {...fadeUp(0.15)}>
              <SectionLabel number="01">Academic guidance platform</SectionLabel>
            </motion.div>

            <motion.h1
              {...fadeUp(0.23)}
              className="font-display mt-6 text-display-xl lg:text-display-2xl font-medium text-ink-900 [text-wrap:balance]"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              From{' '}
              <span className="italic text-ink-800">WASSCE</span>
              <br />
              to{' '}
              <span className="text-amber-dark italic whitespace-nowrap">
                world{'‑'}class.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.31)}
              className="mt-7 max-w-md text-base md:text-lg leading-relaxed text-ink-500"
            >
              Calculate your WASSCE aggregate, convert university grades to any global
              system, and discover the universities where you&apos;ll thrive.
            </motion.p>

            <motion.div {...fadeUp(0.39)} className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button href="/start" variant="pill" size="lg">
                Start free
              </Button>
              <Button href="/#how" variant="secondary" size="lg" withArrow={false}>
                See how it works
              </Button>
            </motion.div>

            <motion.div {...fadeUp(0.47)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-ink-400 font-mono">
              <span>40+ Countries</span>
              <span className="h-1 w-1 rounded-full bg-ink-200" />
              <span>WASSCE · CWA · CGPA · GPA</span>
              <span className="h-1 w-1 rounded-full bg-ink-200" />
              <span>Free forever</span>
            </motion.div>
          </div>

          {/* CENTER: photo */}
          <motion.div
            {...fadeUp(0.05)}
            className="lg:col-span-4 order-1 lg:order-2"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden rounded-[28px] ring-1 ring-ink-100 shadow-lift">
              <Image
                src="/hero.jpg"
                alt="A student smiling with her books"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover object-[30%_center]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease }}
                className="absolute left-4 right-4 bottom-4 rounded-2xl bg-white/95 backdrop-blur-sm p-4 ring-1 ring-ink-100 shadow-soft"
              >
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.16em] text-ink-400">
                  <span>Conversion</span>
                  <span>Live</span>
                </div>
                <div className="mt-2 flex items-center gap-3 font-display text-2xl">
                  <span className="text-ink-900">A1 · B2 · B3</span>
                  <ArrowRight className="h-4 w-4 text-amber-dark" />
                  <span className="text-amber-dark">3.91</span>
                  <span className="font-sans text-xs text-ink-500 ml-1">GPA</span>
                </div>
                <div className="mt-2 text-xs text-ink-500">
                  WASSCE · Aggregate 9 · USA 4.0 scale
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: secondary copy / value props */}
          <motion.div
            {...fadeUp(0.5)}
            className="lg:col-span-3 order-3 lg:order-3 space-y-6"
          >
            <ValueProp
              kicker="For SHS students"
              title="Calculate your aggregate"
              body="Pick your subjects, enter your grades. We do the math by board and year."
            />
            <ValueProp
              kicker="For university students"
              title="Convert your CWA / CGPA"
              body="Translate your transcript to USA GPA, UK class, ECTS, and 7 more systems."
            />
            <ValueProp
              kicker="Recommendations"
              title="Find your right-fit schools"
              body="See universities ranked by realistic chance of admission with your scores."
            />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

function ValueProp({
  kicker,
  title,
  body,
}: {
  kicker: string
  title: string
  body: string
}) {
  return (
    <div className="group relative border-l-2 border-ink-100 pl-5 hover:border-amber transition-colors">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">
        {kicker}
      </div>
      <div className="mt-1.5 font-display text-lg text-ink-900">{title}</div>
      <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{body}</p>
    </div>
  )
}
