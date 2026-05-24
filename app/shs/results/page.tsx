'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { School, Printer, RefreshCw, ArrowUpRight } from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'

interface SubjectGrade {
  subject: string
  grade: string
  points: number
}

interface ProgramItem {
  university: string
  universityName: string
  program: string
  cutoff: number
}

export default function Page() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <SHSResultsPage />
    </Suspense>
  )
}

function ResultsFallback() {
  return (
    <AppShell>
      <section className="py-32 text-center">
        <p className="text-sm font-mono uppercase tracking-[0.18em] text-ink-500">Loading results…</p>
      </section>
    </AppShell>
  )
}

function SHSResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [aggregate, setAggregate] = useState<number>(0)
  const [subjects, setSubjects] = useState<SubjectGrade[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const aggregateParam = searchParams.get('aggregate')
    const subjectsParam = searchParams.get('subjects')
    if (aggregateParam) setAggregate(parseInt(aggregateParam))
    if (subjectsParam) {
      try {
        setSubjects(JSON.parse(decodeURIComponent(subjectsParam)))
      } catch (e) {
        console.error('Error parsing subjects:', e)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (aggregate > 0) fetchRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregate])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError('')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      // Send subjects when available so the backend can apply KNUST's C4=C5=C6=4 rule
      // for KNUST programmes specifically. Fall back to aggregate-only for legacy URLs.
      const body =
        subjects.length > 0
          ? { subjects: subjects.map((s) => ({ name: s.subject, grade: s.grade })) }
          : { aggregate }
      const response = await fetch(`${apiUrl}/recommendations/universities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const data = await response.json()
      setRecommendations(data.universities || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const eligiblePrograms: ProgramItem[] = recommendations
    .flatMap((u: any) =>
      u.programs.map((p: any) => ({
        university: u.university,
        universityName: u.universityName,
        program: p.name,
        cutoff: p.cutoffAggregate,
      }))
    )
    .sort((a, b) => a.cutoff - b.cutoff)

  const universityCount = new Set(eligiblePrograms.map((p) => p.university)).size

  if (!aggregate) {
    return (
      <AppShell>
        <section className="py-20">
          <Container size="default" className="text-center">
            <SectionLabel>No result yet</SectionLabel>
            <h1 className="font-display mt-4 text-display-md text-ink-900">
              Calculate your <span className="italic text-amber-dark">aggregate first.</span>
            </h1>
            <p className="mt-4 text-base text-ink-500">
              Once you&apos;ve entered your subjects and grades, we&apos;ll surface your matches here.
            </p>
            <div className="mt-8">
              <Button variant="pill" size="lg" onClick={() => router.push('/shs/calculator')}>
                Go to calculator
              </Button>
            </div>
          </Container>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell step={3} totalSteps={3} stepLabel="Results">
      {/* Hero result */}
      <section className="bg-ink-900 text-white relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="pointer-events-none absolute -top-32 left-1/3 h-[420px] w-[640px] rounded-full bg-amber/15 blur-[140px]" />

        <Container size="wide" className="relative py-16 md:py-24">
          <SectionLabel tone="light">Your results</SectionLabel>
          <h1 className="font-display mt-4 text-display-md md:text-display-lg [text-wrap:balance]">
            Aggregate <span className="italic text-amber">{aggregate}.</span>
            {' '}
            <span className="text-ink-300">{eligiblePrograms.length} programs open.</span>
          </h1>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <BigStat label="Aggregate" value={aggregate.toString()} sub="Sum of best 6 subjects" highlight />
            <BigStat label="Programs" value={eligiblePrograms.length.toString()} sub="Eligible right now" />
            <BigStat label="Universities" value={universityCount.toString()} sub="Across Ghana" />
          </div>
        </Container>
      </section>

      {/* Subjects breakdown */}
      <section className="py-16 md:py-20">
        <Container size="wide">
          <SectionLabel>Subjects breakdown</SectionLabel>
          <h2 className="mt-4 font-display text-2xl md:text-3xl text-ink-900">
            Your <span className="italic text-amber-dark">grades.</span>
          </h2>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {subjects.map((s, i) => {
              const isBest6 =
                subjects.length > 0 &&
                [...subjects.filter((x) => x.points)].sort((a, b) => a.points - b.points).slice(0, 6).includes(s)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={`rounded-2xl p-4 ring-1 transition-all ${
                    isBest6 ? 'bg-amber/10 ring-amber/30' : 'bg-surface-muted ring-ink-100'
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 truncate">
                    {s.subject}
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <span className="font-display text-2xl text-ink-900">{s.grade}</span>
                    <span className="text-xs text-ink-500">{s.points} {s.points === 1 ? 'pt' : 'pts'}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Programs list */}
          <div className="mt-16 flex items-end justify-between">
            <div>
              <SectionLabel>Programs</SectionLabel>
              <h2 className="mt-4 font-display text-2xl md:text-3xl text-ink-900">
                Where you can <span className="italic text-amber-dark">go.</span>
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
              {eligiblePrograms.length} matches · sorted by cutoff
            </span>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-12 text-center text-sm text-ink-500">
                Loading recommendations…
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-danger/5 ring-1 ring-danger/20 p-10 text-center">
                <p className="text-sm text-danger mb-4">{error}</p>
                <button
                  onClick={fetchRecommendations}
                  className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-4 py-2 text-sm text-ink-700 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            ) : eligiblePrograms.length === 0 ? (
              <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-10 text-center text-sm text-ink-500">
                No programs match this aggregate yet. Try improving a subject grade.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {eligiblePrograms.map((p, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.015, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center gap-4 rounded-2xl bg-white ring-1 ring-ink-100 hover:ring-ink-400 hover:shadow-soft p-4 transition-all"
                  >
                    <span className="font-mono text-xs text-ink-400 w-10">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber-dark ring-1 ring-amber/20">
                      <School className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base md:text-lg text-ink-900 truncate">
                        {p.program}
                      </div>
                      <div className="text-sm text-ink-500 truncate">{p.universityName}</div>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] bg-success/10 text-success px-3 py-1.5 rounded-full ring-1 ring-success/20">
                      Cutoff {p.cutoff}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-300 group-hover:text-ink-900 transition-colors" />
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-12 flex items-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => router.push('/shs/calculator')} withArrow={false}>
              <RefreshCw className="h-4 w-4" />
              <span>Recalculate</span>
            </Button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-5 py-3 text-sm text-ink-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print results
            </button>
          </div>
        </Container>
      </section>
    </AppShell>
  )
}

function BigStat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-3xl p-6 md:p-8 ring-1 ${
        highlight ? 'bg-amber/10 ring-amber/30' : 'bg-white/[0.04] ring-white/10'
      }`}
    >
      <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${highlight ? 'text-amber' : 'text-ink-300'}`}>
        {label}
      </div>
      <div className={`mt-3 font-display text-5xl md:text-6xl leading-none ${highlight ? 'text-amber' : 'text-white'}`}>
        {value}
      </div>
      <div className="mt-3 text-xs text-ink-300">{sub}</div>
    </div>
  )
}
