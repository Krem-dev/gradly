'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
    
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
    <nav className="fixed top-0 left-0 right-0 bg-primary shadow-md w-full z-50">
      <div className="px-4 md:px-8 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center w-full justify-between gap-3 md:gap-0">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white">
            Gradly
          </Link>
          {isLoggedIn && (
            <span className="hidden sm:inline text-xs md:text-sm text-white">
              Welcome, <span className="font-semibold">{userName}</span>
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 w-full md:w-auto">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-xs md:text-sm text-white hover:text-secondary transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-xs md:text-sm text-white hover:text-secondary transition-colors">
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-xs md:text-sm text-white hover:text-secondary font-semibold transition-colors">
                Dashboard
              </Link>
              <Link href="/contact" className="hidden sm:inline text-xs md:text-sm text-white hover:text-secondary transition-colors">
                Help & Contact
              </Link>
            </>
          )}
        </div>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-xs md:text-sm text-white hover:text-secondary flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </nav>
  )
}
