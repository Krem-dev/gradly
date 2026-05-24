'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const QUESTIONS = [
  {
    q: 'How is my WASSCE aggregate calculated?',
    a: "We use the official WAEC method: your best 6 subjects (3 core — English, Maths, Science/Social — plus 3 electives), summed by grade points (A1=1, B2=2, …, F9=9). The lower the aggregate, the better. We support WAEC May/June, NovDec, NECO, and IEB.",
  },
  {
    q: 'Which grading systems do you convert between?',
    a: "Ghana CWA & CGPA, USA 4.0 GPA, UK class (1st/2:1/2:2/3rd), ECTS (European), German 1-5, French 0-20, Indian 7- and 10-point, Canadian percentage, and Chinese percentage. Each follows the WES-style course-by-course method with credit-hour weighting.",
  },
  {
    q: 'Is Gradly free?',
    a: "Yes. WASSCE calculation, all grade conversions, and basic recommendations are free forever. We offer an optional Pro plan for transcript PDF parsing, AI essay review, and direct counselor chat — but you never need it to get accurate numbers.",
  },
  {
    q: 'How accurate are the university recommendations?',
    a: "We rank programs by your realistic chance of admission using historical cutoff data, current admission statistics, and your converted scores. Each school is tagged Reach / Match / Safety with the confidence score visible — so you decide, not us.",
  },
  {
    q: 'Can I upload a PDF transcript instead of typing?',
    a: "Yes. Drop a PDF or photo and we parse course names, credit hours, and letter grades automatically. Everything is editable before conversion. Documents are encrypted at rest and deleted on request — we never share with third parties.",
  },
  {
    q: 'Do you support countries outside Ghana?',
    a: "Yes. We work with grading systems from 40+ countries — anyone applying internationally can convert their transcript and get recommendations. Our origin is Ghana, but the math is global.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative w-full bg-surface py-24 md:py-32">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Heading */}
          <div className="lg:col-span-5">
            <SectionLabel number="06">Frequently asked</SectionLabel>
            <h2 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
              Questions we get <span className="italic text-amber-dark">a lot.</span>
            </h2>
            <p className="mt-6 max-w-sm text-base text-ink-500 leading-relaxed">
              Don&apos;t see your question? Drop us a line — we usually reply within the same day.
            </p>
          </div>

          {/* Items */}
          <div className="lg:col-span-7">
            <ul className="divide-y divide-ink-100 border-t border-ink-100">
              {QUESTIONS.map((item, i) => {
                const isOpen = open === i
                return (
                  <li key={item.q} className="py-1">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start gap-5 py-5 text-left"
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400 pt-1.5 w-9 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-display text-lg md:text-xl text-ink-900 leading-snug tracking-tight">
                        {item.q}
                      </span>
                      <span
                        className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 transition-all duration-300 ${
                          isOpen
                            ? 'bg-ink-900 text-amber ring-ink-900 rotate-45'
                            : 'bg-white text-ink-700 ring-ink-200 group-hover:ring-ink-400'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-14 pr-12 pb-6 pt-1 text-sm md:text-base text-ink-500 leading-relaxed max-w-2xl">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
