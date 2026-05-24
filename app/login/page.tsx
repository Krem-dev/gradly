'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'
import AuthShell from '@/components/ui/AuthShell'
import TextField from '@/components/ui/TextField'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

export default function LoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('Email and password are required.')
      showToast('Email and password are required', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.login(email, password)

      if (response.success && response.data) {
        localStorage.setItem('userId', response.data.id.toString())
        localStorage.setItem('userEmail', response.data.email)
        localStorage.setItem('userPlan', response.data.plan)
        showToast('Login successful!', 'success')
        setTimeout(() => router.push('/dashboard'), 800)
      } else {
        setErrorMsg(response.error || 'Login failed.')
        showToast(response.error || 'Login failed', 'error')
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
      kicker="Welcome back"
      title={
        <>
          Sign in to <span className="italic text-amber-dark">Gradly.</span>
        </>
      }
      subtitle="Pick up where you left off — your conversions and recommendations are right where you saved them."
      footer={
        <p className="text-sm text-ink-500">
          New to Gradly?{' '}
          <Link href="/register" className="text-ink-900 font-medium hover:text-amber-dark transition-colors">
            Create an account →
          </Link>
        </p>
      }
      quoteIndex={0}
    >
      {errorMsg && (
        <div className="mb-5 rounded-xl bg-danger/5 ring-1 ring-danger/20 px-4 py-3 text-sm text-danger">
          {errorMsg}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
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
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock className="h-4 w-4" />}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember}>
            Remember me
          </Checkbox>
          <Link
            href="/forgot-password"
            className="text-sm text-ink-500 hover:text-ink-900 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="pill"
            size="lg"
            className="w-full justify-center"
            loading={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
      </form>
    </AuthShell>
  )
}
