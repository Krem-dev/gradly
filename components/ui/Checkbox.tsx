'use client'

import { useId } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function Checkbox({
  checked,
  onChange,
  children,
  className,
  required,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  children: React.ReactNode
  className?: string
  required?: boolean
  id?: string
}) {
  const reactId = useId()
  const inputId = id ?? `cb-${reactId}`
  return (
    <label
      htmlFor={inputId}
      className={cn('flex items-start gap-3 cursor-pointer group', className)}
    >
      <span className="relative inline-flex items-center justify-center mt-0.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          required={required}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            'h-5 w-5 rounded-md ring-1 transition-all',
            'ring-ink-200 bg-white group-hover:ring-ink-400',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-amber/60',
            'peer-checked:bg-ink-900 peer-checked:ring-ink-900'
          )}
        />
        <Check
          className={cn(
            'pointer-events-none absolute h-3.5 w-3.5 text-amber opacity-0 transition-opacity',
            checked && 'opacity-100'
          )}
          strokeWidth={3}
        />
      </span>
      <span className="text-sm text-ink-600 leading-snug">{children}</span>
    </label>
  )
}
