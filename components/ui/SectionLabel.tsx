import { cn } from '@/lib/cn'

export default function SectionLabel({
  children,
  number,
  className,
  tone = 'dark',
}: {
  children: React.ReactNode
  number?: string
  className?: string
  tone?: 'dark' | 'light'
}) {
  const color = tone === 'dark' ? 'text-ink-500' : 'text-ink-300'
  return (
    <div
      className={cn(
        'flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]',
        color,
        className
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" aria-hidden />
      <span>
        {children}
        {number && <span className="opacity-60">({number})</span>}
      </span>
    </div>
  )
}
