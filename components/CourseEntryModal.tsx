'use client'

import { useState, useEffect } from 'react'
import { GRADING_SYSTEMS, GRADE_POINT_SCALES } from '@/lib/gradingSystems'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

interface CourseEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (course: Course) => void
  mode: 'cwa-to-cgpa' | 'cgpa-to-cwa'
  system: string
  initialCourse: Course | null
  defaultSemester?: string
}

const SEMESTERS = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
]

const SYSTEM_SCALES: Record<string, { max: number; label: string }> = {
  usa: { max: 4.0, label: 'USA (0-4.0)' },
  uk: { max: 7, label: 'UK (0-7)' },
  india: { max: 10, label: 'India (0-10)' },
  australia: { max: 7, label: 'Australia (0-7)' },
  canada: { max: 4.0, label: 'Canada (0-4.0)' },
  europe: { max: 100, label: 'Europe (0-100)' }
}

export default function CourseEntryModal({
  isOpen,
  onClose,
  onSave,
  mode,
  system,
  initialCourse,
  defaultSemester = 'Semester 1'
}: CourseEntryModalProps) {
  const [name, setName] = useState('')
  const [score, setScore] = useState('')
  const [creditHours, setCreditHours] = useState('')
  const [semester, setSemester] = useState('Semester 1')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialCourse) {
      setName(initialCourse.name)
      setScore(initialCourse.score)
      setCreditHours(initialCourse.creditHours)
      setSemester(initialCourse.semester)
    } else {
      setName('')
      setScore('')
      setCreditHours('')
      setSemester(defaultSemester)
    }
    setError('')
  }, [initialCourse, isOpen, defaultSemester])

  const gradingSystem = GRADING_SYSTEMS[system]
  const isLetterGradeSystem = gradingSystem?.type === 'gpa' || gradingSystem?.type === 'cgpa'
  const gradeOptions = isLetterGradeSystem ? GRADE_POINT_SCALES[system] : null
  const scoreMax = gradingSystem?.scale.max || 100

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Course name is required')
      return
    }

    if (!score) {
      setError('Score is required')
      return
    }

    if (isLetterGradeSystem) {
      if (!gradeOptions || !gradeOptions[score]) {
        setError('Please select a valid grade')
        return
      }
    } else {
      const scoreNum = parseFloat(score)
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > scoreMax) {
        setError(`Score must be between 0 and ${scoreMax}`)
        return
      }
    }

    if (!creditHours) {
      setError('Credit hours are required')
      return
    }

    const creditsNum = parseFloat(creditHours)
    if (isNaN(creditsNum) || creditsNum <= 0) {
      setError('Credit hours must be greater than 0')
      return
    }

    const course: Course = {
      id: initialCourse?.id || String(Date.now()),
      name: name.trim(),
      score: isLetterGradeSystem && gradeOptions ? gradeOptions[score].toString() : score,
      creditHours,
      semester
    }

    onSave(course)
    setName('')
    setScore('')
    setCreditHours('')
    setSemester('Semester 1')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {initialCourse ? 'Edit' : 'Add'} Course
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
            >
              {SEMESTERS.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              Course Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Math"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                {isLetterGradeSystem ? 'Grade' : 'Score'}
              </label>
              {isLetterGradeSystem && gradeOptions ? (
                <select
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
                >
                  <option value="">Select grade</option>
                  {Object.entries(gradeOptions).map(([grade, points]) => (
                    <option key={grade} value={grade}>
                      {grade} ({points})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="85"
                  step="1"
                  min="0"
                  max={scoreMax}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Credits
              </label>
              <input
                type="number"
                value={creditHours}
                onChange={(e) => setCreditHours(e.target.value)}
                placeholder="3"
                min="0"
                step="0.5"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-1.5 rounded font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-xs"
            >
              {initialCourse ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
