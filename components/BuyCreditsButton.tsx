'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

/**
 * Single-press "Buy Convert Pack" button. Initializes the Paystack transaction
 * server-side, then either redirects to the hosted checkout (default) or opens
 * a new tab (when `openInNewTab` is true). The /payment/success page handles
 * verification + credit grant on return.
 *
 * Requires the user to be signed in — reads userId + userEmail from localStorage.
 */
export default function BuyCreditsButton({
  className = '',
  label = 'Buy Convert Pack — 20 GHC',
  openInNewTab = false,
}: {
  className?: string
  label?: string
  openInNewTab?: boolean
}) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (typeof window === 'undefined') return
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('userEmail')
    if (!userId || !email) {
      showToast('Sign in first to buy credits', 'error')
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      const callbackUrl = `${window.location.origin}/payment/success`
      const r = await api.payments.init(parseInt(userId, 10), email, callbackUrl)
      if (!r.success || !r.data) {
        showToast(r.error || 'Could not start payment', 'error')
        setLoading(false)
        return
      }
      // Store reference so the success page can fall back to verifying it if Paystack
      // doesn't supply the query param (rare, but possible with some popup setups).
      try {
        localStorage.setItem('pendingPaymentReference', r.data.reference)
      } catch {}

      if (openInNewTab) {
        window.open(r.data.authorizationUrl, '_blank', 'noopener,noreferrer')
        setLoading(false)
      } else {
        window.location.href = r.data.authorizationUrl
      }
    } catch (err) {
      console.error(err)
      showToast('Could not start payment', 'error')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group inline-flex items-center gap-2 rounded-pill bg-amber text-ink-900 h-12 pl-5 pr-2 text-sm font-medium hover:bg-amber-light disabled:opacity-60 transition-colors ${className}`}
    >
      <span className="px-1">{loading ? 'Starting checkout…' : label}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-amber transition-transform group-hover:translate-x-0.5">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </span>
    </button>
  )
}
