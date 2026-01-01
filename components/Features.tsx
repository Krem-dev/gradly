import { Calculator, Globe, Zap, BarChart3, Lock, Clock, CheckCircle } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Calculator,
      title: 'WASSCE Calculator',
      description: 'Instantly calculate your WASSCE aggregate with our accurate algorithm'
    },
    {
      icon: Globe,
      title: 'Global Conversions',
      description: 'Convert your grades to USA GPA, UK percentages, and more'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'Get personalized university recommendations based on your grades'
    },
    {
      icon: BarChart3,
      title: 'Grade Analysis',
      description: 'Understand your academic performance with detailed insights'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get results in seconds, not hours or days'
    }
  ]

  return (
    <section className="bg-gray-50 py-16 w-full">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Powerful Features
          </h2>
          <p className="text-gray-600 text-sm">
            Everything you need to succeed academically
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex gap-4 bg-white rounded-lg p-6 border border-gray-200 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
