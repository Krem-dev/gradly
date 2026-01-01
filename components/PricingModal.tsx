'use client'

import { X, Check } from 'lucide-react'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'WASSCE calculator',
        'Grade conversion',
        'Basic recommendations'
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
        'Transcript upload',
        'Save profiles',
        'Priority support'
      ],
      cta: 'Buy Now',
      ctaLink: '#',
      highlighted: true
    },
    {
      name: 'Premium Plus',
      price: '$29.99',
      period: '/3 months',
      features: [
        'Everything in Premium',
        'Unlimited profiles',
        'Advanced analytics',
        'Expert consultation'
      ],
      cta: 'Buy Now',
      ctaLink: '#'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Upgrade Your Plan
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-5 transition-all border-2 ${
                  plan.highlighted
                    ? 'border-primary bg-primary bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded inline-block mb-3">
                    Popular
                  </div>
                )}
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 text-xs ml-1">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                    plan.highlighted
                      ? 'bg-primary text-white hover:bg-opacity-90'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
