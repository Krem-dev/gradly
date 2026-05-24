'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import Button from '@/components/ui/Button'

export default function Navigation() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
    if (userId && userEmail) {
      setIsLoggedIn(true)
      setUserName(userEmail.split('@')[0])
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPlan')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:pt-5">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
          boxShadow: scrolled
            ? '0 8px 30px rgba(15, 23, 42, 0.08)'
            : '0 1px 0 rgba(15, 23, 42, 0.04)',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center justify-between rounded-pill px-4 backdrop-blur-md ring-1 ring-ink-100/80',
          'pl-5 pr-2'
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white font-display text-xl leading-none">
              G
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
          </span>
          <span className="text-base font-semibold tracking-tight text-ink-900">Gradly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-600">
          <Link href="/#how" className="hover:text-ink-900 transition-colors">How it works</Link>
          <Link href="/#features" className="hover:text-ink-900 transition-colors">Features</Link>
          <Link href="/#testimonials" className="hover:text-ink-900 transition-colors">Stories</Link>
          <Link href="/#faq" className="hover:text-ink-900 transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.div
                key="guest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Link
                  href="/login"
                  className="hidden sm:inline-flex h-11 items-center px-4 text-sm text-ink-700 hover:text-ink-900 transition-colors"
                >
                  Sign in
                </Link>
                <Button href="/start" variant="pill" size="md">
                  Start free
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline text-xs text-ink-500">
                  {userName}
                </span>
                <Button href="/dashboard" variant="pill" size="md">
                  Dashboard
                </Button>
                <button
                  onClick={handleLogout}
                  className="ml-1 hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:text-ink-900 hover:bg-ink-50 transition-colors"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </header>
  )
}
