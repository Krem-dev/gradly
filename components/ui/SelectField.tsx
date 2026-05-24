'use client'

import { forwardRef, useId, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string
  hint?: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

const SelectField = forwardRef<HTMLSelectElement, Props>(function SelectField(
  { label, hint, error, options, placeholder, className, id, ...rest },
  ref
) {
  const reactId = useId()
  const inputId = id ?? `sf-${reactId}`

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500"
      >
        {label}
      </label>
      <div className="relative mt-2">
        <select
          ref={ref}
          id={inputId}
          {...rest}
          className={cn(
            'w-full h-12 rounded-xl bg-white text-ink-900',
            'ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 hover:ring-ink-300',
            'transition-all outline-none text-base',
            'px-4 pr-11 appearance-none cursor-pointer',
            error && 'ring-danger/60 focus:ring-danger/60'
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
})

export default SelectField
