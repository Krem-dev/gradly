'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PricingModal from '@/components/PricingModal'
import CourseEntryModal from '@/components/CourseEntryModal'
import CourseList from '@/components/CourseList'
import TranscriptUpload from '@/components/TranscriptUpload'
import { GRADING_SYSTEMS, INSTITUTIONS } from '@/lib/gradingSystems'
import { Save } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

const SEMESTERS = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
]

const DUMMY_COURSES: Course[] = [
  { id: '1', name: 'Mathematics', score: '85', creditHours: '3', semester: 'Semester 1' },
  { id: '2', name: 'Physics', score: '90', creditHours: '4', semester: 'Semester 1' },
  { id: '3', name: 'Chemistry', score: '78', creditHours: '3', semester: 'Semester 1' },
  { id: '4', name: 'English Literature', score: '88', creditHours: '2', semester: 'Semester 1' },
  { id: '5', name: 'Data Structures', score: '92', creditHours: '4', semester: 'Semester 2' },
  { id: '6', name: 'Database Systems', score: '87', creditHours: '3', semester: 'Semester 2' },
  { id: '7', name: 'Web Development', score: '95', creditHours: '3', semester: 'Semester 2' },
  { id: '8', name: 'Algorithms', score: '89', creditHours: '4', semester: 'Semester 2' },
]

