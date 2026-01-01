'use client'

import { useState } from 'react'
import SemesterCard from './SemesterCard'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
}

interface Semester {
  id: string
  name: string
  courses: Course[]
}

interface ConvertFormProps {
  mode: 'cwa-to-cgpa' | 'cgpa-to-cwa'
}

export default function ConvertForm({ mode }: ConvertFormProps) {
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: '1',
      name: 'Semester 1',
      courses: []
    }
  ])

  const addSemester = () => {
    const newId = String(semesters.length + 1)
    setSemesters([
      ...semesters,
      {
        id: newId,
        name: `Semester ${newId}`,
        courses: []
      }
    ])
  }

  const removeSemester = (id: string) => {
    setSemesters(semesters.filter(s => s.id !== id))
  }

  const addCourse = (semesterId: string) => {
    setSemesters(
      semesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: [
              ...semester.courses,
              {
                id: String(semester.courses.length + 1),
                name: '',
                score: '',
                creditHours: ''
              }
            ]
          }
        }
        return semester
      })
    )
  }

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(
      semesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: semester.courses.filter(c => c.id !== courseId)
          }
        }
        return semester
      })
    )
  }

  const updateCourse = (
    semesterId: string,
    courseId: string,
    field: keyof Course,
    value: string
  ) => {
    setSemesters(
      semesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: semester.courses.map(course => {
              if (course.id === courseId) {
                return { ...course, [field]: value }
              }
              return course
            })
          }
        }
        return semester
      })
    )
  }

  const handleViewResults = () => {
    console.log('View Results', { mode, semesters })
  }

  const handleClearAll = () => {
    setSemesters([
      {
        id: '1',
        name: 'Semester 1',
        courses: []
      }
    ])
  }

  return (
    <div>
      <div className="space-y-4 mb-8">
        {semesters.map((semester) => (
          <SemesterCard
            key={semester.id}
            semester={semester}
            mode={mode}
            onAddCourse={() => addCourse(semester.id)}
            onRemoveCourse={(courseId) => removeCourse(semester.id, courseId)}
            onRemoveSemester={() => removeSemester(semester.id)}
            onUpdateCourse={(courseId, field, value) =>
              updateCourse(semester.id, courseId, field, value)
            }
          />
        ))}
      </div>

      <button
        onClick={addSemester}
        className="mb-8 px-6 py-3 rounded-lg font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all"
      >
        + Add Semester
      </button>

      <div className="flex gap-4">
        <button
          onClick={handleViewResults}
          className="px-8 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          View Results
        </button>
        <button
          onClick={handleClearAll}
          className="px-8 py-3 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
