/**
 * Authoritative per-university Ghana grading tables (2025/26).
 *
 * Each Ghanaian university uses its OWN grading scheme — the bands, letters,
 * and degree classifications differ. The previous converter treated everything
 * Ghana through a single Scholaro/WES table (which is the *external* US credential
 * evaluator's view, NOT what KNUST or UG actually use internally).
 *
 * This module exposes:
 *   - GHANA_UNIVERSITIES: per-university letter→percentage→points tables + classifications
 *   - SCHOLARO_GHANA:     the WES/Scholaro external table (for US grad-school applications)
 *   - percentageToLetter(university, %)
 *   - percentageToPoints(university, %)
 *   - cwaToClassification(university, cwa)
 *   - cgpaToClassification(university, cgpa)
 *   - calculateGhanaCGPA(courses, university)   ← course-by-course, weighted
 *   - calculateScholaroGPA(courses)             ← course-by-course, WES-aligned
 *
 * Sources cross-checked May 2026 (research summary in conversation history):
 *   - KNUST: yen.com.gh/107648-knust-grading-system, mypathway.app/blog/knust-cwa-grading-system,
 *     colemanpublications.com (graduate handbook PDF reference)
 *   - UG:    ghstudents.com/university-of-ghana-grading-system, scholaro.com (UG entry),
 *     UG Regulations for Junior Members (2016, still current)
 *   - UCC:   ucc.edu.gh/main/applicants-and-students/grading-system, scholaro.com (UCC entry)
 *   - UEW:   mypathway.app/blog/uew-grading-system, scholaro.com (UEW entry)
 *   - WES:   scholaro.com/db/Countries/Ghana/Grading-System, wes.org
 *
 * KEY DIVERGENCES (not interchangeable!):
 *   - KNUST uses CWA (0-100 percentage) only — no official 4.0 CGPA equivalent.
 *     KNUST's A starts at 70%, not 80% like UG/UCC/UEW.
 *   - UG/UCC/UEW use 4.0 CGPA with identical letter→% boundaries but DIFFERENT classifications:
 *       • UG  First Class: CGPA ≥ 3.60   (2nd Lower threshold: 2.00)
 *       • UCC First Class: CGPA ≥ 3.60   (2nd Lower threshold: 2.50 — higher than UG!)
 *       • UEW First Class: CGPA ≥ 3.50   (lower bar than UG/UCC)
 *   - A student converting KNUST CWA to US GPA via linear /4×100 commonly loses a class.
 *     Use the WES Scholaro course-by-course method instead.
 */

// ──────────────────────────────────────────────────────────────────────────────
// KNUST (Kumasi) — CWA only, 6-letter scheme. No official 4.0 CGPA equivalent.
// ──────────────────────────────────────────────────────────────────────────────
const KNUST_BANDS = [
  { min: 70, max: 100,    letter: 'A', points: null }, // KNUST publishes no GP
  { min: 60, max: 69.999, letter: 'B', points: null },
  { min: 50, max: 59.999, letter: 'C', points: null },
  { min: 45, max: 49.999, letter: 'D', points: null },
  { min: 40, max: 44.999, letter: 'E', points: null },
  { min: 0,  max: 39.999, letter: 'F', points: null },
]

const KNUST_CLASSIFICATIONS = [
  { min: 70.0,  max: 100,    label: 'First Class' },
  { min: 60.0,  max: 69.999, label: 'Second Class Upper' },
  { min: 50.0,  max: 59.999, label: 'Second Class Lower' },
  { min: 45.0,  max: 49.999, label: 'Third Class' },
  { min: 40.0,  max: 44.999, label: 'Pass' },
  { min: 0,     max: 39.999, label: 'Fail' },
]

