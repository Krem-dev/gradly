'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  CheckCircle,
  Zap,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  Camera,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import Link from 'next/link'

interface ExtractedCourse {
  name: string
  code: string | null
  credits: number
  grade: string | null
  score: number | null
  semester: string
}

interface TranscriptUploadProps {
  onUpload?: (file: File) => void
  onUpgrade?: () => void
  isLoading?: boolean
  /** Current credit balance — 1 credit is charged per upload. Below 1 = blocked. */
  credits?: number
  onCoursesExtracted?: (courses: ExtractedCourse[]) => void
  /** Fires after a successful parse so the parent can sync its credit widget. */
  onCreditUsed?: (remaining: number) => void
  /**
   * Fires when the extractor detects which Ghana university issued the transcript
   * ('KNUST' | 'UG' | 'UCC' | 'UEW'). Parent should use this to sync its own
   * source-university selection so the conversion uses the correct grading table.
   */
  onSourceUniversityDetected?: (university: string) => void
}

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const ACCEPT_ATTR = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'

export default function TranscriptUpload({
  onUpload,
  onUpgrade,
  isLoading = false,
  credits = 0,
  onCoursesExtracted,
  onCreditUsed,
  onSourceUniversityDetected,
}: TranscriptUploadProps) {
  const hasCredits = credits > 0
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedCourses, setExtractedCourses] = useState<ExtractedCourse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [extractionMethod, setExtractionMethod] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [sourceUniversity, setSourceUniversity] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasCredits) return
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true)
    else if (e.type === 'dragleave') setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (!hasCredits) return
    const files = e.dataTransfer.files
    if (files && files[0]) handleFile(files[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasCredits) return
    const files = e.target.files
    if (files && files[0]) handleFile(files[0])
  }

  const handleFile = async (file: File) => {
    if (!hasCredits) {
      setError('Out of credits — buy a Convert Pack first.')
      return
    }
    const ok =
      ACCEPTED_TYPES.includes(file.type) ||
      /\.(pdf|jpe?g|png)$/i.test(file.name)
    if (!ok) {
      setError('Only PDF, JPG, or PNG files are supported.')
      return
    }
    setUploadedFile(file)
    setError(null)
    setExtractedCourses([])
    setExtractionMethod(null)
    setWarnings([])
    setSourceUniversity(null)
    onUpload?.(file)
    await processTranscript(file)
  }

  const processTranscript = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('transcript', file)
      // Identify the caller so the credits middleware can debit their balance.
      const userId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api'
      const response = await fetch(`${backendUrl}/transcript/parse`, {
        method: 'POST',
        body: formData,
        headers: userId ? { 'x-user-id': userId } : undefined,
      })
      const data = await response.json()

      // 402 = Payment Required → out of credits
      if (response.status === 402) {
        setError('Out of credits — buy a Convert Pack to upload a transcript.')
        return
      }
      if (response.status === 401) {
        setError('Please sign in to upload a transcript.')
        return
      }

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to extract courses from this file.')
        return
      }

      // Surface the new balance so the parent's widget refreshes.
      if (typeof data.creditsRemaining === 'number') {
        onCreditUsed?.(data.creditsRemaining)
      }
      const remainingHeader = response.headers.get('x-credits-remaining')
      if (remainingHeader !== null && typeof data.creditsRemaining !== 'number') {
        onCreditUsed?.(parseInt(remainingHeader, 10))
      }

      // Backend returns { courseName, courseCode, credits, score, grade, semester }
      // but the UI / parent expects { name, code, ... }. Map at the boundary.
      const courses: ExtractedCourse[] = (data.courses || []).map((c: any) => ({
        name: c.courseName ?? c.name ?? '',
        code: c.courseCode ?? c.code ?? null,
        credits: typeof c.credits === 'number' ? c.credits : parseFloat(c.credits) || 0,
        grade: c.grade ?? null,
        score: c.score ?? null,
        semester: c.semester ?? '',
      }))
      setExtractedCourses(courses)
      setExtractionMethod(data.extractionMethod ?? null)
      setWarnings(Array.isArray(data.warnings) ? data.warnings : [])
      const detectedUni = data.sourceUniversity ?? null
      setSourceUniversity(detectedUni)
      onCoursesExtracted?.(courses)
      // Tell the parent which Ghana university the transcript came from so it can
      // sync its own selection — otherwise the convert call uses the parent's
      // default (UG) and produces wrong classification + (fake) CGPA for KNUST students.
      if (detectedUni && ['KNUST', 'UG', 'UCC', 'UEW'].includes(detectedUni)) {
        onSourceUniversityDetected?.(detectedUni)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process transcript.')
      console.error('Transcript processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const updateCourse = (idx: number, patch: Partial<ExtractedCourse>) => {
    setExtractedCourses((prev) => {
      const next = prev.map((c, i) => (i === idx ? { ...c, ...patch } : c))
      onCoursesExtracted?.(next)
      return next
    })
  }

  const removeCourse = (idx: number) => {
    setExtractedCourses((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      onCoursesExtracted?.(next)
      return next
    })
  }

  const addBlankRow = () => {
    setExtractedCourses((prev) => {
      const next = [
        ...prev,
        { name: '', code: '', credits: 3, grade: null, score: null, semester: '' },
      ]
      onCoursesExtracted?.(next)
      return next
    })
  }

  const reset = () => {
    setUploadedFile(null)
    setExtractedCourses([])
    setError(null)
    setIsProcessing(false)
    setExtractionMethod(null)
    setWarnings([])
    setSourceUniversity(null)
    onCoursesExtracted?.([])
  }

  return (
    <div className="rounded-3xl bg-surface-muted ring-1 ring-ink-100 p-5 md:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 mb-4 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-dark" />
          Smart transcript upload · 1 credit per upload
        </span>
        {hasCredits ? (
          <span className="inline-flex items-center gap-1.5 text-amber-dark">
            <Zap className="h-3 w-3" />
            {credits} {credits === 1 ? 'credit' : 'credits'} left
          </span>
        ) : (
          <Link
            href="/pricing"
            onClick={onUpgrade}
            className="inline-flex items-center gap-1.5 rounded-pill bg-amber/10 text-amber-dark hover:bg-amber/20 px-2.5 py-1 transition-colors"
          >
            <Zap className="h-3 w-3" />
            Buy a Convert Pack
          </Link>
        )}
      </div>

      {!hasCredits && !uploadedFile && (
        <div className="mb-4 rounded-2xl bg-amber/10 ring-1 ring-amber/30 px-4 py-3 text-sm text-amber-dark flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Out of credits.</p>
            <p className="text-xs mt-0.5 leading-relaxed">
              Each transcript upload uses 1 credit (uploads + AI extraction + conversion).
              Grab a Convert Pack to keep going.
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!uploadedFile && (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            htmlFor="transcript-input"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'relative flex flex-col items-center justify-center text-center',
              'rounded-2xl border-2 border-dashed bg-white transition-all',
              'p-10 md:p-12',
              !hasCredits
                ? 'border-ink-100 opacity-50 cursor-not-allowed'
                : isDragActive
                ? 'border-amber bg-amber/5 cursor-pointer'
                : 'border-ink-200 hover:border-ink-400 cursor-pointer'
            )}
          >
            <input
              id="transcript-input"
              type="file"
              accept={ACCEPT_ATTR}
              onChange={handleChange}
              disabled={!hasCredits}
              className="sr-only"
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 text-amber-dark ring-1 ring-amber/20">
              <Upload className="h-5 w-5" />
            </span>
            <div className="mt-5 font-display text-xl text-ink-900">
              {isDragActive ? 'Drop the file here' : 'Drop a transcript'}
            </div>
            <p className="mt-2 text-sm text-ink-500">
              or click to browse · PDF, JPG, or PNG up to 10 MB
            </p>
            <p className="mt-1 text-[11px] text-ink-400 inline-flex items-center gap-1">
              <Camera className="h-3 w-3" />
              Phone photos work too — we extract automatically
            </p>
          </motion.label>
        )}

        {uploadedFile && (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white ring-1 ring-ink-100 p-5"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 text-amber-dark ring-1 ring-amber/20 shrink-0">
                <FileText className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base text-ink-900 truncate">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-ink-500 mt-0.5">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                  {isProcessing && ' · extracting…'}
                  {!isProcessing && !error && extractedCourses.length > 0 && (
                    <>
                      {' '}
                      · {extractedCourses.length} courses
                      {extractionMethod && (
                        <>
                          {' '}
                          · via{' '}
                          {extractionMethod === 'pdf-parse'
                            ? 'fast parser'
                            : extractionMethod === 'claude'
                            ? 'Claude AI'
                            : 'manual entry'}
                        </>
                      )}
                      {sourceUniversity && sourceUniversity !== 'UNKNOWN' && (
                        <> · {sourceUniversity}</>
                      )}
                    </>
                  )}
                  {error && ' · failed'}
                </div>
              </div>
              <Status
                processing={isProcessing}
                error={!!error}
                done={!isProcessing && !error && extractedCourses.length > 0}
              />
              <button
                onClick={reset}
                aria-label="Remove transcript"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-danger hover:bg-danger/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-danger/5 ring-1 ring-danger/20 px-4 py-3 text-sm text-danger flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isProcessing && warnings.length > 0 && (
              <div className="mt-4 rounded-xl bg-amber/10 ring-1 ring-amber/30 px-4 py-3 text-sm text-amber-dark">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-2">
                  Review these {warnings.length === 1 ? 'note' : 'notes'}
                </div>
                <ul className="space-y-1 list-disc list-inside">
                  {warnings.map((w, i) => (
                    <li key={i} className="text-xs leading-relaxed">{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {!isProcessing && !error && extractionMethod === 'manual' && (
              <div className="mt-4 rounded-xl bg-amber/5 ring-1 ring-amber/20 px-4 py-3 text-sm text-amber-dark flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  We couldn&apos;t auto-extract this file. Add your courses below by clicking
                  &ldquo;Add a course&rdquo;.
                </span>
              </div>
            )}

            {!isProcessing && !error && extractedCourses.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-sm text-ink-900">
                    Extracted courses · fix any errors before converting
                  </h4>
                  <button
                    onClick={addBlankRow}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.14em] text-ink-700 hover:text-amber-dark transition-colors"
                  >
                    + Add row
                  </button>
                </div>
                <EditableTable
                  courses={extractedCourses}
                  onUpdate={updateCourse}
                  onRemove={removeCourse}
                />
                <div className="mt-3 rounded-xl bg-success/5 ring-1 ring-success/20 px-4 py-3 text-xs text-success flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>
                    {extractedCourses.length} courses ready. Edit any row above — the conversion below
                    will use whatever you save here. (Parse is free; 1 credit is charged when you run
                    the conversion.)
                  </span>
                </div>
              </div>
            )}

            {!isProcessing && !error && extractedCourses.length === 0 && extractionMethod !== 'manual' && (
              <div className="mt-4 rounded-xl bg-ink-50 ring-1 ring-ink-100 px-4 py-3 text-sm text-ink-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  We didn&apos;t find any course rows. Try a different file, or add courses manually below.
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EditableTable({
  courses,
  onUpdate,
  onRemove,
}: {
  courses: ExtractedCourse[]
  onUpdate: (idx: number, patch: Partial<ExtractedCourse>) => void
  onRemove: (idx: number) => void
}) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-ink-100">
      <table className="w-full text-sm">
        <thead className="bg-ink-50">
          <tr className="text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
            <th className="px-3 py-2">Course</th>
            <th className="px-3 py-2 w-20">Code</th>
            <th className="px-3 py-2 w-20">Credits</th>
            <th className="px-3 py-2 w-20">Score</th>
            <th className="px-3 py-2 w-20">Grade</th>
            <th className="px-3 py-2 w-12" />
          </tr>
        </thead>
        <tbody>
          {courses.map((c, idx) => (
            <tr key={idx} className="border-t border-ink-100">
              <td className="px-3 py-1.5">
                <input
                  className="w-full bg-transparent text-sm text-ink-900 outline-none focus:bg-amber/5 rounded px-1.5 py-1"
                  value={c.name ?? ''}
                  onChange={(e) => onUpdate(idx, { name: e.target.value })}
                  placeholder="Course name"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  className="w-full bg-transparent text-xs font-mono text-ink-700 outline-none focus:bg-amber/5 rounded px-1.5 py-1"
                  value={c.code ?? ''}
                  onChange={(e) => onUpdate(idx, { code: e.target.value })}
                  placeholder="—"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="12"
                  className="w-full bg-transparent text-sm text-ink-900 outline-none focus:bg-amber/5 rounded px-1.5 py-1"
                  value={c.credits ?? ''}
                  onChange={(e) =>
                    onUpdate(idx, { credits: e.target.value === '' ? 0 : parseFloat(e.target.value) })
                  }
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  className="w-full bg-transparent text-sm text-ink-900 outline-none focus:bg-amber/5 rounded px-1.5 py-1"
                  value={c.score ?? ''}
                  onChange={(e) =>
                    onUpdate(idx, {
                      score: e.target.value === '' ? null : parseFloat(e.target.value),
                    })
                  }
                  placeholder="—"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  className="w-full bg-transparent text-sm text-ink-900 outline-none focus:bg-amber/5 rounded px-1.5 py-1 uppercase"
                  value={c.grade ?? ''}
                  onChange={(e) => onUpdate(idx, { grade: e.target.value.toUpperCase() || null })}
                  placeholder="—"
                  maxLength={3}
                />
              </td>
              <td className="px-2 py-1.5 text-right">
                <button
                  onClick={() => onRemove(idx)}
                  type="button"
                  aria-label="Remove row"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-danger hover:bg-danger/5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Status({
  processing,
  error,
  done,
}: {
  processing: boolean
  error: boolean
  done: boolean
}) {
  if (processing) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-amber-dark">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Parsing
      </span>
    )
  }
  if (error) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-danger">
        <AlertCircle className="h-3.5 w-3.5" />
        Error
      </span>
    )
  }
  if (done) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-success">
        <CheckCircle className="h-3.5 w-3.5" />
        Ready
      </span>
    )
  }
  return null
}
