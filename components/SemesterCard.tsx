'use client'

import { useState } from 'react'

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

interface SemesterCardProps {
  semester: Semester
  mode: 'cwa-to-cgpa' | 'cgpa-to-cwa'
  onAddCourse: () => void
  onRemoveCourse: (courseId: string) => void
  onRemoveSemester: () => void
  onUpdateCourse: (courseId: string, field: keyof Course, value: string) => void
}

export default function SemesterCard({
  semester,
  mode,
  onAddCourse,
  onRemoveCourse,
  onRemoveSemester,
  onUpdateCourse
}: SemesterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          {semester.name}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {semester.courses.length} course{semester.courses.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemoveSemester()
            }}
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
          >
            Remove
          </button>
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-4">
          {semester.courses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No courses added yet
            </p>
          ) : (
            semester.courses.map((course) => (
              <CourseEntry
                key={course.id}
                course={course}
                mode={mode}
                onRemove={() => onRemoveCourse(course.id)}
                onUpdate={(field, value) =>
                  onUpdateCourse(course.id, field, value)
                }
              />
            ))
          )}

          <button
            onClick={onAddCourse}
            className="w-full px-4 py-2 rounded-lg font-semibold text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all text-sm"
          >
            + Add Course
          </button>
        </div>
      )}
    </div>
  )
}

interface CourseEntryProps {
  course: Course
  mode: 'cwa-to-cgpa' | 'cgpa-to-cwa'
  onRemove: () => void
  onUpdate: (field: keyof Course, value: string) => void
}

function CourseEntry({ course, mode, onRemove, onUpdate }: CourseEntryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Course Name
          </label>
          <input
            type="text"
            value={course.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="e.g., Mathematics"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            {mode === 'cwa-to-cgpa' ? 'Score (0-100)' : 'CGPA (0-4.0)'}
          </label>
          <input
            type="number"
            value={course.score}
            onChange={(e) => onUpdate('score', e.target.value)}
            placeholder={mode === 'cwa-to-cgpa' ? '85' : '3.5'}
            step={mode === 'cwa-to-cgpa' ? '1' : '0.01'}
            min="0"
            max={mode === 'cwa-to-cgpa' ? '100' : '4'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Credit Hours
          </label>
          <input
            type="number"
            value={course.creditHours}
            onChange={(e) => onUpdate('creditHours', e.target.value)}
            placeholder="3"
            min="0"
            step="0.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 font-semibold text-sm"
        >
          Remove Course
        </button>
      </div>
    </div>
  )
}
