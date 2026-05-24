import { cn } from '@/lib/cn'

export default function Container({
  children,
  className,
  size = 'default',
}: {
  children: React.ReactNode
  className?: string
  size?: 'narrow' | 'default' | 'wide' | 'full'
}) {
  const max = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-[1600px]',
  }[size]
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8 lg:px-10', max, className)}>
      {children}
    </div>
  )
}
