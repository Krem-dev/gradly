'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'
import { broadcastCreditsUpdate } from '@/components/ui/CreditsBadge'

export default function Page() {
  return (
    <Suspense fallback={<Fallback />}>
      <PaymentSuccessPage />
    </Suspense>
  )
}

function Fallback() {
  return (
    <AppShell>
      <Container size="default" className="py-32 text-center">
        <Loader2 className="h-6 w-6 text-ink-400 animate-spin mx-auto" />
        <p className="mt-4 text-sm font-mono uppercase tracking-[0.18em] text-ink-500">
          Verifying payment…
        </p>
      </Container>
    </AppShell>
  )
}

type State =
  | { kind: 'pending' }
  | { kind: 'success'; balance: number | null; alreadyFulfilled: boolean }
  | { kind: 'failed'; error: string }

function PaymentSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [state, setState] = useState<State>({ kind: 'pending' })

  useEffect(() => {
    let reference = params.get('reference') || params.get('trxref')
    if (!reference && typeof window !== 'undefined') {
      reference = localStorage.getItem('pendingPaymentReference')
    }
    if (!reference) {
      setState({ kind: 'failed', error: 'No payment reference found in the URL.' })
      return
    }
    ;(async () => {
      try {
        const r = await api.payments.verify(reference!)
        if (r.success && r.data?.status === 'success') {
          if (typeof window !== 'undefined') {
            try { localStorage.removeItem('pendingPaymentReference') } catch {}
          }
          broadcastCreditsUpdate()
          setState({
            kind: 'success',
            balance: r.data.balance,
            alreadyFulfilled: r.data.alreadyFulfilled,
          })
        } else {
          setState({
            kind: 'failed',
            error: r.error || `Payment ${r.data?.status || 'failed'}.`,
          })
        }
      } catch (err: any) {
        setState({ kind: 'failed', error: err?.message || 'Verification failed.' })
      }
    })()
  }, [params])

  return (
    <AppShell>
      <Container size="default" className="py-20 md:py-28">
        {state.kind === 'pending' && (
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-amber-dark animate-spin mx-auto" />
            <SectionLabel className="mt-6 justify-center">Verifying payment</SectionLabel>
            <h1 className="font-display mt-4 text-display-md text-ink-900">
              Hang on a sec…
            </h1>
            <p className="mt-3 text-base text-ink-500">
              We&apos;re confirming with Paystack and crediting your account.
            </p>
          </div>
        )}

        {state.kind === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success ring-1 ring-success/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <SectionLabel className="mt-6 justify-center">Payment successful</SectionLabel>
            <h1 className="font-display mt-4 text-display-md text-ink-900 [text-wrap:balance]">
              You&apos;re <span className="italic text-amber-dark">good to go.</span>
            </h1>
            <p className="mt-4 text-base text-ink-500 max-w-md mx-auto">
              {state.alreadyFulfilled
                ? 'This payment was already processed. Your balance is up to date.'
                : 'Your Convert Pack credits have been added to your account.'}
              {state.balance !== null && (
                <>
                  {' '}You now have{' '}
                  <span className="font-display text-ink-900">{state.balance}</span>{' '}
                  {state.balance === 1 ? 'credit' : 'credits'}.
                </>
              )}
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button variant="pill" size="lg" href="/university/convert">
                Start converting
              </Button>
              <Button variant="secondary" size="lg" href="/dashboard" withArrow={false}>
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {state.kind === 'failed' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-danger/10 text-danger ring-1 ring-danger/20">
              <XCircle className="h-8 w-8" />
            </div>
            <SectionLabel className="mt-6 justify-center">Payment incomplete</SectionLabel>
            <h1 className="font-display mt-4 text-display-md text-ink-900 [text-wrap:balance]">
              We couldn&apos;t confirm <span className="italic text-amber-dark">your payment.</span>
            </h1>
            <p className="mt-4 text-base text-ink-500 max-w-md mx-auto">
              {state.error}
              {' '}If you were charged, drop us a line — your reference is safe and we can verify it manually.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button variant="pill" size="lg" href="/pricing">
                Try again
              </Button>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-ink-500 hover:text-ink-900 transition-colors"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}
      </Container>
    </AppShell>
  )
}
