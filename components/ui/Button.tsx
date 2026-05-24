'use client'

import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'pill'

interface BaseProps {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
  withArrow?: boolean
  /** When true, the trailing arrow becomes a spinner and the button is disabled. */
  loading?: boolean
  disabled?: boolean
}

type ButtonAsLink = BaseProps & { href: string; onClick?: never; type?: never }
type ButtonAsBtn = BaseProps & {
  href?: undefined
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
}
type ButtonProps = ButtonAsLink | ButtonAsBtn

const base =
  'inline-flex items-center gap-2 rounded-pill font-medium tracking-tight transition-all duration-200 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

const sizes = {
  sm: 'h-9 pl-4 pr-2 text-sm gap-1.5',
  md: 'h-11 pl-5 pr-2 text-sm gap-2',
  lg: 'h-14 pl-7 pr-3 text-base gap-3',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-800 shadow-soft hover:shadow-lift',
  secondary:
    'bg-white text-ink-900 ring-1 ring-ink-100 hover:ring-ink-300 shadow-soft',
  ghost:
    'bg-transparent text-ink-800 hover:bg-ink-50',
  pill:
    'bg-amber text-ink-900 hover:bg-amber-light shadow-soft hover:shadow-lift',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  withArrow = true,
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const arrowBg = variant === 'pill' ? 'bg-ink-900 text-amber' : 'bg-amber text-ink-900'
  const arrowSize = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
  const showCircle = withArrow || loading

  const content = (
    <>
      <span className="px-1">{children}</span>
      {showCircle && (
        <span
          className={cn(
            'flex items-center justify-center rounded-full transition-transform duration-300',
            loading ? '' : 'group-hover:translate-x-0.5',
            arrowBg,
            arrowSize
          )}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" />
          )}
        </span>
      )}
    </>
  )

  const classes = cn('group', base, sizes[size], variants[variant], className)

  if ('href' in rest && rest.href !== undefined) {
    if (loading || disabled) {
      // Don't navigate while loading/disabled — render as a plain span
      return <span className={cn(classes, 'opacity-60 cursor-not-allowed')}>{content}</span>
    }
    return (
      <Link href={rest.href} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <button
      type={(rest as ButtonAsBtn).type ?? 'button'}
      onClick={(rest as ButtonAsBtn).onClick}
      disabled={loading || disabled}
      className={classes}
    >
      {content}
    </button>
  )
}
