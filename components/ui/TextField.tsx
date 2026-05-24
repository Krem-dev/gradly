'use client'

import { forwardRef, useId, useState, InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  icon?: React.ReactNode
  hint?: string
  error?: string
  togglePassword?: boolean
}

const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, icon, hint, error, type = 'text', togglePassword, className, id, ...rest },
  ref
) {
  const reactId = useId()
  const inputId = id ?? `tf-${reactId}`
  const [show, setShow] = useState(false)
  const isPassword = type === 'password' || togglePassword
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500"
      >
        {label}
      </label>
      <div className="relative mt-2">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          {...rest}
          className={cn(
            'w-full h-12 rounded-xl bg-white text-ink-900 placeholder-ink-300',
            'ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 hover:ring-ink-300',
            'transition-all outline-none text-base',
            'px-4',
            icon && 'pl-11',
            isPassword && 'pr-11',
            error && 'ring-danger/60 focus:ring-danger/60'
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
})

export default TextField
