'use client'

import { useState } from 'react'
import { X, Search } from 'lucide-react'

interface SubjectSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (subject: string) => void
  availableSubjects: string[]
}

export default function SubjectSelectorModal({
  isOpen,
  onClose,
  onSelect,
  availableSubjects
}: SubjectSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const filteredSubjects = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (subject: string) => {
    onSelect(subject)
    setSearchQuery('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Select Subject</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No subjects found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredSubjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => handleSelect(subject)}
                  className="px-4 py-3 text-left text-sm bg-gray-50 hover:bg-primary hover:text-white rounded-lg transition-all border border-gray-200 hover:border-primary font-medium"
                >
                  {subject}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
