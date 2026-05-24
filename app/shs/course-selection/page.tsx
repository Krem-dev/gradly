'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Beaker, Briefcase, BookOpen, Palette, Sprout, Hammer, Wrench, Check, ArrowUpRight } from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

type Stream = {
  id: string
  name: string
  description: string
  icon: typeof Beaker
  subjects: string[]
}

const STREAMS: Stream[] = [
  {
    id: 'science',
    name: 'General Science',
    description: 'Physics, Chemistry, Biology, Elective Maths',
    icon: Beaker,
    subjects: ['Physics', 'Chemistry', 'Biology', 'Elective Maths', 'Elective ICT'],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Accounting, Business Mgmt, Economics, Elective Maths',
    icon: Briefcase,
    subjects: ['Financial Accounting', 'Cost Accounting', 'Business Mgmt', 'Economics', 'Elective Maths'],
  },
  {
    id: 'agricultural-science',
    name: 'Agricultural Science',
    description: 'General Agriculture + sciences (Chem, Bio, Physics)',
    icon: Sprout,
    subjects: ['General Agriculture', 'Chemistry', 'Biology', 'Physics', 'Animal Husbandry'],
  },
  {
    id: 'arts',
    name: 'General Arts',
    description: 'Literature, Geography, Economics, History, Government',
    icon: BookOpen,
    subjects: ['Literature-in-English', 'Geography', 'Economics', 'History', 'Government'],
  },
  {
    id: 'home-economics',
    name: 'Home Economics',
    description: 'Food & Nutrition, Clothing, Biology, Chemistry — and more',
    icon: Hammer,
    subjects: ['Food and Nutrition', 'Management in Living', 'Clothing and Textiles', 'Biology', 'Chemistry'],
  },
  {
    id: 'visual-arts',
    name: 'Visual Arts',
    description: 'Graphic Design, Picture Making, Ceramics, Sculpture, Textiles',
    icon: Palette,
    subjects: ['General Knowledge in Art', 'Graphic Design', 'Picture Making', 'Ceramics', 'Sculpture'],
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Drawing, Building, Electricity, Auto, Electronics — varies by school',
    icon: Wrench,
    subjects: ['Technical Drawing', 'Building Construction', 'Applied Electricity', 'Auto Mechanics', 'Electronics'],
  },
]

export default function CourseSelectionPage() {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState<string | null>(null)

  const handleContinue = () => {
    if (selected) router.push(`/shs/calculator?course=${selected}`)
  }

  return (
    <AppShell step={1} totalSteps={3} stepLabel="Stream">
      <section className="py-10 md:py-16">
        <Container size="wide">
          <div className="max-w-2xl">
            <SectionLabel number="01">SHS Aggregate</SectionLabel>
            <h1 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
              Pick your <span className="italic text-amber-dark">course stream.</span>
            </h1>
            <p className="mt-5 text-base text-ink-500 max-w-md leading-relaxed">
              We&apos;ll show you the right WAEC subjects and weight your aggregate by what your stream actually requires.
            </p>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {STREAMS.map((s) => {
              const isActive = selected === s.id
              const Icon = s.icon
              return (
                <motion.button
                  key={s.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  type="button"
                  onClick={() => setSelected(s.id)}
                  className={`group relative text-left rounded-3xl p-6 md:p-7 ring-1 transition-all duration-300 ${
                    isActive
                      ? 'bg-ink-900 text-white ring-ink-900 shadow-lift'
                      : 'bg-white text-ink-900 ring-ink-100 hover:ring-ink-400 hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                        isActive
                          ? 'bg-amber/15 text-amber ring-1 ring-amber/20'
                          : 'bg-ink-50 text-ink-700 ring-1 ring-ink-100 group-hover:bg-amber/10 group-hover:text-amber-dark'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                        isActive
                          ? 'bg-amber text-ink-900 ring-1 ring-amber'
                          : 'bg-white text-transparent ring-1 ring-ink-100'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className={`mt-6 font-display text-xl ${isActive ? 'text-white' : 'text-ink-900'}`}>
                    {s.name}
                  </h3>
                  <p className={`mt-1.5 text-sm leading-relaxed ${isActive ? 'text-ink-200' : 'text-ink-500'}`}>
                    {s.description}
                  </p>
                  <div className={`mt-5 flex flex-wrap gap-1.5`}>
                    {s.subjects.slice(0, 4).map((sub) => (
                      <span
                        key={sub}
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider ${
                          isActive
                            ? 'bg-white/[0.06] ring-1 ring-white/10 text-ink-100'
                            : 'bg-ink-50 ring-1 ring-ink-100 text-ink-500'
                        }`}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          <div className="mt-12 flex items-center justify-between gap-4">
            <button
              onClick={() => router.push('/start')}
              className="text-sm text-ink-500 hover:text-ink-900 transition-colors"
            >
              ← Back
            </button>
            <Button
              variant="pill"
              size="lg"
              onClick={handleContinue}
              className={!selected ? 'opacity-40 pointer-events-none' : ''}
            >
              Continue to calculator
            </Button>
          </div>
        </Container>
      </section>
    </AppShell>
  )
}
