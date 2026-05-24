import { cn } from '@/lib/cn'

export default function Section({
  children,
  className,
  tone = 'surface',
  id,
}: {
  children: React.ReactNode
  className?: string
  tone?: 'surface' | 'alt' | 'muted' | 'ink'
  id?: string
}) {
  const tones = {
    surface: 'bg-surface text-ink-800',
    alt: 'bg-surface-alt text-ink-800',
    muted: 'bg-surface-muted text-ink-800',
    ink: 'bg-ink-900 text-white',
  }[tone]

  return (
    <section id={id} className={cn('relative w-full py-20 md:py-32', tones, className)}>
      {children}
    </section>
  )
}
