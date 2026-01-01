'use client'

import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { GraduationCap, BookOpen } from 'lucide-react'

export default function StartPage() {
  const router = useRouter()

  const userTypes = [
    {
      id: 'shs',
      title: 'SHS Student',
      subtitle: 'WASSCE Aggregate Calculator',
      description: 'Calculate your WASSCE aggregate and get recommendations for Ghana universities based on cutoff points',
      icon: BookOpen,
      features: [
        'Enter your WASSCE grades',
        'Calculate aggregate automatically',
        'View eligible Ghana universities',
        'Get program recommendations',
        'See cutoff points by program'
      ],
      buttonText: 'Calculate Aggregate',
      route: '/shs/calculator',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'university',
      title: 'University Student',
      subtitle: 'Grade Conversion & Global Opportunities',
      description: 'Convert between CWA and CGPA, and discover global universities that match your academic profile',
      icon: GraduationCap,
      features: [
        'Convert CWA ↔ CGPA',
        'Support for multiple grading systems',
        'Upload transcripts (Premium)',
        'Global university recommendations',
        'Program eligibility analysis'
      ],
      buttonText: 'Convert Grades',
      route: '/university/convert',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <section className="bg-white flex-1 w-full flex items-center justify-center py-8 md:py-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {userTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => router.push(type.route)}
                  className="text-left bg-secondary border border-primary rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-12 md:w-14 h-12 md:h-14 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 md:w-7 h-6 md:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">
                        {type.title}
                      </h2>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {type.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                    {type.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-primary">
                    {type.buttonText}
                    <span>→</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-600 text-xs md:text-sm">
              <span className="font-semibold">SHS?</span> Calculate your WASSCE aggregate. <span className="font-semibold">University?</span> Convert your grades.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
