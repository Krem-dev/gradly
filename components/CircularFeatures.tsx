'use client'

import { useState, useEffect, useRef } from 'react'
import { Calculator, Globe, Zap, BarChart3, Lock, Clock } from 'lucide-react'

export default function CircularFeatures() {
  const features = [
    {
      icon: Calculator,
      title: 'WASSCE Calculator',
      description: 'Instantly calculate your WASSCE aggregate'
    },
    {
      icon: Globe,
      title: 'Global Conversions',
      description: 'Convert grades to USA GPA, UK percentages'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'Personalized university recommendations'
    },
    {
      icon: BarChart3,
      title: 'Grade Analysis',
      description: 'Detailed academic performance insights'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get results in seconds'
    }
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [angle, setAngle] = useState(0)
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (isAnimationPaused) return

    let currentAngle = 0
    let stepIndex = 0
    let rotating = true

    const rotate = () => {
      if (rotating && !isAnimationPaused) {
        currentAngle += 0.3
        const tick = 360 / features.length
        if (currentAngle >= stepIndex * tick + tick) {
          stepIndex = (stepIndex + 1) % features.length
          setActiveIndex(stepIndex)
          rotating = false
          window.setTimeout(() => {
            rotating = true
          }, 5000)
        }
        setAngle(currentAngle)
        if (animationRef.current !== null) {
          animationRef.current = window.requestAnimationFrame(rotate)
        }
      } else if (!isAnimationPaused) {
        animationRef.current = window.requestAnimationFrame(rotate)
      }
    }

    animationRef.current = window.requestAnimationFrame(rotate)
    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimationPaused, features.length])

  return (
    <section className="bg-white py-12 md:py-32 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 md:mb-28">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
            Everything you need to succeed academically
          </p>
        </div>

        <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
          <div className="absolute w-40 md:w-64 h-40 md:h-64 bg-white rounded-full border-3 border-primary shadow-xl flex flex-col items-center justify-center z-20">
            <div className="text-center">
              <h3 className="text-xl md:text-3xl font-bold text-primary mb-1">
                Gradly
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                Academic Excellence
              </p>
            </div>
          </div>

          <div
            className="absolute w-full h-full flex justify-center items-center"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              const angleDeg = (index * 360) / features.length
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
              const radius = isMobile ? 150 : 300
              const x = Math.cos((angleDeg * Math.PI) / 180) * radius
              const y = Math.sin((angleDeg * Math.PI) / 180) * radius
              const isActive = index === activeIndex

              return (
                <div
                  key={index}
                  className="absolute transition-all duration-500"
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${-angle}deg)`,
                    zIndex: isActive ? 10 : 5
                  }}
                >
                  <div
                    className={`rounded-lg p-2 md:p-4 cursor-pointer transition-all duration-300 w-28 md:w-44 text-center ${
                      isActive
                        ? 'bg-primary text-white shadow-xl scale-105 border-2 border-primary'
                        : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary hover:shadow-md'
                    }`}
                    onClick={() => {
                      setActiveIndex(index)
                      setIsAnimationPaused(true)
                      setTimeout(() => setIsAnimationPaused(false), 5000)
                    }}
                  >
                    <div className="flex justify-center mb-1 md:mb-3">
                      <Icon className={`w-4 h-4 md:w-6 md:h-6 ${isActive ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <h4 className={`font-bold text-xs md:text-base mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-xs md:text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8 md:mt-16">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-primary w-3 h-3'
                  : 'bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400'
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
