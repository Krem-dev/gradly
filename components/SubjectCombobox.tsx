'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'

interface SubjectComboboxProps {
  availableSubjects: string[]
  onSelectMultiple: (subjects: string[]) => void
}

export default function SubjectCombobox({
  availableSubjects,
  onSelectMultiple
}: SubjectComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSubjects = availableSubjects.filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const handleAddSelected = () => {
    if (selectedSubjects.length > 0) {
      onSelectMultiple(selectedSubjects)
      setSelectedSubjects([])
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm flex items-center gap-2"
      >
        <span>Add Subjects</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No subjects found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSubjects.map(subject => (
                  <label
                    key={subject}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900 flex-1">{subject}</span>
                    {selectedSubjects.includes(subject) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedSubjects.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">
                  {selectedSubjects.length} selected
                </span>
                <button
                  onClick={() => setSelectedSubjects([])}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              </div>
              <button
                onClick={handleAddSelected}
                className="w-full px-3 py-2 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-sm"
              >
                Add {selectedSubjects.length} {selectedSubjects.length === 1 ? 'Subject' : 'Subjects'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
