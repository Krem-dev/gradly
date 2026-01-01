'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CourseEntryModal from '@/components/CourseEntryModal'
import CourseList from '@/components/CourseList'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

const GRADING_SYSTEMS = [
  { id: 'usa', label: 'USA (4.0 Scale)', scoreMax: 4.0 },
  { id: 'uk', label: 'UK (1-7 Scale)', scoreMax: 7 },
  { id: 'india', label: 'India (10 Scale)', scoreMax: 10 },
  { id: 'australia', label: 'Australia (7 Scale)', scoreMax: 7 },
  { id: 'canada', label: 'Canada (4.0 Scale)', scoreMax: 4.0 },
  { id: 'europe', label: 'Europe (ECTS)', scoreMax: 100 }
]

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

export default function ConvertPage() {
  const [mode, setMode] = useState<'cwa-to-cgpa' | 'cgpa-to-cwa'>('cwa-to-cgpa')
  const [system, setSystem] = useState('usa')
  const [courses, setCourses] = useState<Course[]>(DUMMY_COURSES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedSemester, setSelectedSemester] = useState('Semester 1')

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
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <section className="bg-white py-8 w-full">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Convert Your Scores
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your grades to get accurate conversion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('cwa-to-cgpa')}
                  className={`flex-1 px-3 py-1.5 rounded font-semibold transition-all text-xs ${
                    mode === 'cwa-to-cgpa'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  CWA → CGPA
                </button>
                <button
                  onClick={() => setMode('cgpa-to-cwa')}
                  className={`flex-1 px-3 py-1.5 rounded font-semibold transition-all text-xs ${
                    mode === 'cgpa-to-cwa'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  CGPA → CWA
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-2">
                System
              </label>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
              >
                {GRADING_SYSTEMS.map(sys => (
                  <option key={sys.id} value={sys.id}>
                    {sys.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Courses ({courses.length})
              </h2>
              <button
                onClick={() => {
                  setEditingCourse(null)
                  setIsModalOpen(true)
                }}
                className="px-4 py-1.5 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-xs"
              >
                + Add
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-3">No courses added yet</p>
                <button
                  onClick={() => handleOpenAddModal()}
                  className="px-4 py-1.5 rounded font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all text-xs"
                >
                  Add First Course
                </button>
              </div>
            ) : (
              <>
                <CourseList
                  groupedCourses={groupedCourses}
                  mode={mode}
                  system={system}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
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
                    onClick={() => console.log('View Results', { mode, system, courses })}
                    className="flex-1 px-4 py-2 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm"
                  >
                    View Results
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2 rounded font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-sm"
                  >
                    Clear
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
        mode={mode}
        system={system}
        initialCourse={editingCourse}
        defaultSemester={selectedSemester}
      />

      <Footer />
    </main>
  )
}
