'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SubscriptionBanner from '@/components/SubscriptionBanner'
import { GLOBAL_UNIVERSITIES, GRADING_SYSTEMS } from '@/lib/mockData'
import { Award, Globe, DollarSign, GraduationCap, Filter, MapPin, Save } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

export default function UniversityResultsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'cwa-to-cgpa' | 'cgpa-to-cwa'>('cwa-to-cgpa')
  const [system, setSystem] = useState('usa')
  const [courses, setCourses] = useState<Course[]>([])
  const [convertedScore, setConvertedScore] = useState<number>(0)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [userId, setUserId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    setUserId(id)
  }, [])

  useEffect(() => {
    const targetSystem = searchParams.get('targetSystem')
    const coursesParam = searchParams.get('courses')
    const usaGpaParam = searchParams.get('usaGpa')
    const ukPercentageParam = searchParams.get('ukPercentage')

    if (coursesParam) {
      try {
        const parsedCourses = JSON.parse(coursesParam)
        setCourses(parsedCourses)
      } catch (e) {
        console.error('Error parsing courses:', e)
      }
    }

    if (targetSystem === 'usa_gpa' && usaGpaParam) {
      setConvertedScore(parseFloat(usaGpaParam))
      setSystem('usa')
      setMode('cwa-to-cgpa')
    } else if (targetSystem === 'uk_percentage' && ukPercentageParam) {
      setConvertedScore(parseFloat(ukPercentageParam))
      setSystem('uk')
      setMode('cwa-to-cgpa')
    }
  }, [searchParams])

  const eligibleUniversities = GLOBAL_UNIVERSITIES.filter(uni => 
    convertedScore >= uni.minCGPA && convertedScore <= uni.maxCGPA
  )

  const regions = ['all', ...Array.from(new Set(GLOBAL_UNIVERSITIES.map(u => u.region)))]

  const filteredUniversities = selectedRegion === 'all'
    ? eligibleUniversities
    : eligibleUniversities.filter(u => u.region === selectedRegion)

  const systemLabel = GRADING_SYSTEMS.find(s => s.id === system)?.label || system

  const handleSaveConversion = async () => {
    if (!userId) {
      showToast('Please login to save your conversion', 'error')
      router.push('/login')
      return
    }

    setIsSaving(true)

    try {
      const conversionData = {
        sourceSystem: searchParams.get('sourceSystem'),
        sourceScore: parseFloat(searchParams.get('sourceScore') || '0'),
        usaGpa: parseFloat(searchParams.get('usaGpa') || '0'),
        ukPercentage: parseFloat(searchParams.get('ukPercentage') || '0'),
        targetSystem: searchParams.get('targetSystem'),
        courses: courses
      }

      const saveResponse = await api.universityConverter.save(
        parseInt(userId),
        conversionData
      )

      if (saveResponse.success) {
        showToast('Conversion saved successfully!', 'success')
      } else {
        showToast('Failed to save conversion', 'error')
      }
    } catch (err) {
      console.error('Error saving conversion:', err)
      showToast('Failed to save conversion', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (courses.length === 0) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navigation />
        <section className="flex-1 bg-white w-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-6">Please add your courses first</p>
            <button
              onClick={() => router.push('/university/convert')}
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all"
            >
              Go to Converter
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.creditHours) || 0), 0)
  const avgScore = courses.length > 0
    ? (courses.reduce((sum, c) => sum + (parseFloat(c.score) || 0), 0) / courses.length).toFixed(2)
    : '0.00'

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <section className="bg-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="bg-secondary rounded-2xl p-8 text-center lg:col-span-1">
              <p className="text-gray-700 text-sm mb-3 font-semibold uppercase tracking-wide">CONVERTED SCORE</p>
              <p className="text-5xl font-bold text-primary mb-2 leading-tight">{convertedScore.toFixed(2)}</p>
              <p className="text-gray-600 text-sm">
                {mode === 'cwa-to-cgpa' ? 'on 4.0 Scale' : 'Percentage'}
              </p>
            </div>

            <div className="lg:col-span-4">
              <p className="text-sm text-gray-600 font-semibold mb-2 uppercase tracking-wide">
                {mode === 'cwa-to-cgpa' ? 'CWA to CGPA' : 'CGPA to CWA'} Conversion
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {mode === 'cwa-to-cgpa' ? 'Your CGPA' : 'Your CWA'}
              </h1>
              <p className="text-gray-600 mb-8">
                Conversion result for <span className="font-semibold">{systemLabel}</span>
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Total Credits</p>
                  <p className="text-4xl font-bold text-primary">{totalCredits.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Avg Score</p>
                  <p className="text-4xl font-bold text-primary">{avgScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Eligible Unis</p>
                  <p className="text-4xl font-bold text-primary">{eligibleUniversities.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-2 w-full border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Global University Recommendations ({filteredUniversities.length})
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region === 'all' ? 'All Regions' : region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredUniversities.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  No universities found matching your criteria
                </p>
                <button
                  onClick={() => setSelectedRegion('all')}
                  className="px-4 py-2 rounded-lg font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all text-sm"
                >
                  View All Universities
                </button>
              </div>
            ) : (
              <>
                {filteredUniversities.length > 2 && (
                  <div className="bg-gradient-to-r from-secondary to-yellow-300 rounded-lg p-4 mb-6 border border-primary">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Unlock All Universities</h3>
                        <p className="text-xs text-gray-700">
                          You're viewing <span className="font-semibold">2 of {filteredUniversities.length}</span> eligible universities
                        </p>
                      </div>
                      <button className="px-4 py-1.5 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-xs whitespace-nowrap flex-shrink-0">
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUniversities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((university) => (
                  <div
                    key={university.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-primary"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {university.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{university.country}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-primary font-semibold">{university.region}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-gray-700">
                          CGPA Range: <span className="font-semibold">{university.minCGPA.toFixed(1)} - {university.maxCGPA.toFixed(1)}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-gray-700">
                          Tuition: <span className="font-semibold">{university.tuitionRange}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-gray-700">
                          Scholarships: <span className="font-semibold">{university.scholarships ? 'Available' : 'Limited'}</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Available Programs:</p>
                      <div className="flex flex-wrap gap-2">
                        {university.programs.slice(0, 4).map((program, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-primary bg-opacity-10 text-primary rounded"
                          >
                            {program}
                          </span>
                        ))}
                        {university.programs.length > 4 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            +{university.programs.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>

                {filteredUniversities.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.ceil(filteredUniversities.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all text-sm ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredUniversities.length / itemsPerPage), currentPage + 1))}
                      disabled={currentPage === Math.ceil(filteredUniversities.length / itemsPerPage)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            {userId && (
              <button
                onClick={handleSaveConversion}
                disabled={isSaving}
                className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Conversion'}
              </button>
            )}
            <button
              onClick={() => router.push('/university/convert')}
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
