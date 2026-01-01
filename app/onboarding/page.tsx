'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { ArrowRight, Check } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [source, setSource] = useState('')
  const [purpose, setPurpose] = useState('')

  const sources = [
    'Social Media',
    'Search Engine',
    'Friend/Family',
    'School/University',
    'Advertisement',
    'Other'
  ]

  const purposes = [
    'Calculate WASSCE Aggregate',
    'Convert University Grades',
    'Find University Programs',
    'Graduate School Applications',
    'Career Planning',
    'Other'
  ]

  const handleComplete = () => {
    router.push('/dashboard')
  }

  const canContinue = source && purpose

  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <h1 className="text-2xl font-bold text-primary">Gradly</h1>
        </div>
      </nav>

      <section className="py-12 w-full">
        <div className="max-w-3xl mx-auto px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Gradly!
            </h1>
            <p className="text-gray-600">
              Quick setup - help us personalize your experience
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                How did you hear about Gradly?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sources.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSource(item)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                      source === item
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                What do you plan to use Gradly for?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {purposes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setPurpose(item)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                      purpose === item
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleComplete}
                disabled={!canContinue}
                className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
