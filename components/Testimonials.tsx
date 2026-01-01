'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Ama Osei',
      school: 'University of Ghana',
      text: 'Gradly helped me understand my GPA conversion perfectly. The recommendations were spot-on for my university applications.',
      rating: 5
    },
    {
      name: 'Kwame Mensah',
      school: 'Ashesi University',
      text: 'I used Gradly to calculate my WASSCE aggregate and it saved me so much time. The interface is intuitive and accurate.',
      rating: 5
    },
    {
      name: 'Abena Boateng',
      school: 'KNUST',
      text: 'The university recommendations feature is incredible. It showed me options I never considered. Highly recommend!',
      rating: 5
    },
    {
      name: 'Kofi Adomako',
      school: 'University of Cape Coast',
      text: 'Best tool I\'ve used for grade conversion. Saved me hours of manual calculations and research.',
      rating: 5
    }
  ]

  const [scrollPosition, setScrollPosition] = useState(0)
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  useEffect(() => {
    const timer = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1
        if (newPosition >= testimonials.length * 320) {
          return 0
        }
        return newPosition
      })
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-white py-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Trusted by Students
          </h2>
          <p className="text-gray-600 text-base">
            See what students across Ghana are saying about Gradly
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div
            className="flex gap-6 transition-transform"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              transitionDuration: '0ms'
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-72 h-40 bg-secondary rounded-lg border border-primary p-3 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex gap-0.5 mb-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-gray-800 text-xs mb-2 leading-tight italic font-medium line-clamp-2">
                  "{testimonial.text}"
                </p>
                <div className="pt-1 border-t border-gray-300">
                  <p className="font-bold text-gray-900 text-xs">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-primary font-semibold">
                    {testimonial.school}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
