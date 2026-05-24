'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Send } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

export default function Footer() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setName('')
    setEmail('')
    setMessage('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <footer className="relative w-full bg-ink-900 text-white pt-24 md:pt-32 pb-10 overflow-hidden">
      {/* Subtle grid pattern for texture, no color tints */}
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
        {/* CTA + Contact form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-white/10">
          <div className="lg:col-span-6">
            <SectionLabel tone="light">Let&apos;s work together</SectionLabel>
            <h2 className="font-display mt-6 text-display-lg lg:text-display-xl font-medium leading-[0.95]">
              Get in <span className="italic text-amber">touch.</span>
            </h2>
            <p className="mt-6 max-w-md text-base text-ink-300 leading-relaxed">
              Questions about scoring, conversions, or partnerships? We usually reply within
              the same day.
            </p>
            <div className="mt-10 space-y-3 text-sm text-ink-200">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400 w-20">Email</span>
                <a href="mailto:hello@gradly.app" className="hover:text-amber transition-colors">hello@gradly.app</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400 w-20">Support</span>
                <span>24/7 in-app chat</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-400 w-20">Based</span>
                <span>Accra · Globally available</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm p-6 md:p-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ama Owusu"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                </Field>
              </div>
              <Field label="Message" className="mt-4">
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What can we help with?"
                />
              </Field>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-ink-400">
                  We&apos;ll never share your details.
                </div>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 rounded-pill bg-amber text-ink-900 h-12 pl-5 pr-2 text-sm font-medium hover:bg-amber-light transition-colors"
                >
                  <span className="px-1">{sent ? 'Message sent' : 'Send message'}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-amber transition-transform group-hover:translate-x-0.5">
                    <Send className="h-3.5 w-3.5" />
                  </span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pt-16">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber text-ink-900 font-display text-xl leading-none">G</span>
              <span className="text-base font-semibold tracking-tight text-white">Gradly</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm text-ink-300 leading-relaxed">
              The academic conversion and guidance platform for students worldwide.
            </p>
          </div>

          <FooterCol title="Product" items={[
            { href: '/shs/calculator', label: 'WASSCE calculator' },
            { href: '/university/convert', label: 'Grade converter' },
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/#features', label: 'Features' },
          ]} />
          <FooterCol title="Company" items={[
            { href: '/about', label: 'About' },
            { href: '/#testimonials', label: 'Stories' },
            { href: '/blog', label: 'Blog' },
            { href: '/contact', label: 'Contact' },
          ]} />
          <FooterCol title="Legal" items={[
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms', label: 'Terms' },
            { href: '/cookies', label: 'Cookies' },
          ]} />
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ink-400 font-mono uppercase tracking-[0.16em]">
          <span>© 2026 Gradly. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            All systems operational
          </span>
        </div>
      </Container>
    </footer>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</span>
      <div
        className="mt-2 [&_input]:w-full [&_textarea]:w-full [&_input]:rounded-xl [&_textarea]:rounded-xl
          [&_input]:bg-white/[0.04] [&_textarea]:bg-white/[0.04]
          [&_input]:ring-1 [&_input]:ring-white/10 [&_textarea]:ring-1 [&_textarea]:ring-white/10
          [&_input]:px-4 [&_textarea]:px-4 [&_input]:py-3 [&_textarea]:py-3
          [&_input]:text-sm [&_textarea]:text-sm
          [&_input]:text-white [&_textarea]:text-white
          [&_input]:placeholder-ink-400 [&_textarea]:placeholder-ink-400
          [&_input]:outline-none [&_textarea]:outline-none
          [&_input:focus]:ring-amber/60 [&_textarea:focus]:ring-amber/60
          [&_textarea]:resize-none"
      >
        {children}
      </div>
    </label>
  )
}

function FooterCol({
  title,
  items,
}: {
  title: string
  items: { href: string; label: string }[]
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="group inline-flex items-center gap-1.5 text-sm text-ink-200 hover:text-amber transition-colors"
            >
              {it.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