// ──────────────────────────────────────────────────────────────────────────────
// University of Ghana (Legon) — 4.0 CGPA, 9-letter scheme.
// ──────────────────────────────────────────────────────────────────────────────
const UG_BANDS = [
  { min: 80, max: 100,    letter: 'A',  points: 4.0 },
  { min: 75, max: 79.999, letter: 'B+', points: 3.5 },
  { min: 70, max: 74.999, letter: 'B',  points: 3.0 },
  { min: 65, max: 69.999, letter: 'C+', points: 2.5 },
  { min: 60, max: 64.999, letter: 'C',  points: 2.0 },
  { min: 55, max: 59.999, letter: 'D+', points: 1.5 },
  { min: 50, max: 54.999, letter: 'D',  points: 1.0 },
  { min: 45, max: 49.999, letter: 'E',  points: 0.5 },
  { min: 0,  max: 44.999, letter: 'F',  points: 0.0 },
]

const UG_CLASSIFICATIONS = [
  { min: 3.60, max: 4.00, label: 'First Class' },
  { min: 3.00, max: 3.599, label: 'Second Class Upper' },
  { min: 2.00, max: 2.999, label: 'Second Class Lower' },
  { min: 1.50, max: 1.999, label: 'Third Class' },
  { min: 1.00, max: 1.499, label: 'Pass' },
  { min: 0,    max: 0.999, label: 'Fail' },
]

// ──────────────────────────────────────────────────────────────────────────────
// UCC (Cape Coast) — same letter→% bands as UG, but DIFFERENT classifications.
// ──────────────────────────────────────────────────────────────────────────────
const UCC_BANDS = UG_BANDS

const UCC_CLASSIFICATIONS = [
  { min: 3.60, max: 4.00,  label: 'First Class' },
  { min: 3.00, max: 3.599, label: 'Second Class Upper' },
  { min: 2.50, max: 2.999, label: 'Second Class Lower' }, // UCC threshold is 2.5, not 2.0!
  { min: 2.00, max: 2.499, label: 'Third Class' },
  { min: 1.00, max: 1.999, label: 'Pass' },
  { min: 0,    max: 0.999, label: 'Fail' },
]

// ──────────────────────────────────────────────────────────────────────────────
// UEW (Winneba) — same bands, different classifications (First Class threshold 3.5!).
// ──────────────────────────────────────────────────────────────────────────────
const UEW_BANDS = UG_BANDS

const UEW_CLASSIFICATIONS = [
  { min: 3.50, max: 4.00,  label: 'First Class' },        // UEW threshold is 3.5, not 3.6!
  { min: 3.00, max: 3.499, label: 'Second Class Upper' },
  { min: 2.50, max: 2.999, label: 'Second Class Lower' },
  { min: 2.00, max: 2.499, label: 'Third Class' },
  { min: 1.00, max: 1.999, label: 'Pass' },
  { min: 0,    max: 0.999, label: 'Fail' },
]

// ──────────────────────────────────────────────────────────────────────────────
// Scholaro / WES external table — what US credential evaluators see.
// Use this when the student is applying to a US grad school, NOT for internal
// Ghana classification. Scholaro's published table:
//   Ghana A+ (80-100) → US A (4.0)
//   Ghana A  (75-79)  → US A- (3.7)
//   Ghana B+ (70-74)  → US B+ (3.3)
//   Ghana B  (65-69)  → US B  (3.0)
//   Ghana B- (60-64)  → US B- (2.7)
//   Ghana C+ (55-59)  → US C+ (2.3)
//   Ghana C  (50-54)  → US C  (2.0)
//   Ghana F  (<50)    → US F  (0.0)
// ──────────────────────────────────────────────────────────────────────────────
const SCHOLARO_BANDS = [
  { min: 80, max: 100,    letter: 'A+', usLetter: 'A',  points: 4.0 },
  { min: 75, max: 79.999, letter: 'A',  usLetter: 'A-', points: 3.7 },
  { min: 70, max: 74.999, letter: 'B+', usLetter: 'B+', points: 3.3 },
  { min: 65, max: 69.999, letter: 'B',  usLetter: 'B',  points: 3.0 },
  { min: 60, max: 64.999, letter: 'B-', usLetter: 'B-', points: 2.7 },
  { min: 55, max: 59.999, letter: 'C+', usLetter: 'C+', points: 2.3 },
  { min: 50, max: 54.999, letter: 'C',  usLetter: 'C',  points: 2.0 },
  { min: 0,  max: 49.999, letter: 'F',  usLetter: 'F',  points: 0.0 },
]

