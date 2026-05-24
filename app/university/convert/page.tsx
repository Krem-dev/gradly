'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import AppShell from '@/components/ui/AppShell'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import SelectField from '@/components/ui/SelectField'
import Button from '@/components/ui/Button'
import TranscriptUpload from '@/components/TranscriptUpload'
import { GRADING_SYSTEMS, INSTITUTIONS } from '@/lib/gradingSystems'
import { api } from '@/lib/api'
import { useToast } from '@/context/ToastContext'

interface Course {
  id: string
  name: string
  score: string
  creditHours: string
  semester: string
}

const SEMESTERS = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8',
]

// Frontend uses lowercase institution slugs ('ug', 'knust', …). Backend ghanaGrading.service.js
// uses uppercase abbreviations ('UG', 'KNUST', 'UCC', 'UEW'). Only those 4 have per-university
// classification tables — other Ghana unis fall back to the generic Scholaro/WES mapping.
const UNIVERSITY_SLUG_TO_BACKEND: Record<string, string> = {
  ug: 'UG',
  knust: 'KNUST',
  ucc: 'UCC',
  uew: 'UEW',
}

function mapToBackendUniversity(slug: string): string | undefined {
  return UNIVERSITY_SLUG_TO_BACKEND[slug]
}

export default function UniversityConvertPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [sourceCountry, setSourceCountry] = useState('Ghana')
  const [sourceUniversity, setSourceUniversity] = useState('ug')
  const [sourceSystem, setSourceSystem] = useState('ghana_gpa')
  const [targetSystem, setTargetSystem] = useState<'usa_gpa' | 'uk_percentage'>('usa_gpa')
  const [courses, setCourses] = useState<Course[]>([])
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [isConverting, setIsConverting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = localStorage.getItem('userId')
    setUserId(id)
    if (id) {
      api.credits.getBalance(parseInt(id, 10)).then((r) => {
        if (r.success && r.data) setCredits(r.data.balance)
      })
    }
    const refresh = () => {
      const cur = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      if (cur) {
        api.credits.getBalance(parseInt(cur, 10)).then((r) => {
          if (r.success && r.data) setCredits(r.data.balance)
        })
      }
    }
    window.addEventListener('credits-updated', refresh)
    return () => window.removeEventListener('credits-updated', refresh)
  }, [])

  // Premium-only filtering is replaced by credits gating. Show all systems.
  const isPremium = true

  const availableCountries = useMemo(() => {
    const set = new Set<string>()
    INSTITUTIONS.forEach((uni) => {
      const sys = GRADING_SYSTEMS[uni.gradingSystemId]
      if (!sys.isPremium || isPremium) set.add(uni.country)
    })
    return Array.from(set)
  }, [isPremium])

  const universitiesInCountry = useMemo(() => {
    return INSTITUTIONS.filter((uni) => {
      const sys = GRADING_SYSTEMS[uni.gradingSystemId]
      return uni.country === sourceCountry && (!sys.isPremium || isPremium)
    })
  }, [sourceCountry, isPremium])

  // Course CRUD
  const addCourseToSemester = (semester: string) => {
    const newCourse: Course = {
      id: `${Date.now()}-${Math.random()}`,
      name: '',
      score: '',
      creditHours: '3',
      semester,
    }
    setCourses((prev) => [...prev, newCourse])
  }

  const updateCourse = (id: string, patch: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  const addNewSemester = () => {
    const nextSemester = SEMESTERS.find((s) => !courses.some((c) => c.semester === s))
    if (!nextSemester) {
      showToast('All 8 semesters in use', 'info')
      return
    }
    addCourseToSemester(nextSemester)
  }

  const handleViewResults = async () => {
    if (courses.length === 0) {
      showToast('Add at least one course', 'error')
      return
    }
    const incomplete = courses.find((c) => !c.name || !c.score)
    if (incomplete) {
      showToast('Every course needs a name and score', 'error')
      return
    }
    if (!userId) {
      showToast('Sign in to run a conversion', 'error')
      router.push('/login')
      return
    }
    // Note: no credit check here. The credit was charged at transcript upload
    // (or doesn't apply at all for manually-typed courses — no Claude cost).
    setIsConverting(true)
    try {
      const r = await api.universityConverter.convert(
        sourceSystem,
        courses,
        targetSystem,
        userId,
        mapToBackendUniversity(sourceUniversity)
      )
      if (!r.success || !r.data) {
        showToast(r.error || 'Failed to convert', 'error')
        return
      }
      // Successful conversion consumed a credit
      if ((r.data as any).creditsRemaining !== undefined) {
        setCredits((r.data as any).creditsRemaining)
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('credits-updated'))
      }
      const d = r.data
      const params = new URLSearchParams({
        sourceSystem: d.sourceSystem,
        sourceUniversity,
        targetSystem: d.targetSystem,
        courses: JSON.stringify(d.courses),
        sourceScore: d.sourceScore.toString(),
        weightedAverage: d.weightedAverage.toString(),
        targetScore: d.targetScore.toString(),
        usaGpa: d.usaGpa.toString(),
        ukPercentage: d.ukPercentage.toString(),
        classification: JSON.stringify(d.degreeClassification),
        ghanaCgpa: d.ghanaCgpa !== null && d.ghanaCgpa !== undefined ? d.ghanaCgpa.toString() : '',
        ghanaClassification: d.ghanaClassification ?? '',
        warnings: JSON.stringify(d.warnings ?? []),
      })
      router.push(`/university/results?${params.toString()}`)
    } catch (err) {
      console.error(err)
      showToast('Conversion failed. Please try again.', 'error')
    } finally {
      setIsConverting(false)
    }
  }

  const handleSave = async () => {
    if (!userId) {
      showToast('Sign in to save your conversion', 'error')
      router.push('/login')
      return
    }
    if (courses.length === 0) {
      showToast('Add courses before saving', 'error')
      return
    }
    setIsSaving(true)
    try {
      const convertResponse = await api.universityConverter.convert(
        sourceSystem,
        courses,
        targetSystem,
        undefined,
        mapToBackendUniversity(sourceUniversity)
      )
      if (!convertResponse.success || !convertResponse.data) {
        showToast(convertResponse.error || 'Conversion failed', 'error')
        return
      }
      const saveResponse = await api.universityConverter.save(parseInt(userId), convertResponse.data)
      if (saveResponse.success) showToast('Conversion saved', 'success')
      else showToast('Failed to save', 'error')
    } catch (err) {
      console.error(err)
      showToast('Failed to save', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Group by any semester label that appears in the data — not just the hardcoded
  // SEMESTERS list. Extracted transcripts use labels like "Level 100, Semester 1"
  // or "Level 100" which weren't in the original array.
  const groupedCourses: Record<string, Course[]> = {}
  for (const c of courses) {
    const k = c.semester || 'Semester 1'
    if (!groupedCourses[k]) groupedCourses[k] = []
    groupedCourses[k].push(c)
  }
  const semesterKeys = Object.keys(groupedCourses)

  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.creditHours) || 0), 0)
  const completedCount = courses.filter((c) => c.name && c.score).length

  // When every course came from the transcript upload, the embedded preview in
  // TranscriptUpload IS the editable course list — no need to duplicate it below.
  const allCoursesFromTranscript =
    courses.length > 0 && courses.every((c) => (c as any)._fromTranscript)

  return (
    <AppShell step={1} totalSteps={2} stepLabel="Courses">
      <section className="py-10 md:py-14">
        <Container size="wide">
          <div className="max-w-2xl mb-10 md:mb-14">
            <SectionLabel number="01">University Conversion</SectionLabel>
            <h1 className="font-display mt-4 text-display-md md:text-display-lg text-ink-900 [text-wrap:balance]">
              Translate your transcript, <span className="italic text-amber-dark">course by course.</span>
            </h1>
            <p className="mt-5 text-base text-ink-500 max-w-md leading-relaxed">
              Pick your source system, enter every course with its grade and credit hours. We&apos;ll weight it correctly and convert to the target you need.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* MAIN */}
            <div className="lg:col-span-8 space-y-8">
              {/* System selectors */}
              <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-6 md:p-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-5">
                  From — to
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectField
                    label="Your country"
                    value={sourceCountry}
                    onChange={(e) => {
                      const c = e.target.value
                      setSourceCountry(c)
                      const firstUni = INSTITUTIONS.find((uni) => {
                        const sys = GRADING_SYSTEMS[uni.gradingSystemId]
                        return uni.country === c && (!sys.isPremium || isPremium)
                      })
                      if (firstUni) {
                        setSourceUniversity(firstUni.id)
                        setSourceSystem(firstUni.gradingSystemId)
                      }
                    }}
                    options={availableCountries.map((c) => ({ value: c, label: c }))}
                  />
                  <SelectField
                    label="Your university"
                    value={sourceUniversity}
                    hint={GRADING_SYSTEMS[sourceSystem]?.name}
                    onChange={(e) => {
                      setSourceUniversity(e.target.value)
                      const uni = INSTITUTIONS.find((u) => u.id === e.target.value)
                      if (uni) setSourceSystem(uni.gradingSystemId)
                    }}
                    options={universitiesInCountry.map((u) => ({ value: u.id, label: u.name }))}
                  />
                  <SelectField
                    label="Convert to"
                    value={targetSystem}
                    hint="Target grading system"
                    onChange={(e) => setTargetSystem(e.target.value as 'usa_gpa' | 'uk_percentage')}
                    options={[
                      { value: 'usa_gpa', label: 'USA GPA (4.0 scale)' },
                      { value: 'uk_percentage', label: 'UK Percentage (0-100)' },
                    ]}
                  />
                </div>
              </div>

              {/* Transcript upload — owns the courses it extracts. The callback fires
                  on every edit in its embedded preview, so we REPLACE the transcript-
                  derived courses (those tagged with the transcriptUploadId) rather than
                  append. Manually-typed courses below are preserved. */}
              <TranscriptUpload
                credits={credits}
                onUpload={(file) => showToast(`Uploaded ${file.name}`, 'success')}
                onCreditUsed={(remaining) => {
                  setCredits(remaining)
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('credits-updated'))
                  }
                }}
                onCoursesExtracted={(extracted) => {
                  setCourses((prev) => {
                    // Keep anything the user added manually (no _fromTranscript flag)
                    const manual = prev.filter((c) => !(c as any)._fromTranscript)
                    const mapped: Course[] = extracted.map((c, i) => ({
                      id: `tx-${i}`,
                      name: c.name,
                      score: c.score?.toString() || c.grade || '',
                      creditHours: c.credits.toString(),
                      semester: c.semester || 'Semester 1',
                      // @ts-expect-error custom tag so we can dedupe on subsequent edits
                      _fromTranscript: true,
                    }))
                    return [...manual, ...mapped]
                  })
                }}
                onSourceUniversityDetected={(detected) => {
                  // Backend returns uppercase ('KNUST', 'UG', ...) but the dropdown
                  // uses lowercase institution slugs. Map + sync so the convert call
                  // uses the right grading table.
                  const slug = detected.toLowerCase()
                  setSourceUniversity(slug)
                  // Also sync the grading system: KNUST → ghana_cwa, others → ghana_gpa
                  setSourceSystem(detected === 'KNUST' ? 'ghana_cwa' : 'ghana_gpa')
                  showToast(`Detected ${detected} — switched grading scheme`, 'success')
                }}
              />

              {/* Courses — only shown when the user is typing manually (or mixing).
                  When every course came from the transcript upload, the editable
                  preview INSIDE TranscriptUpload above is the canonical editor;
                  duplicating it here is just visual noise. */}
              <div>
                {!allCoursesFromTranscript && (
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <SectionLabel number="02">Your courses</SectionLabel>
                      <h2 className="mt-3 font-display text-2xl md:text-3xl text-ink-900">
                        Every course, <span className="italic text-amber-dark">every grade.</span>
                      </h2>
                    </div>
                    {courses.length > 0 && (
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
                        {completedCount}/{courses.length} complete
                      </span>
                    )}
                  </div>
                )}

                {allCoursesFromTranscript ? null : semesterKeys.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-ink-100 p-12 text-center">
                    <Plus className="h-6 w-6 text-ink-300 mx-auto mb-3" />
                    <p className="font-display text-lg text-ink-900">Start with semester 1</p>
                    <p className="mt-1.5 text-sm text-ink-500 mb-6">
                      Add courses one by one — name, grade, and credit hours.
                    </p>
                    <Button
                      variant="pill"
                      size="md"
                      onClick={() => addCourseToSemester('Semester 1')}
                      withArrow={false}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add first course</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {semesterKeys.map((sem) => {
                      const isCollapsed = !!collapsed[sem]
                      const semCourses = groupedCourses[sem]
                      const semCredits = semCourses.reduce(
                        (sum, c) => sum + (parseFloat(c.creditHours) || 0),
                        0
                      )
                      return (
                        <div
                          key={sem}
                          className="rounded-3xl bg-white ring-1 ring-ink-100 overflow-hidden"
                        >
                          {/* Header */}
                          <button
                            onClick={() => setCollapsed((p) => ({ ...p, [sem]: !p[sem] }))}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-muted transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-xs uppercase tracking-[0.22em] text-amber-dark">
                                {sem.replace('Semester ', '').padStart(2, '0')}/
                              </span>
                              <span className="font-display text-lg text-ink-900">{sem}</span>
                              <span className="text-xs font-mono uppercase tracking-[0.16em] text-ink-400">
                                {semCourses.length} courses · {semCredits} credits
                              </span>
                            </div>
                            {isCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-ink-400" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-ink-400" />
                            )}
                          </button>

                          <AnimatePresence initial={false}>
                            {!isCollapsed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-ink-100 px-3 py-3 space-y-2">
                                  {/* Column headers */}
                                  <div className="hidden md:grid grid-cols-12 gap-3 px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-400">
                                    <div className="col-span-6">Course</div>
                                    <div className="col-span-3">Score / Grade</div>
                                    <div className="col-span-2">Credits</div>
                                    <div className="col-span-1" />
                                  </div>
                                  {semCourses.map((c) => (
                                    <CourseRow
                                      key={c.id}
                                      course={c}
                                      onChange={(patch) => updateCourse(c.id, patch)}
                                      onRemove={() => removeCourse(c.id)}
                                    />
                                  ))}
                                  <button
                                    onClick={() => addCourseToSemester(sem)}
                                    className="w-full mt-1 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-200 hover:border-ink-400 hover:bg-surface-muted text-sm text-ink-500 hover:text-ink-900 py-3 transition-colors"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add another course
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}

                    <button
                      onClick={addNewSemester}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-200 hover:border-ink-400 hover:bg-surface-muted text-sm text-ink-500 hover:text-ink-900 py-4 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add another semester
                    </button>
                  </div>
                )}

                {/* Actions */}
                {courses.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button
                      variant="pill"
                      size="lg"
                      onClick={handleViewResults}
                      loading={isConverting}
                    >
                      {isConverting ? 'Converting…' : 'Calculate & view results'}
                    </Button>
                    {userId && (
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-pill ring-1 ring-ink-200 hover:ring-ink-400 px-5 py-3 text-sm text-ink-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving…' : 'Save draft'}
                      </button>
                    )}
                    <button
                      onClick={() => setCourses([])}
                      className="ml-auto text-sm text-ink-500 hover:text-danger transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-[28px] bg-ink-900 text-white p-6 md:p-8 ring-1 ring-white/5 shadow-lift overflow-hidden relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber/15 blur-[100px]"
                />
                <div className="relative">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-300">
                    From → To
                  </div>
                  <div className="mt-4 font-display text-2xl text-white leading-tight">
                    {GRADING_SYSTEMS[sourceSystem]?.name || 'Source'}
                  </div>
                  <div className="mt-1 text-sm text-amber">
                    → {targetSystem === 'usa_gpa' ? 'USA GPA (4.0)' : 'UK Percentage'}
                  </div>

                  <div className="my-6 h-px bg-white/10" />

                  <div className="grid grid-cols-2 gap-5">
                    <SidebarStat label="Courses" value={courses.length} />
                    <SidebarStat label="Semesters" value={semesterKeys.length} />
                    <SidebarStat label="Credits" value={totalCredits.toFixed(1)} />
                    <SidebarStat label="Complete" value={`${completedCount}/${courses.length || 0}`} />
                  </div>

                  <div className="mt-7 text-xs text-ink-300 leading-relaxed">
                    Weighted average uses{' '}
                    <span className="text-amber font-medium">score × credits</span> over total credits. We convert that to your target system at the end.
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

function CourseRow({
  course,
  onChange,
  onRemove,
}: {
  course: Course
  onChange: (patch: Partial<Course>) => void
  onRemove: () => void
}) {
  return (
    <div className="grid grid-cols-12 gap-2 md:gap-3 items-center bg-surface-muted rounded-2xl p-3">
      <input
        value={course.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Course name"
        className="col-span-12 md:col-span-6 h-10 px-3 rounded-xl bg-white ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 outline-none text-sm text-ink-900"
      />
      <input
        value={course.score}
        onChange={(e) => onChange({ score: e.target.value })}
        placeholder="e.g. 85 or A"
        className="col-span-7 md:col-span-3 h-10 px-3 rounded-xl bg-white ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 outline-none text-sm text-ink-900"
      />
      <input
        type="number"
        min="0"
        step="0.5"
        value={course.creditHours}
        onChange={(e) => onChange({ creditHours: e.target.value })}
        placeholder="3"
        className="col-span-4 md:col-span-2 h-10 px-3 rounded-xl bg-white ring-1 ring-ink-100 focus:ring-2 focus:ring-amber/60 outline-none text-sm text-ink-900"
      />
      <button
        onClick={onRemove}
        aria-label="Remove course"
        className="col-span-1 h-10 w-10 mx-auto inline-flex items-center justify-center rounded-xl text-ink-400 hover:text-danger hover:bg-danger/5 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

function SidebarStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
        {label}
      </div>
      <div className="font-display text-2xl mt-1.5 text-white">{value}</div>
    </div>
  )
}
