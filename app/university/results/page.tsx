'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  MapPin,
  Award,
  DollarSign,
  Globe,
  Save,
  RefreshCw,
  Printer,
  ArrowUpRight,
} from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import SelectField from '@/components/ui/SelectField'
import Button from '@/components/ui/Button'
import { GLOBAL_UNIVERSITIES, GRADING_SYSTEMS } from '@/lib/mockData'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

export default function Page() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <UniversityResultsPage />
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

function UniversityResultsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const [system, setSystem] = useState('usa')
  const [courses, setCourses] = useState<Course[]>([])
  const [convertedScore, setConvertedScore] = useState<number>(0)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [userId, setUserId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setUserId(localStorage.getItem('userId'))
  }, [])

  // Ghana-specific results from the new per-university converter (KNUST/UG/UCC/UEW)
  const [ghanaCgpa, setGhanaCgpa] = useState<number | null>(null)
  const [ghanaClassification, setGhanaClassification] = useState<string | null>(null)
  const [sourceUniversity, setSourceUniversity] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])

  useEffect(() => {
    const targetSystem = searchParams.get('targetSystem')
    const coursesParam = searchParams.get('courses')
    const usaGpaParam = searchParams.get('usaGpa')
    const ukPercentageParam = searchParams.get('ukPercentage')
    const ghanaCgpaParam = searchParams.get('ghanaCgpa')
    const ghanaClassificationParam = searchParams.get('ghanaClassification')
    const sourceUniversityParam = searchParams.get('sourceUniversity')
    const warningsParam = searchParams.get('warnings')

    if (coursesParam) {
      try {
        setCourses(JSON.parse(coursesParam))
      } catch (e) {
        console.error('Error parsing courses:', e)
      }
    }
    if (targetSystem === 'usa_gpa' && usaGpaParam) {
      setConvertedScore(parseFloat(usaGpaParam))
      setSystem('usa')
    } else if (targetSystem === 'uk_percentage' && ukPercentageParam) {
      setConvertedScore(parseFloat(ukPercentageParam))
      setSystem('uk')
    }
    if (ghanaCgpaParam) setGhanaCgpa(parseFloat(ghanaCgpaParam))
    if (ghanaClassificationParam) setGhanaClassification(ghanaClassificationParam)
    if (sourceUniversityParam) setSourceUniversity(sourceUniversityParam)
    if (warningsParam) {
      try {
        setWarnings(JSON.parse(warningsParam))
      } catch {}
    }
  }, [searchParams])

  const eligibleUniversities = useMemo(
    () =>
      GLOBAL_UNIVERSITIES.filter(
        (uni) => convertedScore >= uni.minCGPA && convertedScore <= uni.maxCGPA
      ),
    [convertedScore]
  )

  const regions = useMemo(
    () => ['all', ...Array.from(new Set(GLOBAL_UNIVERSITIES.map((u) => u.region)))],
    []
  )

  const filteredUniversities =
    selectedRegion === 'all'
      ? eligibleUniversities
      : eligibleUniversities.filter((u) => u.region === selectedRegion)

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage) || 1
  const paged = filteredUniversities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const systemLabel = GRADING_SYSTEMS.find((s) => s.id === system)?.label || system

  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.creditHours) || 0), 0)
  // Prefer the weighted-average percentage that the backend already computed (it correctly
  // handles letter grades by mapping to UG/UCC/UEW band midpoints). Fall back to a raw
  // per-course parse for legacy URLs that don't pass weightedAverage.
  const weightedAverageParam = searchParams.get('weightedAverage')
  const avgScore = weightedAverageParam
    ? parseFloat(weightedAverageParam).toFixed(2)
    : courses.length > 0
      ? (
          courses.reduce((sum, c) => sum + (parseFloat(c.score) || 0), 0) / courses.length
        ).toFixed(2)
      : '0.00'

  const handleSave = async () => {
    if (!userId) {
      showToast('Sign in to save your conversion', 'error')
      router.push('/login')
      return
    }
    setIsSaving(true)
    try {
      const conversionData = {
        sourceSystem: searchParams.get('sourceSystem'),
        sourceScore: parseFloat(searchParams.get('sourceScore') || '0'),
        usaGpa: parseFloat(searchParams.get('usaGpa') || '0'),
        ukPercentage: parseFloat(searchParams.get('ukPercentage') || '0'),
        targetSystem: searchParams.get('targetSystem'),
        courses,
      }
      const r = await api.universityConverter.save(parseInt(userId), conversionData)
      if (r.success) showToast('Conversion saved', 'success')
      else showToast('Failed to save', 'error')
    } catch (err) {
      console.error(err)
      showToast('Failed to save', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (courses.length === 0) {
    return (
      <AppShell>
        <section className="py-20">
          <Container size="default" className="text-center">
            <SectionLabel>No result yet</SectionLabel>
            <h1 className="font-display mt-4 text-display-md text-ink-900">
              Add your <span className="italic text-amber-dark">courses first.</span>
            </h1>
            <p className="mt-4 text-base text-ink-500">
              Once you&apos;ve entered your transcript, we&apos;ll show your converted score and matched universities here.
            </p>
            <div className="mt-8">
              <Button variant="pill" size="lg" onClick={() => router.push('/university/convert')}>
                Go to converter
              </Button>
            </div>
          </Container>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell step={2} totalSteps={2} stepLabel="Results">
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
          <SectionLabel tone="light">Your conversion</SectionLabel>
          <h1 className="font-display mt-4 text-display-md md:text-display-lg [text-wrap:balance]">
            <span className="italic text-amber">{convertedScore.toFixed(2)}</span>
            <span className="text-ink-300"> on {systemLabel}.</span>
          </h1>

          {/* Ghana-specific classification (per-university accurate) */}
          {ghanaClassification && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-pill bg-white/[0.08] ring-1 ring-white/15 px-5 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
                {sourceUniversity ? `${sourceUniversity.toUpperCase()} classification` : 'Classification'}
              </span>
              <span className="text-base font-medium text-white">{ghanaClassification}</span>
              {ghanaCgpa !== null && (
                <>
                  <span className="text-ink-300">·</span>
                  <span className="font-mono text-xs text-amber">CGPA {ghanaCgpa.toFixed(2)}</span>
                </>
              )}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="mt-6 max-w-2xl rounded-2xl bg-amber/10 ring-1 ring-amber/30 p-4">
              {warnings.map((w, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-amber">
                  {w}
                </p>
              ))}
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-5">
            <BigStat label="Converted" value={convertedScore.toFixed(2)} sub={systemLabel} highlight />
            <BigStat label="Credits" value={totalCredits.toFixed(0)} sub="Total earned" />
            <BigStat label="Avg score" value={avgScore} sub="Raw average" />
            <BigStat
              label="Universities"
              value={eligibleUniversities.length.toString()}
              sub="Eligible globally"
            />
          </div>
        </Container>
      </section>

      {/* Universities */}
      <section className="py-16 md:py-20">
        <Container size="wide">
          <div className="flex items-end justify-between mb-8 gap-6">
            <div>
              <SectionLabel>Global matches</SectionLabel>
              <h2 className="mt-4 font-display text-2xl md:text-3xl text-ink-900 [text-wrap:balance]">
                Universities <span className="italic text-amber-dark">in range.</span>
              </h2>
              <p className="mt-3 text-base text-ink-500">
                {filteredUniversities.length} of {eligibleUniversities.length} shown
                {selectedRegion !== 'all' && ` · filtered by ${selectedRegion}`}
              </p>
            </div>
            <div className="w-56">
              <SelectField
                label="Region"
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value)
                  setCurrentPage(1)
                }}
                options={regions.map((r) => ({
                  value: r,
                  label: r === 'all' ? 'All regions' : r,
                }))}
              />
            </div>
          </div>

          {filteredUniversities.length === 0 ? (
            <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-12 text-center">
              <p className="text-sm text-ink-500 mb-4">No universities match this region right now.</p>
              <button
                onClick={() => setSelectedRegion('all')}
                className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-4 py-2 text-sm text-ink-700 transition-colors"
              >
                Show all regions
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paged.map((u, i) => (
                  <motion.article
                    key={u.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="group rounded-3xl bg-white ring-1 ring-ink-100 hover:ring-ink-400 hover:shadow-lift p-6 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber/15 text-amber-dark ring-1 ring-amber/20 shrink-0">
                        <GraduationCap className="h-5 w-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg text-ink-900 leading-snug truncate">
                          {u.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                          <MapPin className="h-3 w-3" />
                          <span>{u.country}</span>
                          <span className="text-ink-300">·</span>
                          <span className="text-amber-dark font-medium">{u.region}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-ink-600">
                      <Row icon={<Award className="h-3.5 w-3.5 text-ink-400" />}>
                        CGPA range{' '}
                        <span className="text-ink-900 font-medium">
                          {u.minCGPA.toFixed(1)} – {u.maxCGPA.toFixed(1)}
                        </span>
                      </Row>
                      <Row icon={<DollarSign className="h-3.5 w-3.5 text-ink-400" />}>
                        Tuition <span className="text-ink-900 font-medium">{u.tuitionRange}</span>
                      </Row>
                      <Row icon={<Globe className="h-3.5 w-3.5 text-ink-400" />}>
                        Scholarships{' '}
                        <span className={u.scholarships ? 'text-success font-medium' : 'text-ink-500'}>
                          {u.scholarships ? 'Available' : 'Limited'}
                        </span>
                      </Row>
                    </div>

                    <div className="mt-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 mb-2">
                        Programs
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {u.programs.slice(0, 4).map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-ink-50 ring-1 ring-ink-100 text-ink-600"
                          >
                            {p}
                          </span>
                        ))}
                        {u.programs.length > 4 && (
                          <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber/10 ring-1 ring-amber/20 text-amber-dark">
                            +{u.programs.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 h-10 inline-flex items-center rounded-full ring-1 ring-ink-200 hover:ring-ink-400 text-sm text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1
                      const isActive = page === currentPage
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-full font-mono text-sm transition-all ${
                            isActive
                              ? 'bg-ink-900 text-amber'
                              : 'ring-1 ring-ink-200 hover:ring-ink-400 text-ink-700'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 h-10 inline-flex items-center rounded-full ring-1 ring-ink-200 hover:ring-ink-400 text-sm text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="lg" onClick={() => router.push('/university/convert')} withArrow={false}>
              <RefreshCw className="h-4 w-4" />
              <span>Recalculate</span>
            </Button>
            {userId && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-5 py-3 text-sm text-ink-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? 'Saving…' : 'Save conversion'}
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-5 py-3 text-sm text-ink-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
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
      className={`rounded-3xl p-6 md:p-7 ring-1 ${
        highlight ? 'bg-amber/10 ring-amber/30' : 'bg-white/[0.04] ring-white/10'
      }`}
    >
      <div
        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
          highlight ? 'text-amber' : 'text-ink-300'
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-3 font-display text-4xl md:text-5xl leading-none ${
          highlight ? 'text-amber' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="mt-3 text-xs text-ink-300">{sub}</div>
    </div>
  )
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </div>
  )
}
