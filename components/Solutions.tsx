import { Calculator, Globe, Brain, TrendingUp } from 'lucide-react'

export default function Solutions() {
  const solutions = [
    {
      icon: Calculator,
      title: 'WASSCE Aggregate Calculator',
      description: 'Instantly calculate your WASSCE aggregate using our proven algorithm. Get accurate results in seconds and understand your academic standing.'
    },
    {
      icon: Globe,
      title: 'Global Grade Conversion',
      description: 'Convert your grades to USA GPA, UK percentages, and other international standards. Perfect for international university applications.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized university recommendations based on your grades, interests, and career goals. Discover opportunities you never knew existed.'
    },
    {
      icon: TrendingUp,
      title: 'Academic Analytics',
      description: 'Understand your academic performance with detailed insights. Track your progress and identify areas for improvement.'
    }
  ]

  return (
    <section className="bg-gray-50 py-16 w-full">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Comprehensive Academic Solutions
          </h2>
          <p className="text-gray-600 text-sm">
            Everything you need to succeed academically and beyond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
