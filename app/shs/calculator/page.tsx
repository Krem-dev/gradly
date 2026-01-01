'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SubjectCombobox from '@/components/SubjectCombobox'
import { WASSCE_GRADES, WASSCE_CORE_SUBJECTS, WASSCE_ELECTIVE_SUBJECTS } from '@/lib/mockData'
import { getSubjectsByStream, SHS_SUBJECTS } from '@/lib/shsSubjects'
import { Plus, Trash2, Award, School, MapPin, Filter, Save } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface SubjectGrade {
  id: string
  subject: string
  grade: string
  points: number
}

export default function SHSCalculatorPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectGrade[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [courseStream, setCourseStream] = useState<string | null>(null)

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    setUserId(id)
    
    const course = searchParams.get('course')
    if (!course) {
      router.push('/shs/course-selection')
      return
    }
    setCourseStream(course)
    console.log('userId loaded:', id)
    console.log('course stream:', course)
  }, [searchParams, router])

  const streamSubjects = useMemo(() => {
    if (!courseStream) return []
    const subjects = getSubjectsByStream(courseStream)
    return subjects.map(s => s.name)
  }, [courseStream])

  const availableSubjects = streamSubjects.filter(
    subject => !selectedSubjects.some(s => s.subject === subject)
  )

  const handleAddMultipleSubjects = (subjects: string[]) => {
    const newSubjects: SubjectGrade[] = subjects.map(subject => ({
      id: Date.now().toString() + Math.random(),
      subject,
      grade: '',
      points: 0
    }))
    setSelectedSubjects([...selectedSubjects, ...newSubjects])
  }

  const handleGradeChange = (id: string, grade: string) => {
    const gradeInfo = WASSCE_GRADES.find(g => g.grade === grade)
    setSelectedSubjects(selectedSubjects.map(s => 
      s.id === id 
        ? { ...s, grade, points: gradeInfo?.points || 0 }
        : s
    ))
  }

  const handleRemoveSubject = (id: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s.id !== id))
  }

  const handleSaveCalculation = async () => {
    if (!userId) {
      showToast('Please login to save your calculation', 'error')
      router.push('/login')
      return
    }

    if (best6Subjects.length !== 6) {
      showToast('Please complete your calculation (6 subjects with grades)', 'error')
      return
    }

    setIsSaving(true)

    try {
      const saveResponse = await api.shs.saveConversion(
        parseInt(userId),
        aggregate,
        selectedSubjects
      )

      if (saveResponse.success) {
        showToast('Calculation saved successfully!', 'success')
      } else {
        showToast('Failed to save calculation', 'error')
      }
    } catch (err) {
      console.error('Error saving calculation:', err)
      showToast('Failed to save calculation', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const gradedSubjects = useMemo(() => 
    selectedSubjects.filter(s => s.grade),
    [selectedSubjects]
  )

  const best6Subjects = useMemo(() => {
    if (gradedSubjects.length < 6) return []
    return [...gradedSubjects].sort((a, b) => a.points - b.points).slice(0, 6)
  }, [gradedSubjects])

  const aggregate = useMemo(() => 
    best6Subjects.reduce((sum, s) => sum + s.points, 0),
    [best6Subjects]
  )

  useEffect(() => {
    if (aggregate > 0) {
      fetchRecommendations()
    } else {
      setRecommendations([])
    }
  }, [aggregate])

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/recommendations/universities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aggregate, courseStream })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      setRecommendations(data.universities || [])
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      showToast('Failed to load recommendations', 'error')
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const eligiblePrograms = useMemo(() => {
    return recommendations.flatMap(university =>
      university.programs.map(program => ({
        university: university.university,
        universityName: university.universityName,
        program: program.name,
        cutoff: program.cutoffAggregate
      }))
    ).sort((a, b) => a.cutoff - b.cutoff)
  }, [recommendations])

  const filteredPrograms = eligiblePrograms

  if (!courseStream) {
    return null
  }

  const courseNames: Record<string, string> = {
    'science': 'General Science',
    'business': 'Business',
    'agricultural-science': 'Agricultural Science',
    'arts': 'General Arts',
    'home-economics': 'Home Economics',
    'visual-arts': 'Visual Arts'
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <section className="flex-1 bg-white py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Course Stream</p>
                <h2 className="text-2xl font-bold text-gray-900">{courseNames[courseStream]}</h2>
              </div>
              <button
                onClick={() => router.push('/shs/course-selection')}
                className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                Change Course
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Subjects ({selectedSubjects.length})
                  </h2>
                  <SubjectCombobox
                    availableSubjects={availableSubjects}
                    onSelectMultiple={handleAddMultipleSubjects}
                  />
                </div>


                {selectedSubjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm mb-3">No subjects added yet</p>
                    <p className="text-gray-400 text-xs">Add at least 6 subjects to calculate your aggregate</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSubjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold text-gray-900 text-sm flex-1 leading-tight">
                            {subject.subject}
                          </p>
                          <button
                            onClick={() => handleRemoveSubject(subject.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-all flex-shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={subject.grade}
                            onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                            className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
                          >
                            <option value="">Select Grade</option>
                            {WASSCE_GRADES.map(g => (
                              <option key={g.grade} value={g.grade}>
                                {g.grade}
                              </option>
                            ))}
                          </select>
                          {subject.grade && (
                            <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary bg-opacity-10 rounded">
                              {subject.points} {subject.points === 1 ? 'pt' : 'pts'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedSubjects.length > 0 && (
                <div className="flex gap-2">
                  {userId && best6Subjects.length === 6 && (
                    <button
                      onClick={handleSaveCalculation}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save Calculation'}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-sm"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {best6Subjects.length === 6 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">University Recommendations</h3>
                    <span className="text-sm font-semibold text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-full">
                      {filteredPrograms.length} Programs
                    </span>
                  </div>
                  
                  {loadingRecommendations ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-sm">Loading recommendations...</p>
                    </div>
                  ) : eligiblePrograms.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 text-sm">No programs found for your aggregate</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                      {filteredPrograms.map((program, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all bg-white"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-primary bg-opacity-10 flex items-center justify-center flex-shrink-0">
                              <School className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                                {program.program}
                              </h4>
                              <p className="text-xs text-gray-600 truncate">{program.universityName}</p>
                            </div>
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded flex-shrink-0">
                              {program.cutoff}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-primary rounded-lg p-5 text-white sticky top-8">
                <h3 className="text-base font-bold mb-4">Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white border-opacity-30">
                    <span className="text-xs text-white text-opacity-80">Total Subjects</span>
                    <span className="text-2xl font-bold text-white">{selectedSubjects.length}</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-white border-opacity-30">
                    <span className="text-xs text-white text-opacity-80">Graded</span>
                    <span className="text-2xl font-bold text-white">{gradedSubjects.length}</span>
                  </div>

                  {best6Subjects.length === 6 ? (
                    <>
                      <div className="pt-3">
                        <p className="text-xs text-white text-opacity-80 mb-2">Your Aggregate</p>
                        <p className="text-5xl font-bold text-white mb-1">{aggregate}</p>
                        <p className="text-xs text-white text-opacity-70">
                          Best 6 subjects
                        </p>
                      </div>

                      <div className="bg-white bg-opacity-15 rounded-lg p-3 mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white text-opacity-80">Programs</span>
                          <span className="text-xl font-bold text-white">{eligiblePrograms.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white text-opacity-80">Universities</span>
                          <span className="text-xl font-bold text-white">
                            {new Set(eligiblePrograms.map(p => p.university)).size}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white bg-opacity-15 rounded-lg p-3 mt-3">
                      <p className="text-xs text-white leading-relaxed">
                        {gradedSubjects.length === 0 
                          ? 'Add and grade at least 6 subjects to calculate your aggregate'
                          : `${6 - gradedSubjects.length} more ${6 - gradedSubjects.length === 1 ? 'subject' : 'subjects'} needed`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
