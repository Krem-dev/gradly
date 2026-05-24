'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User } from 'lucide-react'
import AuthShell from '@/components/ui/AuthShell'
import TextField from '@/components/ui/TextField'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

export default function RegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const passwordStrength = scorePassword(password)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!fullName || !email || !password) {
      setErrorMsg('All fields are required.')
      showToast('All fields are required', 'error')
      return
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      showToast('Password must be at least 8 characters', 'error')
      return
    }
    if (!agree) {
      setErrorMsg('Please agree to the Terms & Privacy Policy.')
      showToast('Please agree to the Terms & Privacy Policy', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.register(email, password, fullName)
      if (response.success && response.data) {
        localStorage.setItem('userId', response.data.id.toString())
        localStorage.setItem('userEmail', response.data.email)
        localStorage.setItem('userPlan', response.data.plan)
        showToast('Account created!', 'success')
        setTimeout(() => router.push('/onboarding'), 800)
      } else {
        setErrorMsg(response.error || 'Registration failed.')
        showToast(response.error || 'Registration failed', 'error')
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
      showToast('Something went wrong. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      kicker="Free forever"
      title={
        <>
          Start your <span className="italic text-amber-dark">academic story.</span>
        </>
      }
      subtitle="Two minutes to set up. Conversions, recommendations, and transcript upload come included — no credit card."
      footer={
        <p className="text-sm text-ink-500">
          Already have an account?{' '}
          <Link href="/login" className="text-ink-900 font-medium hover:text-amber-dark transition-colors">
            Sign in →
          </Link>
        </p>
      }
      quoteIndex={1}
    >
      {errorMsg && (
        <div className="mb-5 rounded-xl bg-danger/5 ring-1 ring-danger/20 px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleRegister} className="space-y-5">
        <TextField
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ama Owusu"
          autoComplete="name"
          icon={<User className="h-4 w-4" />}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          required
        />
        <div>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            icon={<Lock className="h-4 w-4" />}
            minLength={8}
            required
          />
          {password && <PasswordMeter score={passwordStrength} />}
        </div>

        <Checkbox checked={agree} onChange={setAgree} required>
          I agree to Gradly&apos;s{' '}
          <Link href="/terms" className="text-ink-900 font-medium hover:text-amber-dark transition-colors">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-ink-900 font-medium hover:text-amber-dark transition-colors">
            Privacy Policy
          </Link>
          .
        </Checkbox>

        <div className="pt-1">
          <Button
            type="submit"
            variant="pill"
            size="lg"
            className="w-full justify-center"
            loading={isLoading}
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </Button>
        </div>
      </form>
    </AuthShell>
  )
}

function scorePassword(p: string) {
  let s = 0
  if (p.length >= 8) s += 1
  if (p.length >= 12) s += 1
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s += 1
  if (/\d/.test(p)) s += 1
  if (/[^A-Za-z0-9]/.test(p)) s += 1
  return Math.min(s, 4)
}

function PasswordMeter({ score }: { score: number }) {
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = [
    'bg-danger',
    'bg-warning',
    'bg-warning',
    'bg-amber',
    'bg-success',
  ]
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex gap-1 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? colors[score] : 'bg-ink-100'
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-500 w-16 text-right">
        {labels[score]}
      </span>
    </div>
  )
}