// ──────────────────────────────────────────────────────────────────────────────
// Public registry
// ──────────────────────────────────────────────────────────────────────────────
const GHANA_UNIVERSITIES = {
  KNUST: {
    id: 'KNUST',
    name: 'Kwame Nkrumah University of Science and Technology',
    scaleType: 'CWA',
    scaleMax: 100,
    bands: KNUST_BANDS,
    classifications: KNUST_CLASSIFICATIONS,
    notes:
      'KNUST publishes CWA (Cumulative Weighted Average, 0–100%) only — no official 4.0 CGPA. ' +
      'For US grad-school applications, use the WES/Scholaro course-by-course method instead of ' +
      'a linear CWA/100×4 conversion (which commonly drops graduates a class).',
  },
  UG: {
    id: 'UG',
    name: 'University of Ghana',
    scaleType: 'CGPA',
    scaleMax: 4.0,
    bands: UG_BANDS,
    classifications: UG_CLASSIFICATIONS,
    notes: 'University of Ghana CGPA on 4.0 scale. Source: UG Regulations for Junior Members.',
  },
  UCC: {
    id: 'UCC',
    name: 'University of Cape Coast',
    scaleType: 'CGPA',
    scaleMax: 4.0,
    bands: UCC_BANDS,
    classifications: UCC_CLASSIFICATIONS,
    notes:
      'UCC CGPA on 4.0 scale. Note: UCC Second Class Lower threshold is 2.50 (not 2.00 like UG) — ' +
      'a CGPA of 2.30 is Third Class at UCC but Second Class Lower at UG.',
  },
  UEW: {
    id: 'UEW',
    name: 'University of Education, Winneba',
    scaleType: 'CGPA',
    scaleMax: 4.0,
    bands: UEW_BANDS,
    classifications: UEW_CLASSIFICATIONS,
    notes:
      'UEW CGPA on 4.0 scale. Note: UEW First Class threshold is 3.50 (lower than UG/UCC at 3.60).',
  },
}

const SCHOLARO_GHANA = {
  id: 'SCHOLARO',
  name: 'Scholaro / WES (US credential evaluation)',
  bands: SCHOLARO_BANDS,
}

// ──────────────────────────────────────────────────────────────────────────────
// Lookups
// ──────────────────────────────────────────────────────────────────────────────
function _resolveUni(id) {
  if (!id || !GHANA_UNIVERSITIES[id]) {
    const valid = Object.keys(GHANA_UNIVERSITIES).join(', ')
    throw new Error(`Unknown Ghana university '${id}'. Valid: ${valid}`)
  }
  return GHANA_UNIVERSITIES[id]
}

function _validatePercent(p) {
  if (p === null || p === undefined || p === '') {
    throw new Error('Percentage is required')
  }
  const n = Number(p)
  if (!Number.isFinite(n)) throw new Error('Percentage must be a finite number')
  if (n < 0 || n > 100) throw new Error('Percentage must be between 0 and 100')
  return n
}

function _validateCgpa(cgpa, max = 4.0) {
  if (cgpa === null || cgpa === undefined || cgpa === '') {
    throw new Error('CGPA is required')
  }
  const n = Number(cgpa)
  if (!Number.isFinite(n)) throw new Error('CGPA must be a finite number')
  if (n < 0 || n > max) throw new Error(`CGPA must be between 0 and ${max.toFixed(1)}`)
  return n
}

function _findBand(bands, pct) {
  return bands.find((b) => pct >= b.min && pct <= b.max) || null
}

/**
 * Find the grade-points band whose letter matches. Used when a course row only
 * has a letter grade (no percentage) — common on UG/UCC/UEW transcripts.
 */
function _findBandByLetter(bands, letter) {
  if (!letter) return null
  const normalized = String(letter).trim().toUpperCase()
  return bands.find((b) => b.letter === normalized) || null
}

/**
 * Midpoint percentage of the band — used to "estimate" a score when only a letter is given.
 * e.g. UG B+ (75-79.999) → 77.5. Not exact, but the best honest estimate.
 */
