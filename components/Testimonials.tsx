'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

type Testimonial = {
  quote: string
  name: string
  school: string
  program: string
  image: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had no idea how to convert my CWA for grad school in the US. Gradly did it course-by-course in seconds — and ranked the schools where my GPA was actually competitive.",
    name: 'Kwabena Asare',
    school: 'University of Ghana → Columbia',
    program: 'MSc Computer Science',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80&auto=format&fit=crop',
  },
  {
    quote:
      "My WASSCE aggregate was a 12 and I thought I was out of options. Gradly showed me 18 universities that actually wanted my profile. I'm at Ashesi on a full scholarship.",
    name: 'Ama Owusu',
    school: 'Wesley Girls → Ashesi',
    program: 'BSc Business Administration',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop',
  },
  {
    quote:
      "The transcript upload is magic. PDF in, every course parsed, ECTS-mapped, ready to send to TU Berlin. Saved me a week of manual work.",
    name: 'Yaw Mensah',
    school: 'KNUST → TU Berlin',
    program: 'MSc Mechanical Engineering',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop',
  },
  {
    quote:
      "I came in obsessed with one school. Gradly's recommendations opened my eyes to programs I'd never heard of — and I ended up choosing one of them. Best decision.",
    name: 'Akosua Boateng',
    school: 'Achimota → University of Toronto',
    program: 'BSc Computer Science',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop',
  },
]

export default function Testimonials() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  const next = useCallback(
    () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
    []
  )
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length),
    []
  )

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(next, 7000)
    return () => window.clearInterval(id)
  }, [next, reduce])

  const t = TESTIMONIALS[index]

  return (
    <section id="testimonials" className="relative w-full bg-ink-900 text-white py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <Container size="wide" className="relative">
        <div className="max-w-2xl mb-12 md:mb-16">
          <SectionLabel number="05" tone="light">Student stories</SectionLabel>
          <h2 className="font-display mt-4 text-display-md md:text-display-lg text-white [text-wrap:balance]">
            We&apos;ve done this <span className="italic text-amber">before.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm md:text-base text-ink-300 leading-relaxed">
            Real students. Real conversions. Real admits. Yours is simply the next one we&apos;re ready to help with.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[420px]">
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="relative w-full max-w-sm mx-auto lg:mx-0">
                <div className="absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl bg-amber/90" aria-hidden />
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 ring-white/10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={t.image}
                      initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="(max-width: 1024px) 80vw, 360px"
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 order-1 lg:order-2">
              <Quote className="h-10 w-10 text-amber mb-6 -ml-1" />
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={t.quote}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight text-white [text-wrap:balance]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-8">
                    <div className="font-display text-lg text-white">{t.name}</div>
                    <div className="mt-1 text-sm text-amber">{t.school}</div>
                    <div className="mt-0.5 text-sm text-ink-300">{t.program}</div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-amber' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-white hover:bg-amber hover:text-ink-900 hover:ring-amber transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-white hover:bg-amber hover:text-ink-900 hover:ring-amber transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
