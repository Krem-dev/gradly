import Link from 'next/link'

export default function PricingComparison() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'WASSCE aggregate calculator',
        'Manual grade entry',
        'CWA ↔ CGPA conversion',
        'Basic university recommendations'
      ],
      cta: 'Get Started',
      ctaLink: '/start'
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      features: [
        'Everything in Free',
        'Transcript upload & parsing',
        'Save multiple profiles',
        'Detailed Ghana & global recommendations',
        'University match analysis',
        'Priority support'
      ],
      cta: 'Buy Now',
      ctaLink: '/pricing',
      highlighted: true
    },
    {
      name: 'Premium Plus',
      price: '$29.99',
      period: '/3 months',
      features: [
        'Everything in Premium',
        'Unlimited saved profiles',
        'Advanced analytics',
        'Expert consultation',
        'Application tracking',
        'Dedicated support'
      ],
      cta: 'Buy Now',
      ctaLink: '/pricing'
    }
  ]

  return (
    <section className="bg-gray-50 py-8 w-full">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Pricing
        </h2>
        <p className="text-gray-600 mb-8 text-sm">
          Choose the plan that fits your needs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-white border rounded-xl p-5 transition-all hover:shadow-xl ${
                plan.highlighted 
                  ? 'border-primary border-2 shadow-lg md:scale-105 ring-2 ring-primary ring-opacity-20' 
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-5">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-gray-600 text-xs ml-1">{plan.period}</span>
                )}
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={plan.ctaLink}
                className={`block text-center px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-primary text-white hover:bg-opacity-90 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
