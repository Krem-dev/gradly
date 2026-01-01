'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Mail, ArrowRight, ArrowLeft, Lock } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email) {
      setErrorMsg('Email is required')
      showToast('Email is required', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.sendOTP(email)
      
      if (response.success) {
        setSuccessMsg('OTP sent to your email')
        showToast('OTP sent to your email', 'success')
        setStep('otp')
        setOtpSent(true)
      } else {
        setErrorMsg(response.error || 'Failed to send OTP')
        showToast(response.error || 'Failed to send OTP', 'error')
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
      showToast('An error occurred. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!otp || otp.length !== 4) {
      setErrorMsg('Please enter a valid 4-digit OTP')
      showToast('Please enter a valid 4-digit OTP', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.verifyOTP(email, otp)
      
      if (response.success) {
        setSuccessMsg('OTP verified successfully')
        showToast('OTP verified successfully', 'success')
        setStep('reset')
      } else {
        setErrorMsg(response.error || 'Invalid OTP')
        showToast(response.error || 'Invalid OTP', 'error')
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
      showToast('An error occurred. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Both password fields are required')
      showToast('Both password fields are required', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      showToast('Passwords do not match', 'error')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters')
      showToast('Password must be at least 6 characters', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.auth.resetPassword(email, newPassword, confirmPassword)
      
      if (response.success) {
        setSuccessMsg('Password reset successfully!')
        showToast('Password reset successfully!', 'success')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setErrorMsg(response.error || 'Failed to reset password')
        showToast(response.error || 'Failed to reset password', 'error')
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
      showToast('An error occurred. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <section className="bg-white py-16 w-full">
        <div className="max-w-md mx-auto px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              {step === 'email' ? 'Enter your email to receive an OTP' : step === 'otp' ? 'Enter the 4-digit OTP sent to your email' : 'Create a new password'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            )}
            
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{successMsg}</p>
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : step === 'otp' ? (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="0000"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary text-center tracking-widest"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Check your email for the 4-digit code</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setStep('email')
                  setEmail('')
                  setOtp('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setErrorMsg('')
                  setSuccessMsg('')
                  setOtpSent(false)
                }}
                className="text-sm text-gray-600 hover:text-primary flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