export default function UniversityConvertPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [sourceCountry, setSourceCountry] = useState('Ghana')
  const [sourceUniversity, setSourceUniversity] = useState('ug')
  const [sourceSystem, setSourceSystem] = useState('ghana_gpa')
  const [targetSystem, setTargetSystem] = useState<'usa_gpa' | 'uk_percentage'>('usa_gpa')
  const [courses, setCourses] = useState<Course[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedSemester, setSelectedSemester] = useState('Semester 1')
  const [userId, setUserId] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    const premium = typeof window !== 'undefined' ? localStorage.getItem('isPremium') === 'true' : false
    setUserId(id)
    setIsPremium(premium)
  }, [])

  const handleAddCourse = (course: Course) => {
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? course : c))
      setEditingCourse(null)
    } else {
      setCourses([...courses, course])
    }
    setIsModalOpen(false)
  }

  const handleOpenAddModal = (semester?: string) => {
    setEditingCourse(null)
    if (semester) {
      setSelectedSemester(semester)
    }
    setIsModalOpen(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setSelectedSemester(course.semester)
    setIsModalOpen(true)
  }

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id))
  }

  const handleClearAll = () => {
    setCourses([])
  }

  const handleViewResults = async () => {
    if (courses.length === 0) {
      showToast('Please add at least one course to view results', 'error')
      return
    }

    setIsConverting(true)

    try {
      const response = await api.universityConverter.convert(sourceSystem, courses, targetSystem)
      
      if (!response.success || !response.data) {
        showToast(response.error || 'Failed to convert grades', 'error')
        return
      }

      const { data } = response

      const queryParams = new URLSearchParams({
        sourceSystem: data.sourceSystem,
        sourceUniversity,
        targetSystem: data.targetSystem,
        courses: JSON.stringify(data.courses),
        sourceScore: data.sourceScore.toString(),
        weightedAverage: data.weightedAverage.toString(),
        targetScore: data.targetScore.toString(),
        usaGpa: data.usaGpa.toString(),
        ukPercentage: data.ukPercentage.toString(),
        classification: JSON.stringify(data.degreeClassification)
      })

      router.push(`/university/results?${queryParams.toString()}`)
    } catch (err) {
      console.error('Error converting grades:', err)
      showToast('Failed to convert grades', 'error')
    } finally {
      setIsConverting(false)
    }
  }

  const handleSaveConversion = async () => {
    if (!userId) {
      showToast('Please login to save your conversion', 'error')
      router.push('/login')
      return
    }

    if (courses.length === 0) {
      showToast('Please add courses before saving', 'error')
      return
    }

    setIsSaving(true)

    try {
      const conversionResponse = await api.universityConverter.convert(sourceSystem, courses, targetSystem)
      
      if (!conversionResponse.success || !conversionResponse.data) {
        showToast(conversionResponse.error || 'Failed to convert grades', 'error')
        setIsSaving(false)
        return
      }

      const saveResponse = await api.universityConverter.save(
        parseInt(userId),
        conversionResponse.data
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

  const groupedCourses = SEMESTERS.reduce((acc, sem) => {
    const semCourses = courses.filter(c => c.semester === sem)
    if (semCourses.length > 0) {
      acc[sem] = semCourses
    }
    return acc
  }, {} as Record<string, Course[]>)

  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.creditHours) || 0), 0)
  const avgScore = courses.length > 0
    ? (courses.reduce((sum, c) => sum + (parseFloat(c.score) || 0), 0) / courses.length).toFixed(2)
    : '0.00'

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <section className="flex-1 bg-white py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                Your Country
              </label>
              <select
                value={sourceCountry}
                onChange={(e) => {
                  setSourceCountry(e.target.value)
                  const firstUniInCountry = INSTITUTIONS.find(uni => {
                    const system = GRADING_SYSTEMS[uni.gradingSystemId]
                    return uni.country === e.target.value && (!system.isPremium || isPremium)
                  })
                  if (firstUniInCountry) {
                    setSourceUniversity(firstUniInCountry.id)
                    setSourceSystem(firstUniInCountry.gradingSystemId)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
              >
                {Array.from(new Set(
                  INSTITUTIONS
                    .filter(uni => {
                      const system = GRADING_SYSTEMS[uni.gradingSystemId]
                      return !system.isPremium || isPremium
                    })
                    .map(uni => uni.country)
                )).map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                Your University
              </label>
              <select
                value={sourceUniversity}
                onChange={(e) => {
                  setSourceUniversity(e.target.value)
                  const uni = INSTITUTIONS.find(u => u.id === e.target.value)
                  if (uni) {
                    setSourceSystem(uni.gradingSystemId)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
              >
                {INSTITUTIONS
                  .filter(uni => {
                    const system = GRADING_SYSTEMS[uni.gradingSystemId]
                    return uni.country === sourceCountry && (!system.isPremium || isPremium)
                  })
                  .map(uni => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {GRADING_SYSTEMS[sourceSystem]?.name}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                Convert To
              </label>
              <select
                value={targetSystem}
                onChange={(e) => setTargetSystem(e.target.value as 'usa_gpa' | 'uk_percentage')}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
              >
                <option value="usa_gpa">USA GPA (4.0 Scale)</option>
                <option value="uk_percentage">UK Percentage (0-100)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Target grading system
              </p>
            </div>
          </div>

          <div className="mb-6">
            <TranscriptUpload
              isPremium={isPremium}
              onUpgrade={() => setShowPricingModal(true)}
              onUpload={(file) => {
                showToast(`Transcript uploaded: ${file.name}`, 'success')
              }}
              onCoursesExtracted={(extractedCourses) => {
                extractedCourses.forEach(course => {
                  const newCourse = {
                    id: Date.now().toString() + Math.random(),
                    name: course.name,
                    score: course.score?.toString() || '',
                    creditHours: course.credits.toString(),
                    semester: course.semester || 'Semester 1'
                  }
                  setCourses(prev => [...prev, newCourse])
                })
                showToast(`Auto-populated ${extractedCourses.length} courses from transcript`, 'success')
              }}
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Courses ({courses.length})
              </h2>
              <button
                onClick={() => {
                  setEditingCourse(null)
                  setIsModalOpen(true)
                }}
                className="px-4 py-2 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-xs"
              >
                + Add Course
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm mb-4">No courses added yet</p>
                <p className="text-gray-400 text-xs mb-4">
                  Add your university courses to calculate your GPA
                </p>
                <button
                  onClick={() => handleOpenAddModal()}
                  className="px-4 py-2 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm"
                >
                  Add First Course
                </button>
              </div>
            ) : (
              <>
                <CourseList
                  groupedCourses={groupedCourses}
                  mode="cwa-to-cgpa"
                  system={sourceSystem}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onAddCourse={handleOpenAddModal}
                  onUpdate={(id, updatedCourse) => {
                    setCourses(courses.map(c => 
                      c.id === id ? { ...c, ...updatedCourse } : c
                    ))
                  }}
                />

                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">Total Credits</p>
                    <p className="text-xl font-bold text-primary">{totalCredits.toFixed(1)}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs text-gray-600 mb-1">Average Score</p>
                    <p className="text-xl font-bold text-primary">{avgScore}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleViewResults}
                    disabled={isConverting}
                    className="flex-1 px-4 py-2 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConverting ? 'Converting...' : 'Calculate & View Results'}
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={isConverting}
                    className="flex-1 px-4 py-2 rounded font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CourseEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCourse(null)
        }}
        onSave={handleAddCourse}
        mode="cwa-to-cgpa"
        system={sourceSystem}
        initialCourse={editingCourse}
        defaultSemester={selectedSemester}
      />

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      <Footer />
    </main>
  )
}
