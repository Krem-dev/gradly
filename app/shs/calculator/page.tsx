'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, School, Save, ArrowUpRight } from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import Button from '@/components/ui/Button'
import { WASSCE_GRADES } from '@/lib/mockData'
import { getSubjectsByStream } from '@/lib/shsSubjects'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface SubjectGrade {
  id: string
  subject: string
  grade: string
  points: number
}

const STREAM_NAMES: Record<string, string> = {
  science: 'General Science',
  business: 'Business',
  'agricultural-science': 'Agricultural Science',
  arts: 'General Arts',
  'home-economics': 'Home Economics',
  'visual-arts': 'Visual Arts',
  technical: 'Technical',
}

export default function Page() {
  return (
    <Suspense fallback={<SHSCalculatorFallback />}>
      <SHSCalculatorPage />
    </Suspense>
  )
}

function SHSCalculatorFallback() {
  return (
    <AppShell step={2} totalSteps={3} stepLabel="Subjects">
      <section className="py-32 text-center">
        <p className="text-sm font-mono uppercase tracking-[0.18em] text-ink-500">Loading…</p>
      </section>
    </AppShell>
  )
}

function SHSCalculatorPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectGrade[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [courseStream, setCourseStream] = useState<string | null>(null)
  const [addPicker, setAddPicker] = useState<string>('')
  const [lastSavedAggregate, setLastSavedAggregate] = useState<number | null>(null)
  const [knustAggregate, setKnustAggregate] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
    }
    const course = searchParams.get('course')
    if (!course) {
      router.push('/shs/course-selection')
      return
    }
    setCourseStream(course)
  }, [searchParams, router])

  const streamSubjects = useMemo(() => {
    if (!courseStream) return []
    return getSubjectsByStream(courseStream).map((s) => s.name)
  }, [courseStream])

  const availableSubjects = useMemo(
    () => streamSubjects.filter((s) => !selectedSubjects.some((sel) => sel.subject === s)),
    [streamSubjects, selectedSubjects]
  )

  const addSubject = (subject: string) => {
    if (!subject) return
    setSelectedSubjects((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, subject, grade: '', points: 0 },
    ])
    setAddPicker('')
  }

  const handleGradeChange = (id: string, grade: string) => {
    const gradeInfo = WASSCE_GRADES.find((g) => g.grade === grade)
    setSelectedSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade, points: gradeInfo?.points || 0 } : s))
    )
  }

  const handleRemove = (id: string) =>
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== id))

  const gradedSubjects = useMemo(
    () => selectedSubjects.filter((s) => s.grade),
    [selectedSubjects]
  )

  // WAEC-correct aggregate: 3 cores (English + Maths + Science|Social) + 3 best electives.
  // This mirrors the backend wassce.service.calculateWASSCEAggregate exactly.
  const aggregateInfo = useMemo(() => {
    if (gradedSubjects.length < 6) {
      return { aggregate: 0, best6: [] as typeof gradedSubjects, missingCores: [] as string[] }
    }

    const classify = (name: string): 'english' | 'math' | 'science' | 'social' | null => {
      const n = name.toLowerCase()
      if (/\benglish\b|\blanguage arts\b/.test(n)) return 'english'
      if ((/\bmath/.test(n) || /\bmaths\b/.test(n)) && !/\belective\b/.test(n) && !/\badditional\b/.test(n)) return 'math'
      if (/\bintegrated science\b|\bcore science\b|\bgeneral science\b/.test(n)) return 'science'
      if (/\bsocial studies\b|\bsocial science\b/.test(n)) return 'social'
      return null
    }

    const tagged = gradedSubjects.map((s) => ({ ...s, coreType: classify(s.subject) }))
    // Mirror backend STREAMS_USING_SOCIAL_CORE / STREAMS_USING_SCIENCE_CORE.
    // Home Economics deliberately uses Science (HE students often apply to Nursing/Nutrition).
    const stream = courseStream || ''
    const prefersSocial = ['arts', 'general-arts', 'business', 'visual-arts'].includes(stream)
    const prefersScience = ['science', 'general-science', 'agricultural-science', 'home-economics', 'technical'].includes(stream)

    const pick = (type: string) =>
      [...tagged.filter((s) => s.coreType === type)].sort((a, b) => a.points - b.points)[0]

    const english = pick('english')
    const math = pick('math')
    const science = pick('science')
    const social = pick('social')

    const missing: string[] = []
    if (!english) missing.push('English Language')
    if (!math) missing.push('Core Mathematics')

    let third: typeof tagged[number] | undefined
    if (prefersSocial && social) third = social
    else if (prefersScience && science) third = science
    else if (science && social) third = science.points <= social.points ? science : social
    else third = science || social
    if (!third) missing.push('Integrated Science or Social Studies')

    if (missing.length || !english || !math) {
      return { aggregate: 0, best6: [], missingCores: missing }
    }

    const cores = [english, math, third!]
    const coreRefs = new Set(cores)
    const electives = tagged.filter((s) => !coreRefs.has(s)).sort((a, b) => a.points - b.points).slice(0, 3)
    if (electives.length < 3) {
      return { aggregate: 0, best6: [], missingCores: ['At least 3 elective subjects'] }
    }

    const best6 = [...cores, ...electives].sort((a, b) => a.points - b.points)
    const aggregate = best6.reduce((sum, s) => sum + s.points, 0)
    return { aggregate, best6, missingCores: [] }
  }, [gradedSubjects, courseStream])

  const best6 = aggregateInfo.best6
  const aggregate = aggregateInfo.aggregate
  const missingCores = aggregateInfo.missingCores

  useEffect(() => {
    if (aggregate > 0) fetchRecommendations()
    else setRecommendations([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregate])

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      // Send the full subject list so the backend can apply per-university aggregate
      // rules (KNUST uses C4=C5=C6=4 for cutoff math).
      const response = await fetch(`${apiUrl}/recommendations/universities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: gradedSubjects.map((s) => ({ name: s.subject, grade: s.grade })),
          courseStream,
        }),
      })
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const data = await response.json()
      setRecommendations(data.universities || [])
      if (typeof data.knustAggregate === 'number') {
        setKnustAggregate(data.knustAggregate)
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const eligiblePrograms = useMemo(() => {
    return recommendations
      .flatMap((u: any) =>
        u.programs.map((p: any) => ({
          university: u.university,
          universityName: u.universityName,
          program: p.name,
          cutoff: p.cutoffAggregate,
        }))
      )
      .sort((a: any, b: any) => a.cutoff - b.cutoff)
  }, [recommendations])

  const handleSave = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!userId) {
      if (!silent) {
        showToast('Please sign in to save your calculation', 'error')
        router.push('/login')
      }
      return
    }
    if (best6.length !== 6) {
      if (!silent) showToast('Pick at least 6 subjects with grades', 'error')
      return
    }
    setIsSaving(true)
    try {
      const grades = selectedSubjects.map((s) => s.grade)
      const subjects = selectedSubjects.map((s) => ({ name: s.subject, grade: s.grade }))
      const r = await api.shs.saveConversion(parseInt(userId), grades, subjects, {
        aggregate,
        best6: best6.map((s) => ({ name: s.subject, grade: s.grade, points: s.points })),
        courseStream,
      })
      if (r.success) {
        if (!silent) showToast('Calculation saved', 'success')
        setLastSavedAggregate(aggregate)
      } else if (!silent) {
        showToast('Failed to save', 'error')
      }
    } catch (err) {
      if (!silent) showToast('Failed to save', 'error')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save once the user has a complete aggregate.
  // Debounced so editing subjects in quick succession doesn't spam the API,
  // and only fires when the aggregate value actually changes from the last save.
  useEffect(() => {
    if (!userId || best6.length !== 6) return
    if (lastSavedAggregate === aggregate) return
    const timer = window.setTimeout(() => {
      handleSave({ silent: true })
    }, 1200)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregate, best6.length, userId])

  if (!courseStream) return null

  return (
    <AppShell step={2} totalSteps={3} stepLabel="Subjects">
      <section className="py-10 md:py-14">
        <Container size="wide">
          {/* Stream header */}
          <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <SectionLabel number="02">SHS Aggregate · Step 2</SectionLabel>
              <h1 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900">
                <span className="italic text-amber-dark">{STREAM_NAMES[courseStream]}</span> ·{' '}
                <span className="text-ink-900">enter your grades.</span>
              </h1>
              <p className="mt-4 text-base text-ink-500 max-w-md leading-relaxed">
                Add subjects, pick the grade you got (or expect). We sum your best six — lower aggregate, better placement.
              </p>
            </div>
            <button
              onClick={() => router.push('/shs/course-selection')}
              className="hidden md:inline text-sm text-ink-500 hover:text-ink-900 transition-colors whitespace-nowrap"
            >
              Change stream →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* SUBJECT LIST */}
            <div className="lg:col-span-8 space-y-6">
              {/* Add row */}
              <div className="rounded-3xl bg-surface-muted p-5 md:p-6 ring-1 ring-ink-100">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-3">
                  Add a subject
                </div>
                <div className="flex gap-3">
                  <select
                    value={addPicker}
                    onChange={(e) => addSubject(e.target.value)}
                    disabled={!availableSubjects.length}
                    className="flex-1 h-12 rounded-xl bg-white text-ink-900 ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 outline-none px-4 text-base appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">
                      {availableSubjects.length
                        ? `Choose from ${availableSubjects.length} subjects…`
                        : 'All available subjects added'}
                    </option>
                    {availableSubjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject rows */}
              {selectedSubjects.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink-100 p-12 text-center">
                  <Plus className="h-6 w-6 text-ink-300 mx-auto mb-3" />
                  <p className="font-display text-lg text-ink-900">No subjects yet</p>
                  <p className="mt-1.5 text-sm text-ink-500">
                    Add at least 6 to compute your aggregate.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {selectedSubjects.map((s, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: i * 0.02 }}
                      className="flex items-center gap-3 rounded-2xl bg-white ring-1 ring-ink-100 p-3 pl-5 hover:ring-ink-300 transition-all"
                    >
                      <span className="font-mono text-xs text-ink-400 w-6 text-right">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-display text-base text-ink-900 truncate">
                        {s.subject}
                      </span>
                      <select
                        value={s.grade}
                        onChange={(e) => handleGradeChange(s.id, e.target.value)}
                        className="h-10 rounded-xl bg-surface-muted text-ink-900 ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 outline-none px-3 text-sm appearance-none cursor-pointer"
                      >
                        <option value="">Grade</option>
                        {WASSCE_GRADES.map((g) => (
                          <option key={g.grade} value={g.grade}>
                            {g.grade}
                          </option>
                        ))}
                      </select>
                      <span
                        className={`min-w-14 text-center font-mono text-xs px-3 py-1.5 rounded-full ${
                          s.grade
                            ? 'bg-amber/15 text-amber-dark ring-1 ring-amber/20'
                            : 'bg-ink-50 text-ink-400 ring-1 ring-ink-100'
                        }`}
                      >
                        {s.grade ? `${s.points} ${s.points === 1 ? 'pt' : 'pts'}` : '—'}
                      </span>
                      <button
                        onClick={() => handleRemove(s.id)}
                        aria-label="Remove subject"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-danger hover:bg-danger/5 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              {selectedSubjects.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="text-sm text-ink-500 hover:text-ink-900 transition-colors"
                  >
                    Clear all
                  </button>
                  {userId && best6.length === 6 && (
                    <div className="ml-auto inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em]">
                      {isSaving ? (
                        <span className="text-ink-500">Saving…</span>
                      ) : lastSavedAggregate === aggregate ? (
                        <span className="text-success inline-flex items-center gap-1.5">
                          <Save className="h-3 w-3" />
                          Saved
                        </span>
                      ) : (
                        <span className="text-ink-400">Not saved yet</span>
                      )}
                    </div>
                  )}
                  {userId && best6.length === 6 && lastSavedAggregate !== aggregate && (
                    <button
                      onClick={() => handleSave()}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-4 py-2 text-sm text-ink-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save now
                    </button>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {best6.length === 6 && (
                <div className="pt-6">
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <SectionLabel number="03">University matches</SectionLabel>
                      <h2 className="mt-3 font-display text-2xl md:text-3xl text-ink-900">
                        Eligible <span className="italic text-amber-dark">programs.</span>
                      </h2>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
                      {eligiblePrograms.length} matches
                    </span>
                  </div>
                  {loadingRecommendations ? (
                    <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-10 text-center text-sm text-ink-500">
                      Finding programs for aggregate {aggregate}…
                    </div>
                  ) : eligiblePrograms.length === 0 ? (
                    <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-10 text-center text-sm text-ink-500">
                      No programs match this aggregate yet. Try improving a subject grade.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
                      {eligiblePrograms.map((p: any, i: number) => (
                        <button
                          key={i}
                          className="group text-left rounded-2xl bg-white ring-1 ring-ink-100 hover:ring-ink-400 hover:shadow-soft p-4 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/10 text-amber-dark ring-1 ring-amber/20 shrink-0">
                              <School className="h-4 w-4" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-display text-sm text-ink-900 leading-snug truncate">
                                {p.program}
                              </div>
                              <div className="text-xs text-ink-500 mt-0.5 truncate">
                                {p.universityName}
                              </div>
                            </div>
                            <span className="font-mono text-xs bg-success/10 text-success px-2 py-0.5 rounded-full ring-1 ring-success/20 shrink-0">
                              Cutoff {p.cutoff}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-6">
                    <Button
                      variant="pill"
                      size="lg"
                      onClick={() =>
                        router.push(
                          `/shs/results?aggregate=${aggregate}&subjects=${encodeURIComponent(
                            JSON.stringify(selectedSubjects)
                          )}`
                        )
                      }
                    >
                      See full results
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR: live aggregate */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-[28px] bg-ink-900 text-white p-6 md:p-8 ring-1 ring-white/5 shadow-lift overflow-hidden relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber/15 blur-[100px]"
                />
                <div className="relative">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-300">
                    Live aggregate
                  </div>
                  <div className="mt-5 flex items-end gap-2">
                    <div className="font-display text-7xl md:text-8xl tracking-tight text-white leading-none">
                      {best6.length === 6 ? aggregate : '—'}
                    </div>
                    <div className="pb-2 text-sm text-ink-300">
                      {best6.length === 6 ? 'pts' : ''}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-ink-300">
                    {best6.length === 6
                      ? '3 cores + 3 best electives (WAEC official)'
                      : gradedSubjects.length === 0
                      ? 'Grade your subjects to see your aggregate'
                      : missingCores.length > 0
                      ? `Missing: ${missingCores.join(', ')}`
                      : `${Math.max(0, 6 - gradedSubjects.length)} more graded ${
                          6 - gradedSubjects.length === 1 ? 'subject' : 'subjects'
                        } needed`}
                  </div>

                  {best6.length === 6 && knustAggregate !== null && knustAggregate !== aggregate && (
                    <div className="mt-4 rounded-2xl bg-white/[0.06] ring-1 ring-white/10 px-4 py-3">
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
                          KNUST aggregate
                        </span>
                        <span className="font-display text-2xl text-amber">{knustAggregate}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-ink-300">
                        KNUST counts C4, C5 &amp; C6 all as 4 — your KNUST aggregate is
                        used for KNUST cutoffs only.
                      </p>
                    </div>
                  )}

                  <div className="my-6 h-px bg-white/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <Stat label="Subjects" value={selectedSubjects.length} />
                    <Stat label="Graded" value={gradedSubjects.length} />
                    <Stat label="Programs" value={eligiblePrograms.length} />
                    <Stat
                      label="Universities"
                      value={new Set(eligiblePrograms.map((p: any) => p.university)).size}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
        {label}
      </div>
      <div className="font-display text-2xl mt-1.5 text-white">{value}</div>
    </div>
  )
}
