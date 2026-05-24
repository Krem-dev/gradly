'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

type Service = {
  number: string
  eyebrow: string
  title: string
  description: string
  tags: string[]
  image: string
  imageAlt: string
  href: string
}

const SERVICES: Service[] = [
  {
    number: '01',
    eyebrow: 'For SHS students',
    title: 'WASSCE aggregate',
    description:
      'Pick subjects, enter grades. We compute your aggregate by exam board and year — WAEC, NECO, IEB included.',
    tags: ['WAEC', 'NovDec', '9-Aggregate', '28+ subjects', 'By board'],
    image: '/services/wassce.jpg',
    imageAlt: 'A student filling out a WASSCE answer sheet',
    href: '/shs/calculator',
  },
  {
    number: '02',
    eyebrow: 'For university students',
    title: 'University grade conversion',
    description:
      'Translate your CWA or CGPA to any global system. Course-by-course, with credit-hour weighting and class equivalence.',
    tags: ['USA GPA', 'UK Class', 'ECTS', 'German GPA', 'WES style'],
    image:
      'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'Open books and notes on a desk',
    href: '/university/convert',
  },
  {
    number: '03',
    eyebrow: 'Find the right schools',
    title: 'Smart recommendations',
    description:
      'See universities ranked by realistic chance of admission. Reach, match, and safety — sorted by your aid needs and major.',
    tags: ['Right-fit', 'Reach', 'Safety', '40+ countries', 'By major'],
    image:
      'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'A graduation cap on books',
    href: '/recommendations',
  },
  {
    number: '04',
    eyebrow: 'Skip the manual entry',
    title: 'Transcript upload',
    description:
      'Drop a PDF transcript. We parse courses, credits, and grades automatically — fully editable before conversion.',
    tags: ['PDF parsing', 'Auto-courses', 'Credit hours', 'Editable', 'GDPR'],
    image:
      'https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&q=80&auto=format&fit=crop',
    imageAlt: 'A library with stacked books',
    href: '/dashboard',
  },
]

export default function ServiceCards() {
  return (
    <section id="features" className="relative w-full bg-surface-alt py-24 md:py-32">
      <Container size="wide">
        <div className="mb-14 md:mb-20 max-w-3xl">
          <SectionLabel number="03">What we do</SectionLabel>
          <h2 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
            Every step from{' '}
            <span className="italic text-amber-dark">grades to admission</span> — in one
            place.
          </h2>
        </div>

        {/* Sticky-stack cards */}
        <div className="relative">
          {SERVICES.map((s, i) => (
            <div
              key={s.number}
              className="sticky"
              style={{ top: `calc(6rem + ${i * 16}px)` }}
            >
              <ServiceCard service={s} reverse={i % 2 === 1} index={i} />
            </div>
          ))}
          {/* Trailing spacer so the last card can settle */}
          <div className="h-16 md:h-24" />
        </div>
      </Container>
    </section>
  )
}

function ServiceCard({
  service,
  reverse,
  index,
}: {
  service: Service
  reverse: boolean
  index: number
}) {
  return (
    <article
      className="group relative mb-6 md:mb-8 overflow-hidden rounded-[32px] bg-ink-900 text-white ring-1 ring-white/5 shadow-lift"
      style={{ transformOrigin: 'center top' }}
    >
      {/* Soft top-corner glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-1/2 ${
          reverse ? 'right-0' : 'left-0'
        } h-full w-2/3 opacity-60`}
        style={{
          background:
            'radial-gradient(circle at center, rgba(245,158,11,0.12), transparent 60%)',
        }}
      />

      <div
        className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
          reverse ? 'lg:[direction:rtl]' : ''
        }`}
      >
        {/* TEXT SIDE */}
        <div className={`lg:col-span-6 p-8 md:p-12 lg:py-14 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber">
              {service.number}/
            </span>
            <span className="h-px flex-1 max-w-12 bg-white/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-300">
              {service.eyebrow}
            </span>
          </div>

          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-[1.05] [text-wrap:balance]">
            {service.title}
          </h3>

          <p className="mt-5 max-w-md text-base md:text-lg text-ink-200 leading-relaxed">
            {service.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {service.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1 text-xs text-ink-100"
              >
                {t}
              </span>
            ))}
          </div>

          <Link
            href={service.href}
            className="mt-10 inline-flex items-center gap-2 group/cta"
          >
            <span className="font-display text-base text-amber">Open {service.title.toLowerCase()}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-ink-900 transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* IMAGE SIDE */}
        <div className={`lg:col-span-6 ${reverse ? 'lg:[direction:ltr]' : ''}`}>
          <div className="relative h-72 md:h-96 lg:h-[440px] w-full overflow-hidden lg:rounded-[24px] lg:m-3 lg:ml-0">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
              priority={index < 2}
            />
            {/* Tint to harmonize photos with the navy card */}
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900/55 via-ink-900/20 to-amber/10 mix-blend-multiply" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 lg:rounded-[24px]" />
          </div>
        </div>
      </div>
    </article>
  )
}
