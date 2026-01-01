'use client'

interface SubscriptionBannerProps {
  title: string
  description: string
  itemsShown: number
  totalItems: number
  onUpgrade?: () => void
}

export default function SubscriptionBanner({
  title,
  description,
  itemsShown,
  totalItems,
  onUpgrade
}: SubscriptionBannerProps) {
  return (
    <div className="bg-gradient-to-r from-secondary to-yellow-300 rounded-lg p-4 mb-6 border border-primary">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-700">
            {description} <span className="font-semibold">{itemsShown} of {totalItems}</span>
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="px-4 py-1.5 rounded font-semibold bg-primary text-white hover:bg-opacity-90 transition-all text-xs whitespace-nowrap flex-shrink-0"
        >
          Upgrade
        </button>
      </div>
    </div>
  )
}
