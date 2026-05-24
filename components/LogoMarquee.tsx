'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

type Uni = { name: string; domain: string }

const ROW_1: Uni[] = [
  { name: 'UC Berkeley', domain: 'berkeley.edu' },
  { name: 'MIT', domain: 'mit.edu' },
  { name: 'Yale', domain: 'yale.edu' },
  { name: 'Stanford', domain: 'stanford.edu' },
  { name: 'Oxford', domain: 'ox.ac.uk' },
  { name: 'Cambridge', domain: 'cam.ac.uk' },
  { name: 'Harvard', domain: 'harvard.edu' },
  { name: 'University of Toronto', domain: 'utoronto.ca' },
  { name: 'McGill', domain: 'mcgill.ca' },
  { name: 'University of Ghana', domain: 'ug.edu.gh' },
  { name: 'KNUST', domain: 'knust.edu.gh' },
  { name: 'Ashesi', domain: 'ashesi.edu.gh' },
]

const ROW_2: Uni[] = [
  { name: 'NYU', domain: 'nyu.edu' },
  { name: 'Imperial College', domain: 'imperial.ac.uk' },
  { name: 'LSE', domain: 'lse.ac.uk' },
  { name: 'UT Austin', domain: 'utexas.edu' },
  { name: 'University of Maryland', domain: 'umd.edu' },
  { name: 'University of Delaware', domain: 'udel.edu' },
  { name: 'UCLA', domain: 'ucla.edu' },
  { name: 'Manchester', domain: 'manchester.ac.uk' },
  { name: 'TU Berlin', domain: 'tu-berlin.de' },
  { name: 'ETH Zürich', domain: 'ethz.ch' },
  { name: 'Cape Coast', domain: 'ucc.edu.gh' },
  { name: 'University of Tokyo', domain: 'u-tokyo.ac.jp' },
]

export default function LogoMarquee() {
  return (
    <section className="relative w-full bg-surface py-20 md:py-28 overflow-hidden">
      <Container size="wide" className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-md">
            <SectionLabel number="02">Where students get in</SectionLabel>
            <h2 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
              Trusted by students <span className="italic text-amber-dark">aiming higher.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-ink-500 max-w-sm">
            Aggregates and conversions calibrated for 200+ programs across Ghana,
            North America, the UK, and Europe.
          </p>
        </div>
      </Container>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-surface to-transparent z-10" />

        <MarqueeRow items={ROW_1} reverse={false} />
        <MarqueeRow items={ROW_2} reverse={true} className="mt-5" />
      </div>
    </section>
  )
}

function MarqueeRow({
  items,
  reverse,
  className = '',
}: {
  items: Uni[]
  reverse: boolean
  className?: string
}) {
  const doubled = [...items, ...items]
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex gap-3 md:gap-4 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {doubled.map((u, i) => (
          <LogoChip key={`${u.domain}-${i}`} uni={u} />
        ))}
      </div>
    </div>
  )
}

function LogoChip({ uni }: { uni: Uni }) {
  // 0 = google favicons, 1 = duckduckgo, 2 = text fallback
  const [stage, setStage] = useState(0)

  const src =
    stage === 0
      ? `https://www.google.com/s2/favicons?domain=${uni.domain}&sz=128`
      : stage === 1
      ? `https://icons.duckduckgo.com/ip3/${uni.domain}.ico`
      : null

  return (
    <div className="group flex h-16 md:h-20 items-center gap-3 md:gap-4 px-6 md:px-10 min-w-fit whitespace-nowrap">
      <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`${uni.name} logo`}
            width={40}
            height={40}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain transition-all duration-300 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
            onError={() => setStage((s) => s + 1)}
          />
        ) : (
          <span className="font-display text-sm text-ink-900 leading-none">
            {initialsOf(uni.name)}
          </span>
        )}
      </div>
      <span className="font-display text-base md:text-lg text-ink-900 tracking-tight">
        {uni.name}
      </span>
    </div>
  )
}

function initialsOf(name: string) {
  const stop = new Set(['of', 'the', 'and', '&'])
  const words = name
    .split(/[\s-]+/)
    .filter((w) => !stop.has(w.toLowerCase()))
    .filter(Boolean)
  return (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')
}
