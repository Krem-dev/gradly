'use client'

import { useState } from 'react'
import { Edit2, Trash2, Check, X } from 'lucide-react'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

interface CourseListProps {
  groupedCourses: Record<string, Course[]>
  mode: 'cwa-to-cgpa' | 'cgpa-to-cwa'
  system: string
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onAddCourse: (semester: string) => void
  onUpdate?: (id: string, updatedCourse: Partial<Course>) => void
}

export default function CourseList({
  groupedCourses,
  mode,
  system,
  onEdit,
  onDelete,
  onAddCourse,
  onUpdate
}: CourseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Course>>({})
  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto">
      {Object.entries(groupedCourses).map(([semester, courses]) => {
        const semesterTotal = courses.reduce((sum, c) => sum + (parseFloat(c.creditHours) || 0), 0)
        const semesterAvg = courses.length > 0
          ? (courses.reduce((sum, c) => sum + (parseFloat(c.score) || 0), 0) / courses.length).toFixed(2)
          : '0.00'

        return (
          <div key={semester} className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-xs">{semester}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">Course</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-900">Score</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-900">Credits</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const isEditing = editingId === course.id
                    const currentName = isEditing ? (editValues.name || course.name) : course.name
                    const currentScore = isEditing ? (editValues.score || course.score) : course.score
                    const currentCredits = isEditing ? (editValues.creditHours || course.creditHours) : course.creditHours

                    return (
                      <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 text-gray-900 font-medium">
                          {isEditing ? (
                            <input
                              type="text"
                              value={currentName}
                              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
                            />
                          ) : (
                            course.name
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-gray-700">
                          {isEditing ? (
                            <input
                              type="number"
                              value={currentScore}
                              onChange={(e) => setEditValues({ ...editValues, score: e.target.value })}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary text-center"
                              min="0"
                              max="100"
                            />
                          ) : (
                            course.score
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-gray-700">
                          {isEditing ? (
                            <input
                              type="number"
                              value={currentCredits}
                              onChange={(e) => setEditValues({ ...editValues, creditHours: e.target.value })}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-primary text-center"
                              min="0"
                              max="12"
                            />
                          ) : (
                            course.creditHours
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex gap-1.5 justify-center">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => {
                                    if (onUpdate) {
                                      onUpdate(course.id, editValues)
                                    }
                                    setEditingId(null)
                                    setEditValues({})
                                  }}
                                  className="p-1.5 rounded text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingId(null)
                                    setEditValues({})
                                  }}
                                  className="p-1.5 rounded text-gray-600 hover:bg-gray-600 hover:text-white transition-all"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingId(course.id)
                                    setEditValues({ name: course.name, score: course.score, creditHours: course.creditHours })
                                  }}
                                  className="p-1.5 rounded text-primary hover:bg-primary hover:text-white transition-all"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDelete(course.id)}
                                  className="p-1.5 rounded text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
              <div className="flex gap-4">
                <span className="text-gray-600">
                  Credits: <span className="font-semibold text-gray-900">{semesterTotal.toFixed(1)}</span>
                </span>
                <span className="text-gray-600">
                  Avg: <span className="font-semibold text-gray-900">{semesterAvg}</span>
                </span>
              </div>
              <button
                onClick={() => onAddCourse(semester)}
                className="px-2.5 py-0.5 rounded text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all"
              >
                + Add
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
