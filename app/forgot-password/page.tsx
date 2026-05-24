'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import AuthShell from '@/components/ui/AuthShell'
import TextField from '@/components/ui/TextField'
import OTPInput from '@/components/ui/OTPInput'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

type Step = 'email' | 'otp' | 'reset'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!email) {
      setErrorMsg('Email is required.')
      return
    }
    setIsLoading(true)
    try {
      const r = await api.auth.sendOTP(email)
      if (r.success) {
        showToast('Verification code sent to your email', 'success')
        setStep('otp')
      } else {
        setErrorMsg(r.error || 'Failed to send code.')
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (otp.length !== 4) {
      setErrorMsg('Enter the 4-digit code.')
      return
    }
    setIsLoading(true)
    try {
      const r = await api.auth.verifyOTP(email, otp)
      if (r.success) {
        showToast('Code verified', 'success')
        setStep('reset')
      } else {
        setErrorMsg(r.error || 'Invalid code.')
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Fill both password fields.')
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
    setIsLoading(true)
    try {
      const r = await api.auth.resetPassword(email, newPassword, confirmPassword)
      if (r.success) {
        showToast('Password reset! Redirecting…', 'success')
        setTimeout(() => router.push('/login'), 1200)
      } else {
        setErrorMsg(r.error || 'Failed to reset password.')
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const titles: Record<Step, { kicker: string; title: React.ReactNode; subtitle: string }> = {
    email: {
      kicker: 'Forgot password',
      title: (
        <>
          Let&apos;s get you <span className="italic text-amber-dark">back in.</span>
        </>
      ),
      subtitle: 'Enter the email on your Gradly account and we will send you a 4-digit verification code.',
    },
    otp: {
      kicker: 'Verify',
      title: (
        <>
          Check your <span className="italic text-amber-dark">inbox.</span>
        </>
      ),
      subtitle: `We sent a 4-digit code to ${email}. It expires in 10 minutes.`,
    },
    reset: {
      kicker: 'New password',
      title: (
        <>
          Set a <span className="italic text-amber-dark">new password.</span>
        </>
      ),
      subtitle: 'Choose something only you would know. At least 8 characters.',
    },
  }
  const t = titles[step]

  return (
    <AuthShell
      kicker={t.kicker}
      title={t.title}
      subtitle={t.subtitle}
      footer={
        <div className="flex items-center justify-between text-sm">
          {step !== 'email' ? (
            <button
              onClick={() => {
                setStep('email')
                setOtp('')
                setNewPassword('')
                setConfirmPassword('')
                setErrorMsg('')
              }}
              className="inline-flex items-center gap-1.5 text-ink-500 hover:text-ink-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Start over
            </button>
          ) : (
            <span />
          )}
          <Link
            href="/login"
            className="text-ink-500 hover:text-ink-900 transition-colors"
          >
            Back to sign in →
          </Link>
        </div>
      }
      quoteIndex={0}
    >
      {errorMsg && (
        <div className="mb-5 rounded-xl bg-danger/5 ring-1 ring-danger/20 px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            required
          />
          <Button
            type="submit"
            variant="pill"
            size="lg"
            className="w-full justify-center"
            loading={isLoading}
          >
            {isLoading ? 'Sending code…' : 'Send code'}
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <OTPInput value={otp} onChange={setOtp} length={4} />
          <Button
            type="submit"
            variant="pill"
            size="lg"
            className="w-full justify-center"
            loading={isLoading}
          >
            {isLoading ? 'Verifying…' : 'Verify code'}
          </Button>
          <p className="text-center text-xs text-ink-500">
            Didn&apos;t get it?{' '}
            <button
              type="button"
              onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
              className="text-ink-900 font-medium hover:text-amber-dark transition-colors"
            >
              Resend
            </button>
          </p>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            icon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            required
          />
          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            icon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
            required
          />
          <Button
            type="submit"
            variant="pill"
            size="lg"
            className="w-full justify-center"
            loading={isLoading}
          >
            {isLoading ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
