'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { api } from '@/lib/api'

/**
 * Live credit balance pill for the AppShell nav. Polls once on mount, then listens
 * for the `credits-updated` window event so other components (Buy modal, convert
 * page) can push refreshes without prop-drilling.
 */
export default function CreditsBadge() {
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    if (!userId) return

    const load = async () => {
      try {
        const r = await api.credits.getBalance(parseInt(userId, 10))
        if (r.success && r.data) setBalance(r.data.balance)
      } catch {
        // silent — badge just won't render
      }
    }
    load()
    const handler = () => load()
    window.addEventListener('credits-updated', handler)
    return () => window.removeEventListener('credits-updated', handler)
  }, [])

  if (balance === null) return null

  const empty = balance <= 0

  return (
    <Link
      href="/pricing"
      className={`group inline-flex items-center gap-2 rounded-pill h-9 pl-3 pr-3 text-sm font-medium ring-1 transition-all ${
        empty
          ? 'bg-amber/10 text-amber-dark ring-amber/30 hover:bg-amber/20'
          : 'bg-ink-50 text-ink-700 ring-ink-100 hover:ring-ink-300'
      }`}
      title={empty ? 'You have no credits — buy a Convert Pack' : `${balance} credits remaining`}
    >
      <Zap className={`h-3.5 w-3.5 ${empty ? 'text-amber-dark' : 'text-amber-dark'}`} />
      <span className="font-mono text-xs uppercase tracking-wider">
        {balance} {balance === 1 ? 'credit' : 'credits'}
      </span>
    </Link>
  )
}

/**
 * Broadcast helper for other components to refresh the badge after a successful
 * purchase or use. Cheap to call — listeners are dirt-cheap fetch wrappers.
 */
export function broadcastCreditsUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('credits-updated'))
  }
}