function _bandMidpoint(band) {
  if (!band) return null
  return Math.round(((band.min + band.max) / 2) * 100) / 100
}

/**
 * Resolve a course row to a {score, points, band} triple, using whichever of
 * (score, grade) is provided. Score wins if present. Throws if neither yields a band.
 */
function resolveCourseBand(universityId, course) {
  const u = _resolveUni(universityId)
  const hasScore = course.score !== undefined && course.score !== null && course.score !== ''
  if (hasScore) {
    const p = Number(course.score)
    if (Number.isFinite(p) && p >= 0 && p <= 100) {
      const band = _findBand(u.bands, p)
      if (!band) throw new Error(`Could not classify score ${p} for ${course.name ?? '(unnamed)'}`)
      return { score: p, points: band.points, band, source: 'score' }
    }
    // Score wasn't a valid 0-100 percentage. Could be a letter grade typed in
    // the score column ("B+", "A") — common when the frontend merges grade→score.
    // Try the explicit grade column first, then fall back to interpreting the
    // score string itself as a letter.
    if (course.grade) {
      const band = _findBandByLetter(u.bands, course.grade)
      if (band) return { score: _bandMidpoint(band), points: band.points, band, source: 'letter' }
    }
    if (typeof course.score === 'string') {
      const band = _findBandByLetter(u.bands, course.score)
      if (band) return { score: _bandMidpoint(band), points: band.points, band, source: 'letter' }
    }
    throw new Error(
      `Invalid score "${course.score}" for course "${course.name ?? '(unnamed)'}". ` +
        `Use 0-100 percentage, or a valid letter grade (A/B+/C/...).`
    )
  }
  // No score — fall back to letter grade.
  if (course.grade) {
    const band = _findBandByLetter(u.bands, course.grade)
    if (band) return { score: _bandMidpoint(band), points: band.points, band, source: 'letter' }
    throw new Error(
      `Grade "${course.grade}" is not in the ${universityId} grading scheme for course "${course.name ?? '(unnamed)'}"`
    )
  }
  throw new Error(
    `Course "${course.name ?? '(unnamed)'}" has neither a percentage score nor a letter grade.`
  )
}

function percentageToLetter(universityId, percentage) {
  const u = _resolveUni(universityId)
  const p = _validatePercent(percentage)
  const band = _findBand(u.bands, p)
  return band ? band.letter : null
}

function percentageToPoints(universityId, percentage) {
  const u = _resolveUni(universityId)
  if (u.scaleType !== 'CGPA') return null // KNUST has no points
  const p = _validatePercent(percentage)
  const band = _findBand(u.bands, p)
  return band ? band.points : null
}

function cwaToClassification(universityId, cwa) {
  const u = _resolveUni(universityId)
  if (u.scaleType !== 'CWA') {
    throw new Error(`${u.id} does not use CWA — use cgpaToClassification instead.`)
  }
  const p = _validatePercent(cwa)
  const cls = u.classifications.find((c) => p >= c.min && p <= c.max)
  return cls ? cls.label : null
}

function cgpaToClassification(universityId, cgpa) {
  const u = _resolveUni(universityId)
  if (u.scaleType !== 'CGPA') {
    throw new Error(`${u.id} does not use CGPA — use cwaToClassification instead.`)
  }
  const c = _validateCgpa(cgpa, u.scaleMax)
  const cls = u.classifications.find((cl) => c >= cl.min && c <= cl.max)
  return cls ? cls.label : null
}

// ──────────────────────────────────────────────────────────────────────────────
// Course-by-course calculators (weighted by credit hours)
// ──────────────────────────────────────────────────────────────────────────────

function _validateCredits(c) {
  const credits = parseFloat(c.creditHours ?? c.credits)
  if (!Number.isFinite(credits) || credits <= 0) {
    throw new Error(`Invalid credit hours for course: ${c.name ?? '(unnamed)'}`)
  }
  return credits
}

