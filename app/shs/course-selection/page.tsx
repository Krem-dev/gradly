'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { BookOpen, Beaker, Briefcase, Palette, ChevronRight } from 'lucide-react'

interface CourseStream {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  subjects: string[]
}

const courseStreams: CourseStream[] = [
  {
    id: 'science',
    name: 'General Science',
    description: 'Physics, Chemistry, Biology, Mathematics',
    icon: <Beaker className="w-8 h-8" />,
    color: 'from-primary to-primary/80',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Integrated Science']
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Accounting, Business Management, Economics, Mathematics',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'from-primary/90 to-primary/70',
    subjects: ['Accounting', 'Business Management', 'Economics', 'Mathematics', 'Elective Maths']
  },
  {
    id: 'agricultural-science',
    name: 'Agricultural Science',
    description: 'Agriculture, Biology, Chemistry, Mathematics',
    icon: <Beaker className="w-8 h-8" />,
    color: 'from-primary/80 to-primary/60',
    subjects: ['Agriculture', 'Biology', 'Chemistry', 'Mathematics', 'Integrated Science']
  },
  {
    id: 'arts',
    name: 'General Arts',
    description: 'History, Economics, Government, Literature',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-primary/70 to-primary/50',
    subjects: ['History', 'Economics', 'Government', 'Literature in English', 'Elective English']
  },
  {
    id: 'home-economics',
    name: 'Home Economics',
    description: 'Home Economics, Foods, Clothing, Management in Living',
    icon: <Palette className="w-8 h-8" />,
    color: 'from-primary/60 to-primary/40',
    subjects: ['Home Economics', 'Foods & Nutrition', 'Clothing & Textiles', 'Management in Living']
  },
  {
    id: 'visual-arts',
    name: 'Visual Arts',
    description: 'Art, Music, Drama, Design',
    icon: <Palette className="w-8 h-8" />,
    color: 'from-primary/50 to-primary/30',
    subjects: ['Art', 'Music', 'Drama', 'Design', 'Painting', 'Sculpture']
  }
]

export default function CourseSelectionPage() {
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedCourse) {
      router.push(`/shs/calculator?course=${selectedCourse}`)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <section className="flex-1 bg-white py-6 md:py-12 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Select Your SHS Course Stream
            </h1>
            <p className="text-gray-600 text-sm md:text-lg">
              Choose your course stream to get personalized university recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 mb-8">
            {courseStreams.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`cursor-pointer rounded-lg border border-primary p-4 transition-all duration-300 h-48 flex flex-col ${
                  selectedCourse === course.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                } bg-secondary`}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {course.name}
                </h3>

                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {course.description}
                </p>

                {selectedCourse === course.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-primary">✓ Selected</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center px-4">
            <button
              onClick={handleContinue}
              disabled={!selectedCourse}
              className="px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
            >
              Continue to Calculator
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
