import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'

export default function DashboardLoading() {
  return (
    <AppShell>
      <section className="bg-ink-900 text-white relative overflow-hidden">
        <Container size="wide" className="relative py-14 md:py-20">
          <div className="h-3 w-24 rounded-full bg-white/10 animate-pulse" />
          <div className="mt-6 h-12 w-3/5 max-w-lg rounded-2xl bg-white/10 animate-pulse" />
          <div className="mt-4 h-4 w-1/3 max-w-md rounded-full bg-white/10 animate-pulse" />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl ring-1 ring-white/10 bg-white/[0.04] p-6 h-32 animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-ink-50 animate-pulse"
                />
              ))}
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-64 rounded-[28px] bg-ink-900/95 animate-pulse" />
              <div className="h-44 rounded-[28px] bg-surface-muted animate-pulse" />
              <div className="h-56 rounded-[28px] bg-white ring-1 ring-ink-100 animate-pulse" />
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  )
}
