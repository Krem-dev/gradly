import { cn } from '@/lib/cn'

export default function Card({
  children,
  className,
  tone = 'surface',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'surface' | 'ink' | 'muted'
}) {
  const tones = {
    surface: 'bg-white ring-1 ring-ink-100 shadow-soft',
    muted: 'bg-surface-muted ring-1 ring-ink-100',
    ink: 'bg-ink-900 text-white ring-1 ring-white/10',
  }[tone]
  return (
    <div className={cn('rounded-3xl p-6 sm:p-8', tones, className)}>
      {children}
    </div>
  )
}
