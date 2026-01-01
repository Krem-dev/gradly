import Link from 'next/link'
import { GraduationCap, Building2, Globe } from 'lucide-react'

export default function WhoWeServe() {
  const segments = [
    {
      icon: GraduationCap,
      title: 'SHS Students',
      description: 'Calculate WASSCE aggregates, explore university options, and plan your academic future with confidence.',
      link: '/start'
    },
    {
      icon: Building2,
      title: 'University Students',
      description: 'Convert your grades globally, understand your academic standing, and discover international opportunities.',
      link: '/start'
    },
    {
      icon: Globe,
      title: 'Institutions',
      description: 'Integrate Gradly into your institution to help students with accurate grade conversions and recommendations.',
      link: '/contact'
    }
  ]

  return (
    <section className="bg-white py-16 w-full">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Who We Serve
          </h2>
          <p className="text-gray-600 text-sm">
            Tailored solutions for every stage of your academic journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((segment, index) => {
            const Icon = segment.icon
            return (
              <Link key={index} href={segment.link}>
                <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {segment.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {segment.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
