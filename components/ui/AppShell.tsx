'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import CreditsBadge from '@/components/ui/CreditsBadge'

export default function AppShell({
  children,
  step,
  stepLabel,
  totalSteps,
  right,
}: {
  children: ReactNode
  step?: number
  totalSteps?: number
  stepLabel?: string
  right?: ReactNode
}) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const userId = localStorage.getItem('userId')
    const userEmail = localStorage.getItem('userEmail')
    if (userId && userEmail) {
      setIsLoggedIn(true)
      setUserName(userEmail.split('@')[0])
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPlan')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <header className="w-full px-5 py-5 lg:px-10 lg:py-7 border-b border-ink-100/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white font-display text-xl leading-none">G</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
            </span>
            <span className="hidden sm:inline text-base font-semibold tracking-tight text-ink-900">Gradly</span>
          </Link>

          {typeof step === 'number' && typeof totalSteps === 'number' && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 w-10 rounded-full transition-colors ${
                      i < step ? 'bg-amber' : 'bg-ink-100'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                Step {step} of {totalSteps}
                {stepLabel && <> · {stepLabel}</>}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {right}
            {isLoggedIn ? (
              <>
                <CreditsBadge />
                <span className="hidden md:inline text-sm text-ink-500">{userName}</span>
                <Link href="/dashboard" className="hidden sm:inline text-sm text-ink-500 hover:text-ink-900 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink-500 hover:text-ink-900 hover:bg-ink-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">
                Sign in →
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </main>
  )
}
