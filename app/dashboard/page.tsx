'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Plus,
  Trash2,
  ArrowUpRight,
  Share2,
  Crown,
  Shield,
  KeyRound,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface Conversion {
  id: number
  /** 'shs' or 'university' — tells the delete endpoint which table to target. */
  source?: 'shs' | 'university'
  type?: string
  result?: number
  createdAt?: string
  courses?: any[]
  aggregate?: number
  targetSystem?: string
  sourceSystem?: string
  [key: string]: any
}

export default function DashboardPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [userInfo, setUserInfo] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') ?? '' : ''
        setUserEmail(email)
        if (!userId) {
          router.push('/login')
          return
        }
        const statsResponse = await api.dashboard.getStats(parseInt(userId))
        if (statsResponse.success && statsResponse.data) setUserInfo(statsResponse.data.user)
        const convResponse = await api.dashboard.getConversions(parseInt(userId), 10, 0)
        if (convResponse.success && convResponse.data) setConversions(convResponse.data)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPlan')
    router.push('/')
  }

  const handleDeleteConversion = async (conversionId: number, source: 'shs' | 'university') => {
    try {
      const r = await api.dashboard.deleteConversion(conversionId, source)
      if (!r.success) throw new Error(r.error || 'Delete failed')
      // Filter by BOTH id and source — the same id can exist in both tables (auto-inc).
      setConversions((prev) => prev.filter((c) => !(c.id === conversionId && c.source === source)))
      showToast('Conversion deleted', 'success')
    } catch (err) {
      console.error(err)
      showToast('Failed to delete conversion', 'error')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      return
    }
    setIsSubmitting(true)
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (!userId) return
      const r = await api.auth.changePassword(
        parseInt(userId),
        currentPassword,
        newPassword,
        confirmPassword
      )
      if (r.success) {
        showToast('Password changed', 'success')
        setShowChangePassword(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setErrorMsg(r.error || 'Failed to change password.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to change password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!deletePassword) {
      setErrorMsg('Enter your password to confirm.')
      return
    }
    setIsSubmitting(true)
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (!userId) return
      const r = await api.auth.deleteAccount(parseInt(userId), deletePassword)
      if (r.success) {
        showToast('Account deleted', 'success')
        handleLogout()
      } else {
        setErrorMsg(r.error || 'Failed to delete account.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to delete account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const inMonth = conversions.filter((c) => {
      if (!c.createdAt) return false
      return new Date(c.createdAt) >= monthStart
    }).length
    return {
      total: conversions.length,
      thisMonth: inMonth,
      plan: userInfo?.plan ?? 'free',
      streak: '—',
    }
  }, [conversions, userInfo])

  const credits = userInfo?.credits ?? 0
  // Prefer the user's real first name from registration. Fall back to the part of
  // their email before @ (with separators replaced) only if no full name was set.
  const userName = (() => {
    const full = (userInfo?.fullName || '').trim()
    if (full) {
      // Use just the first name — feels warmer than "Yaw Amponsah Mensah."
      return full.split(/\s+/)[0]
    }
    return (userEmail.split('@')[0] || 'there').replace(/[-_.]/g, ' ')
  })()

  if (isLoading) {
    return (
      <AppShell>
        <section className="py-32 text-center">
          <p className="text-sm font-mono uppercase tracking-[0.18em] text-ink-500">
            Loading your dashboard…
          </p>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Welcome header */}
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
        <div className="pointer-events-none absolute -top-32 right-1/4 h-[420px] w-[640px] rounded-full bg-amber/15 blur-[140px]" />

        <Container size="wide" className="relative py-14 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <SectionLabel tone="light">Dashboard</SectionLabel>
              <h1 className="font-display mt-4 text-display-md md:text-display-lg [text-wrap:balance]">
                Welcome back, <span className="italic text-amber capitalize">{userName}.</span>
              </h1>
              <p className="mt-4 text-base text-ink-300 max-w-md">
                Pick up where you left off. Your saved conversions and recommendations are right where you saved them.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="pill" size="lg" href="/start">
                New conversion
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            <DashStat label="Conversions" value={stats.total.toString()} sub="All time" highlight />
            <DashStat label="This month" value={stats.thisMonth.toString()} sub="Saved in the last 30 days" />
            <DashStat
              label="Credits"
              value={credits.toString()}
              sub={credits > 0 ? `${credits === 1 ? 'pack credit' : 'pack credits'} available` : 'Buy a Convert Pack'}
            />
            <DashStat label="Email" value={userEmail.split('@')[0]} sub={userEmail.split('@')[1] || ''} muted />
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="py-14 md:py-20">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* MAIN — saved conversions */}
            <div className="lg:col-span-8 space-y-10">
              <div>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <SectionLabel number="01">Saved</SectionLabel>
                    <h2 className="mt-3 font-display text-2xl md:text-3xl text-ink-900">
                      Your <span className="italic text-amber-dark">conversions.</span>
                    </h2>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
                    {conversions.length} saved
                  </span>
                </div>

                {conversions.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-ink-100 p-12 text-center">
                    <Calculator className="h-6 w-6 text-ink-300 mx-auto mb-3" />
                    <p className="font-display text-lg text-ink-900">Nothing saved yet</p>
                    <p className="mt-1.5 text-sm text-ink-500 mb-6">
                      Calculate your WASSCE aggregate or convert your university grades — your results land here.
                    </p>
                    <Button variant="pill" size="md" href="/start">
                      Start your first conversion
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {conversions.map((c, i) => (
                      <ConversionRow
                        key={c.id ?? i}
                        conv={c}
                        index={i}
                        onDelete={() => handleDeleteConversion(c.id, c.source ?? 'shs')}
                      />
                    ))}
                  </ul>
                )}
              </div>

              {/* Quick actions */}
              <div>
                <SectionLabel number="02">Quick actions</SectionLabel>
                <h2 className="mt-3 font-display text-2xl md:text-3xl text-ink-900">
                  Pick up <span className="italic text-amber-dark">where you left off.</span>
                </h2>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ActionCard
                    title="WASSCE aggregate"
                    description="Compute your aggregate by stream and board."
                    href="/shs/course-selection"
                  />
                  <ActionCard
                    title="University conversion"
                    description="Translate your CWA / CGPA to any global system."
                    href="/university/convert"
                  />
                </div>
              </div>
            </div>

            {/* SIDE — plan + account */}
            <div className="lg:col-span-4 space-y-6">
              {/* Convert Pack credits card */}
              <div className="rounded-[28px] bg-ink-900 text-white p-6 ring-1 ring-white/5 shadow-lift overflow-hidden relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber/15 blur-[100px]"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-300">
                    <Crown className="h-3.5 w-3.5 text-amber" />
                    Convert credits
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-5xl text-white">{credits}</span>
                    <span className="text-sm text-ink-300">
                      {credits === 1 ? 'credit' : 'credits'}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-amber">
                    {credits > 0
                      ? `Good for ${credits} more ${credits === 1 ? 'conversion' : 'conversions'}`
                      : 'Buy a Convert Pack to unlock university conversions'}
                  </div>
                  <div className="my-5 h-px bg-white/10" />
                  <ul className="space-y-2.5 text-sm">
                    {[
                      'WASSCE aggregate — free',
                      'Ghana recommendations — free',
                      '1 credit per university conversion',
                      '1 credit per transcript upload',
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-ink-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button variant="pill" size="md" href="/pricing">
                      {credits > 0 ? 'Buy more credits' : 'Buy Convert Pack — 20 GHS'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Share card */}
              <div className="rounded-[28px] bg-surface-muted p-6 ring-1 ring-ink-100">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  <Share2 className="h-3.5 w-3.5 text-amber-dark" />
                  Share Gradly
                </div>
                <div className="mt-3 font-display text-xl text-ink-900">
                  Know a friend taking <span className="italic text-amber-dark">WASSCE?</span>
                </div>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                  Send them Gradly. We&apos;ll do the math, recommendations, and conversions for them too.
                </p>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.origin)
                      showToast('Link copied to clipboard', 'success')
                    }
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-4 py-2 text-sm text-ink-700 transition-colors"
                >
                  Copy link
                </button>
              </div>

              {/* Account settings */}
              <div className="rounded-[28px] bg-white p-6 ring-1 ring-ink-100">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  <Shield className="h-3.5 w-3.5" />
                  Account
                </div>
                <div className="mt-2 text-sm text-ink-500 break-all">{userEmail}</div>

                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => setShowChangePassword((s) => !s)}
                    className="w-full flex items-center justify-between rounded-2xl bg-surface-muted ring-1 ring-ink-100 px-4 py-3 text-sm text-ink-700 hover:ring-ink-300 transition-all"
                  >
                    <span className="inline-flex items-center gap-2">
                      <KeyRound className="h-3.5 w-3.5" />
                      Change password
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-400" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between rounded-2xl bg-surface-muted ring-1 ring-ink-100 px-4 py-3 text-sm text-ink-700 hover:ring-ink-300 transition-all"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-400" />
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm((s) => !s)}
                    className="w-full flex items-center justify-between rounded-2xl bg-danger/5 ring-1 ring-danger/20 px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-all"
                  >
                    <span className="inline-flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Delete account
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Change password panel */}
                <AnimatePresence initial={false}>
                  {showChangePassword && (
                    <motion.form
                      onSubmit={handleChangePassword}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="space-y-3 pt-2">
                        {errorMsg && (
                          <p className="text-xs text-danger">{errorMsg}</p>
                        )}
                        <TextField
                          label="Current password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                        <TextField
                          label="New password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          minLength={8}
                          required
                        />
                        <TextField
                          label="Confirm new password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength={8}
                          required
                        />
                        <Button
                          type="submit"
                          variant="pill"
                          size="md"
                          className="w-full justify-center"
                          loading={isSubmitting}
                        >
                          {isSubmitting ? 'Updating…' : 'Update password'}
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Delete account panel */}
                <AnimatePresence initial={false}>
                  {showDeleteConfirm && (
                    <motion.form
                      onSubmit={handleDeleteAccount}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="space-y-3 pt-2 rounded-2xl bg-danger/5 ring-1 ring-danger/20 p-4">
                        <p className="text-sm text-danger">
                          This is permanent. Your conversions and recommendations will be erased.
                        </p>
                        {errorMsg && (
                          <p className="text-xs text-danger">{errorMsg}</p>
                        )}
                        <TextField
                          label="Confirm with your password"
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-pill bg-danger text-white hover:bg-danger/90 transition-colors text-sm disabled:opacity-50"
                        >
                          {isSubmitting ? 'Deleting…' : 'Delete my account'}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  )
}

function DashStat({
  label,
  value,
  sub,
  highlight,
  muted,
}: {
  label: string
  value: string
  sub: string
  highlight?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={`rounded-3xl p-5 md:p-6 ring-1 ${
        highlight
          ? 'bg-amber/10 ring-amber/30'
          : muted
          ? 'bg-white/[0.02] ring-white/5'
          : 'bg-white/[0.04] ring-white/10'
      }`}
    >
      <div
        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
          highlight ? 'text-amber' : 'text-ink-300'
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-2 font-display text-3xl md:text-4xl leading-none truncate ${
          highlight ? 'text-amber' : 'text-white'
        }`}
        title={value}
      >
        {value}
      </div>
      <div className="mt-2 text-xs text-ink-300 truncate" title={sub}>{sub}</div>
    </div>
  )
}

function ConversionRow({
  conv,
  index,
  onDelete,
}: {
  conv: Conversion
  index: number
  onDelete: () => void
}) {
  const isShs = (conv.type || '').toLowerCase().includes('shs') || typeof conv.aggregate === 'number'
  const label = isShs ? 'SHS Aggregate' : 'University Conversion'
  const numeric = isShs
    ? conv.aggregate?.toString() ?? conv.result?.toString() ?? '—'
    : conv.result?.toFixed?.(2) ?? conv.result?.toString() ?? '—'
  const sub = isShs
    ? 'Best 6 subjects'
    : conv.targetSystem === 'usa_gpa'
    ? 'USA GPA (4.0)'
    : conv.targetSystem === 'uk_percentage'
    ? 'UK Percentage'
    : conv.sourceSystem ?? 'Converted score'
  const date = conv.createdAt ? new Date(conv.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 rounded-2xl bg-white ring-1 ring-ink-100 hover:ring-ink-300 hover:shadow-soft p-4 transition-all"
    >
      <span className="font-mono text-xs text-ink-400 w-10">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber-dark ring-1 ring-amber/20">
        <Calculator className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display text-base md:text-lg text-ink-900 truncate">{label}</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-400">
            {date}
          </span>
        </div>
        <div className="text-sm text-ink-500 mt-0.5 truncate">{sub}</div>
      </div>
      <div className="text-right">
        <div className="font-display text-2xl text-ink-900 leading-none">{numeric}</div>
      </div>
      <button
        onClick={onDelete}
        aria-label="Delete conversion"
        className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-danger hover:bg-danger/5 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.li>
  )
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="group block rounded-3xl bg-white ring-1 ring-ink-100 hover:ring-ink-400 hover:shadow-soft p-6 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-ink-900">{title}</h3>
          <p className="mt-2 text-sm text-ink-500 leading-relaxed">{description}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-700 group-hover:bg-amber group-hover:text-ink-900 transition-colors">
          <Plus className="h-4 w-4" />
        </span>
      </div>
    </a>
  )
}
