/**
 * Single-score Ghana CWA / percentage → USA CGPA conversion.
 *
 * Two methods exposed:
 *   1. scholaroPercentageToCGPA — WES/Scholaro letter-grade lookup (recommended).
 *   2. linearPercentageToCGPA   — naive (CWA / 100) × 4.0. Kept for legacy/comparison only;
 *      do NOT use for credential evaluation — Ghana grades are not linearly equivalent.
 *
 * For course-by-course conversion (weighted by credit hours), use
 * university.converter.service.js → calculateScholaroGPA(). Always prefer course-by-course
 * over single-score whenever credit data exists.
 */

const SCHOLARO_GHANA_BOUNDARIES = [
  { min: 80, max: 100,    letter: 'A',  points: 4.0 },
  { min: 75, max: 79.999, letter: 'A-', points: 3.7 },
  { min: 70, max: 74.999, letter: 'B+', points: 3.3 },
  { min: 65, max: 69.999, letter: 'B',  points: 3.0 },
  { min: 60, max: 64.999, letter: 'B-', points: 2.7 },
  { min: 55, max: 59.999, letter: 'C+', points: 2.3 },
  { min: 50, max: 54.999, letter: 'C',  points: 2.0 },
  { min: 0,  max: 49.999, letter: 'F',  points: 0.0 },
]

function validatePercentage(percentage) {
  // Number(null) === 0 and Number('') === 0, both of which would silently pass —
  // be explicit so callers don't get a bogus 0% interpretation.
  if (percentage === null || percentage === undefined || percentage === '') {
    throw new Error('Percentage is required')
  }
  const p = Number(percentage)
  if (!Number.isFinite(p)) {
    throw new Error('Percentage must be a finite number')
  }
  if (p < 0 || p > 100) {
    throw new Error('Percentage must be between 0 and 100')
  }
  return p
}

function validateCGPA(cgpa, max = 4.0) {
  if (cgpa === null || cgpa === undefined || cgpa === '') {
    throw new Error('CGPA is required')
  }
  const c = Number(cgpa)
  if (!Number.isFinite(c)) {
    throw new Error('CGPA must be a finite number')
  }
  if (c < 0 || c > max) {
    throw new Error(`CGPA must be between 0 and ${max.toFixed(1)}`)
  }
  return c
}

function round2(n) {
  return Math.round(n * 100) / 100
}

/**
 * WES/Scholaro percentage → 4.0 GPA.
 * 80+ → 4.0, 75–79 → 3.7, 70–74 → 3.3, 65–69 → 3.0, 60–64 → 2.7, 55–59 → 2.3, 50–54 → 2.0, <50 → 0.
 */
function scholaroPercentageToCGPA(percentage) {
  const p = validatePercentage(percentage)
  const row = SCHOLARO_GHANA_BOUNDARIES.find((b) => p >= b.min && p <= b.max)
  if (!row) {
    throw new Error(`Could not classify percentage ${p}`)
  }
  return {
    cgpa: row.points,
    letter: row.letter,
    method: 'scholaro',
  }
}

/**
 * Naive linear conversion: (percentage / 100) * 4.0.
 * Use only when WES-grade fidelity is not required.
 */
function linearPercentageToCGPA(percentage) {
  const p = validatePercentage(percentage)
  return {
    cgpa: round2((p / 100) * 4.0),
    letter: null,
    method: 'linear',
  }
}

/**
 * Default entry point: prefers Scholaro (WES-aligned) but accepts { method: 'linear' } for legacy.
 */
function convertPercentageToCGPA(percentage, options = {}) {
  const method = options.method === 'linear' ? 'linear' : 'scholaro'
  const result = method === 'linear'
    ? linearPercentageToCGPA(percentage)
    : scholaroPercentageToCGPA(percentage)

  return {
    sourcePercentage: validatePercentage(percentage),
    cgpa: round2(result.cgpa),
    letter: result.letter,
    method: result.method,
  }
}

/**
 * Reverse: USA CGPA → Ghana percentage. There is NO canonical inverse — multiple Ghana
 * percentages map to the same US letter / GPA, so a point estimate is dishonest.
 *
 * Returns a RANGE { min, max, letter, caveat } so callers display the band, not a
 * false-precise number. For legacy callers that need a single number, .midpoint is
 * provided as a convenience but should not be treated as authoritative.
 */
function convertCGPAToPercentage(cgpa) {
  // Lazy-require to avoid a circular dep at module load
  const ghana = require('./ghanaGrading.service')
  const range = ghana.gpaToScholaroPercentageRange(cgpa)
  return {
    min: range.min,
    max: range.max,
    midpoint: round2((range.min + range.max) / 2),
    letter: range.letter,
    caveat: range.caveat,
  }
}

/**
 * Legacy linear inverse (kept for back-compat with callers that depend on a single number).
 * Prefer convertCGPAToPercentage which returns the honest range.
 */
function convertCGPAToPercentageLinear(cgpa) {
  const c = validateCGPA(cgpa)
  return round2((c / 4.0) * 100)
}

module.exports = {
  convertPercentageToCGPA,
  scholaroPercentageToCGPA,
  linearPercentageToCGPA,
  convertCGPAToPercentage,
  convertCGPAToPercentageLinear,
  validatePercentage,
  validateCGPA,
  SCHOLARO_GHANA_BOUNDARIES,
}
