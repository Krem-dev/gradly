'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Award, School, MapPin, ChevronRight, Filter, Loader } from 'lucide-react'

interface SubjectGrade {
  subject: string
  grade: string
  points: number
}

interface Program {
  university: string
  universityName: string
  programs: Array<{
    name: string
    cutoffAggregate: number
  }>
}

export default function SHSResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [aggregate, setAggregate] = useState<number>(0)
  const [subjects, setSubjects] = useState<SubjectGrade[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [recommendations, setRecommendations] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const aggregateParam = searchParams.get('aggregate')
    const subjectsParam = searchParams.get('subjects')

    if (aggregateParam) {
      setAggregate(parseInt(aggregateParam))
    }

    if (subjectsParam) {
      try {
        const parsedSubjects = JSON.parse(decodeURIComponent(subjectsParam))
        setSubjects(parsedSubjects)
      } catch (e) {
        console.error('Error parsing subjects:', e)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (aggregate > 0) {
      fetchRecommendations()
    }
  }, [aggregate])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError('')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/recommendations/universities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aggregate })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      setRecommendations(data.universities || [])
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const eligiblePrograms = recommendations.flatMap(university =>
    university.programs.map(program => ({
      university: university.university,
      universityName: university.universityName,
      program: program.name,
      cutoff: program.cutoffAggregate
    }))
  ).sort((a, b) => a.cutoff - b.cutoff)

  const filteredPrograms = eligiblePrograms

  if (!aggregate) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <section className="flex-1 bg-white w-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-6">Please calculate your aggregate first</p>
            <button
              onClick={() => router.push('/shs/calculator')}
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all"
            >
              Go to Calculator
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <section className="bg-gradient-to-br from-primary to-purple-600 py-12 w-full">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Your WASSCE Results
            </h1>
            <p className="text-white text-opacity-90 text-base">
              Based on your aggregate, here are your opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-white">
              <p className="text-sm text-white text-opacity-80 mb-2">Your Aggregate</p>
              <p className="text-5xl font-bold mb-1">{aggregate}</p>
              <p className="text-xs text-white text-opacity-70">Best 6 subjects</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-white">
              <p className="text-sm text-white text-opacity-80 mb-2">Eligible Programs</p>
              <p className="text-5xl font-bold mb-1">{eligiblePrograms.length}</p>
              <p className="text-xs text-white text-opacity-70">Across Ghana universities</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-white">
              <p className="text-sm text-white text-opacity-80 mb-2">Universities</p>
              <p className="text-5xl font-bold mb-1">
                {new Set(eligiblePrograms.map(p => p.university)).size}
              </p>
              <p className="text-xs text-white text-opacity-70">Institutions available</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 w-full">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Subjects</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {subjects.map((subject, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1 truncate">{subject.subject}</p>
                  <p className="text-lg font-bold text-primary">{subject.grade}</p>
                  <p className="text-xs text-gray-500">{subject.points} {subject.points === 1 ? 'pt' : 'pts'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Eligible Programs ({filteredPrograms.length})
              </h2>
              </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading recommendations...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-lg">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchRecommendations}
                  className="px-4 py-2 rounded-lg font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  No programs found for your aggregate
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPrograms.map((program, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                            <School className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {program.program}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="font-semibold">{program.universityName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full">
                            <span className="text-xs font-semibold text-green-700">
                              Cutoff: {program.cutoff}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push('/shs/calculator')}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-sm"
            >
              Recalculate
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm"
            >
              Print Results
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
