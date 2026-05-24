'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Zap, ArrowUpRight, Shield, FileText, Calculator } from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import BuyCreditsButton from '@/components/BuyCreditsButton'
import { api } from '@/lib/api'

export default function PricingPage() {
  const [pricing, setPricing] = useState<{
    pack: string
    creditsPerPack: number
    priceMajor: number
    currency: string
  } | null>(null)

  useEffect(() => {
    api.payments
      .getPricing()
      .then((r) => {
        if (r.success && r.data) setPricing(r.data)
      })
      .catch(() => {})
  }, [])

  const credits = pricing?.creditsPerPack ?? 3
  const price = pricing?.priceMajor ?? 20
  const currency = pricing?.currency ?? 'GHS'

  return (
    <AppShell>
      <section className="bg-ink-900 text-white relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="pointer-events-none absolute -top-32 left-1/3 h-[420px] w-[640px] rounded-full bg-amber/15 blur-[140px]" />

        <Container size="wide" className="relative py-16 md:py-24">
          <SectionLabel tone="light">Pricing</SectionLabel>
          <h1 className="font-display mt-4 text-display-md md:text-display-lg [text-wrap:balance]">
            Pay only when you <span className="italic text-amber">convert.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base md:text-lg text-ink-300 leading-relaxed">
            WASSCE calculator and Ghana recommendations are free forever. Pay {price} {currency}
            {' '}for a Convert Pack — {credits} university conversions or transcript uploads,
            yours to use whenever.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Free card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[28px] bg-white ring-1 ring-ink-100 p-8 md:p-10 flex flex-col"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500">
                Free forever
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl md:text-6xl text-ink-900">0</span>
                <span className="font-mono text-xs uppercase tracking-wider text-ink-500">{currency} / month</span>
              </div>
              <p className="mt-4 text-base text-ink-500 leading-relaxed">
                The whole SHS aggregate flow stays free. Use it forever, share it with friends.
              </p>

              <ul className="mt-8 space-y-3 text-sm flex-1">
                {[
                  'WASSCE aggregate calculator',
                  'Ghana university recommendations',
                  'Save up to 10 results',
                  'Subject-by-subject breakdown',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-ink-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-50 text-ink-700 ring-1 ring-ink-100">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/start"
                className="mt-10 inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-5 h-12 text-sm text-ink-700 w-fit transition-colors"
              >
                Get started free
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* Convert Pack card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[28px] bg-ink-900 text-white p-8 md:p-10 ring-1 ring-amber/30 shadow-lift overflow-hidden flex flex-col"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber/15 blur-[100px]"
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber">
                  <Zap className="h-3.5 w-3.5" />
                  Convert pack · most popular
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl md:text-6xl text-white">{price}</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-300">{currency} · one-time</span>
                </div>
                <p className="mt-4 text-base text-ink-200 leading-relaxed max-w-sm">
                  {credits} credits. Each credit runs one university conversion (with or without
                  transcript upload). No subscription, no auto-renew.
                </p>

                <ul className="mt-8 space-y-3 text-sm flex-1">
                  {[
                    { icon: Calculator, label: `${credits} university conversion credits` },
                    { icon: FileText, label: 'Transcript PDF auto-parsing' },
                    { icon: Zap, label: 'Global university recommendations' },
                    { icon: Shield, label: 'Credits never expire' },
                  ].map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-ink-100">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/15 text-amber ring-1 ring-amber/20">
                        <f.icon className="h-3 w-3" />
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <BuyCreditsButton label={`Buy Convert Pack — ${price} ${currency}`} />
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  Secure checkout via Paystack · Visa, Mastercard, Mobile Money
                </p>
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {[
              {
                q: 'What counts as one conversion?',
                a: `One credit = one full university conversion run. Whether you type courses in by hand or upload a PDF transcript, it's one credit per result page.`,
              },
              {
                q: 'Do credits expire?',
                a: `No. Buy a pack today, use it next year — credits stay on your account until you use them or delete the account.`,
              },
              {
                q: 'Is this a subscription?',
                a: `No. One-time payment, one pack. Need more? Buy another pack. No auto-renew, no card on file.`,
              },
              {
                q: 'What if a conversion fails?',
                a: `If our system can't complete a conversion, we automatically refund the credit back to your balance.`,
              },
            ].map((item) => (
              <div key={item.q}>
                <div className="font-display text-lg text-ink-900">{item.q}</div>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </AppShell>
  )
}
