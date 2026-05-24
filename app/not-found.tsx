import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      <header className="w-full px-5 py-5 lg:px-10 lg:py-7 border-b border-ink-100/70">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="relative">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-900 text-white font-display text-xl leading-none">G</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber" />
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-900">Gradly</span>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center py-20">
        <Container size="default" className="text-center">
          <SectionLabel>404 · page not found</SectionLabel>
          <h1 className="font-display mt-4 text-display-lg md:text-display-xl text-ink-900 [text-wrap:balance]">
            We couldn&apos;t find <span className="italic text-amber-dark">that page.</span>
          </h1>
          <p className="mt-5 text-base text-ink-500 max-w-md mx-auto leading-relaxed">
            The link might be old, the page might have moved, or it never existed in the first place. Let&apos;s get you back to something useful.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button variant="pill" size="lg" href="/">Back to home</Button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-5 py-3 text-sm text-ink-700 transition-colors"
            >
              Open dashboard
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