/** Internal university CGPA. Accepts courses with score, grade, or both. Returns null for KNUST. */
function calculateGhanaCGPA(courses, universityId) {
  const u = _resolveUni(universityId)
  if (u.scaleType !== 'CGPA') return null // KNUST has no CGPA
  if (!Array.isArray(courses) || courses.length === 0) {
    throw new Error('Must provide at least one course')
  }

  let totalPoints = 0
  let totalCredits = 0
  for (const c of courses) {
    const credits = _validateCredits(c)
    const { points } = resolveCourseBand(universityId, c)
    totalPoints += points * credits
    totalCredits += credits
  }
  if (totalCredits === 0) throw new Error('Total credits must be greater than 0')
  return Math.round((totalPoints / totalCredits) * 100) / 100
}

/**
 * CWA = weighted average of percentage scores. Works for any university.
 * For letter-only rows, uses the source university's band midpoint as the estimated
 * percentage (e.g. UG B+ ≈ 77.5%).
 */
function calculateCWA(courses, universityId = 'UG') {
  if (!Array.isArray(courses) || courses.length === 0) {
    throw new Error('Must provide at least one course')
  }
  let totalScore = 0
  let totalCredits = 0
  for (const c of courses) {
    const credits = _validateCredits(c)
    const { score } = resolveCourseBand(universityId, c)
    totalScore += score * credits
    totalCredits += credits
  }
  if (totalCredits === 0) throw new Error('Total credits must be greater than 0')
  return Math.round((totalScore / totalCredits) * 100) / 100
}

/**
 * Course-by-course WES/Scholaro GPA — for US grad-school applications.
 * Letter grades from the SOURCE university are mapped to a midpoint percentage in
 * THAT university's table, then re-classified against the Scholaro table.
 */
function calculateScholaroGPA(courses, sourceUniversityId = 'UG') {
  if (!Array.isArray(courses) || courses.length === 0) {
    throw new Error('Must provide at least one course')
  }
  let totalPoints = 0
  let totalCredits = 0
  for (const c of courses) {
    const credits = _validateCredits(c)
    // Resolve to a percentage in the source uni's terms, then map THAT percentage
    // through the Scholaro table to get US GPA points.
    const { score } = resolveCourseBand(sourceUniversityId, c)
    const band = _findBand(SCHOLARO_BANDS, score)
    if (!band) throw new Error(`Could not classify score ${score} for ${c.name ?? '(unnamed)'}`)
    totalPoints += band.points * credits
    totalCredits += credits
  }
  if (totalCredits === 0) throw new Error('Total credits must be greater than 0')
  return Math.round((totalPoints / totalCredits) * 100) / 100
}

// ──────────────────────────────────────────────────────────────────────────────
// Reverse direction: US GPA → Ghana percentage RANGE (no point estimate — there
// is no canonical inverse).
// ──────────────────────────────────────────────────────────────────────────────
function gpaToScholaroPercentageRange(gpa) {
  const c = _validateCgpa(gpa)
  // Find the lowest-points band whose points >= gpa (the band whose ceiling brackets it)
  const sorted = [...SCHOLARO_BANDS].sort((a, b) => a.points - b.points)
  let band = sorted.find((b) => b.points >= c)
  if (!band) band = sorted[sorted.length - 1]
  return {
    min: band.min,
    max: band.max,
    letter: band.letter,
    caveat:
      'No official inverse exists. Multiple Ghana percentages map to the same US letter / GPA, ' +
      'so this is a range, not a point estimate.',
  }
}

module.exports = {
  // Registry
  GHANA_UNIVERSITIES,
  SCHOLARO_GHANA,
  // Lookups
  percentageToLetter,
  percentageToPoints,
  cwaToClassification,
  cgpaToClassification,
  resolveCourseBand, // accepts {score, grade} → {score, points, band, source}
  // Calculators
  calculateGhanaCGPA,
  calculateCWA,
  calculateScholaroGPA,
  gpaToScholaroPercentageRange,
  // Constants (for tests + debug)
  KNUST_BANDS,
  UG_BANDS,
  UCC_BANDS,
  UEW_BANDS,
  SCHOLARO_BANDS,
  KNUST_CLASSIFICATIONS,
  UG_CLASSIFICATIONS,
  UCC_CLASSIFICATIONS,
  UEW_CLASSIFICATIONS,
}
