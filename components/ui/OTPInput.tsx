'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

export default function OTPInput({
  length = 4,
  value,
  onChange,
  error,
  autoFocus = true,
}: {
  length?: number
  value: string
  onChange: (v: string) => void
  error?: boolean
  autoFocus?: boolean
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const setAt = (i: number, char: string) => {
    const chars = value.split('')
    chars[i] = char
    onChange(chars.join('').slice(0, length))
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(-1)
            setAt(i, v)
            if (v && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i] && i > 0) {
              refs.current[i - 1]?.focus()
              setAt(i - 1, '')
            }
            if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
            if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
            if (pasted) {
              e.preventDefault()
              onChange(pasted)
              refs.current[Math.min(pasted.length, length - 1)]?.focus()
            }
          }}
          className={cn(
            'h-14 w-12 sm:h-16 sm:w-14 rounded-xl bg-white text-center font-display text-2xl text-ink-900',
            'ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 outline-none transition-all',
            error && 'ring-danger/60 focus:ring-danger/60'
          )}
        />
      ))}
    </div>
  )
}
