'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PricingModal from '@/components/PricingModal'
import { 
  Calculator, 
  Crown, 
  Calendar, 
  Share2, 
  Trash2, 
  LogOut,
  FileText,
  TrendingUp,
  Users
} from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

export default function DashboardPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [conversions, setConversions] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        if (!userId) {
          router.push('/login')
          return
        }

        const statsResponse = await api.dashboard.getStats(parseInt(userId))
        if (statsResponse.success && statsResponse.data) {
          setUserInfo(statsResponse.data.user)
        }

        const conversionsResponse = await api.dashboard.getConversions(parseInt(userId), 10, 0)
        if (conversionsResponse.success && conversionsResponse.data) {
          setConversions(conversionsResponse.data)
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [router])

  const subscription = {
    plan: userInfo?.plan || 'Free',
    status: 'active',
    expiresAt: null,
    features: userInfo?.plan === 'premium' 
      ? ['Unlimited conversions', 'Unlimited recommendations', 'Transcript upload']
      : ['Basic conversions', 'Limited recommendations']
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPlan')
    router.push('/')
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    handleLogout()
  }

  const handleDeleteConversion = async (conversionId: number) => {
    try {
      await api.dashboard.deleteConversion(conversionId)
      setConversions(conversions.filter(c => c.id !== conversionId))
      showToast('Conversion deleted', 'success')
    } catch (err) {
      console.error('Failed to delete conversion:', err)
      showToast('Failed to delete conversion', 'error')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('All fields are required')
      showToast('All fields are required', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match')
      showToast('New passwords do not match', 'error')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters')
      showToast('Password must be at least 6 characters', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (!userId) {
        setErrorMsg('User not found')
        return
      }

      const response = await api.auth.changePassword(parseInt(userId), currentPassword, newPassword, confirmPassword)
      
      if (response.success) {
        setSuccessMsg('Password changed successfully!')
        showToast('Password changed successfully!', 'success')
        setTimeout(() => {
          setShowChangePassword(false)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }, 1500)
      } else {
        setErrorMsg(response.error || 'Failed to change password')
        showToast(response.error || 'Failed to change password', 'error')
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
      showToast('An error occurred. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccountConfirm = async () => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!deletePassword) {
      setErrorMsg('Password is required to delete account')
      showToast('Password is required to delete account', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (!userId) {
        setErrorMsg('User not found')
        return
      }

      const response = await api.auth.deleteAccount(parseInt(userId), deletePassword)
      
      if (response.success) {
        setSuccessMsg('Account deleted successfully. Redirecting...')
        showToast('Account deleted successfully', 'success')
        setTimeout(() => {
          localStorage.removeItem('userId')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('userPlan')
          router.push('/')
        }, 2000)
      } else {
        setErrorMsg(response.error || 'Failed to delete account')
        showToast(response.error || 'Failed to delete account', 'error')
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.')
      showToast('An error occurred. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    const shareUrl = 'https://gradly.app/invite?ref=user123'
    if (navigator.share) {
      navigator.share({
        title: 'Join Gradly',
        text: 'Calculate your grades and find your ideal university programs!',
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Invite link copied to clipboard!')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <section className="flex-1 py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-secondary rounded-lg border border-primary p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{conversions.length}</p>
              <p className="text-xs text-gray-600 mt-1">Total Conversions</p>
            </div>

            <div className="bg-secondary rounded-lg border border-primary p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-600 mt-1">This Month</p>
            </div>

            <div className="bg-secondary rounded-lg border border-primary p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{subscription.plan}</p>
              <p className="text-xs text-gray-600 mt-1">Current Plan</p>
            </div>

            <div className="bg-secondary rounded-lg border border-primary p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-600 mt-1">Referrals</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Conversions</h2>
                  <button
                    onClick={() => router.push('/start')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-opacity-90 transition-all"
                  >
                    New Conversion
                  </button>
                </div>

                {conversions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm mb-4">No conversions yet</p>
                    <button
                      onClick={() => router.push('/start')}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all"
                    >
                      Start Your First Conversion
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Type</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Details</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Result</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Date</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversions.map((conversion) => {
                          const courseCount = Array.isArray(conversion.courses) ? conversion.courses.length : 0
                          const formattedDate = conversion.created_at 
                            ? new Date(conversion.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric'
                              })
                            : 'N/A'
                          
                          return (
                          <tr key={conversion.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">Conversion</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {courseCount > 0 ? `${courseCount} courses` : 'courses'}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-primary bg-opacity-10 text-primary font-bold text-lg">
                                {conversion.usa_gpa || 'N/A'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {formattedDate}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button 
                                onClick={() => handleDeleteConversion(conversion.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Subscription</h2>
                    <p className="text-xs text-gray-600">{subscription.plan} Plan</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold text-green-600 capitalize">
                      {subscription.status}
                    </span>
                  </div>
                  {subscription.expiresAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expires</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(subscription.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                  <ul className="space-y-1">
                    {subscription.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {subscription.plan === 'Free' && (
                  <button
                    onClick={() => setShowPricingModal(true)}
                    className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 transition-all text-sm"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Share & Earn</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Invite friends and get rewards when they sign up!
                </p>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Invite Link
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Account Settings</h2>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition-all">
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowChangePassword(true)}
                    className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Change Password
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50 transition-all">
                    Notification Settings
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full text-left px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
            
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

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setErrorMsg('')
                    setSuccessMsg('')
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition-all text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>

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

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Confirm with your password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeletePassword('')
                  setErrorMsg('')
                  setSuccessMsg('')
                }}
                className="flex-1 px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      <Footer />
    </main>
  )
}
