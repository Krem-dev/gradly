/**
 * WASSCE aggregate calculation per WAEC official methodology.
 *
 * Grades: A1=1, B2=2, B3=3, C4=4, C5=5, C6=6, D7=7, E8=8, F9=9 (lower = better)
 *
 * Aggregate = sum of points across exactly 6 subjects:
 *   - 3 cores counted for aggregate: English, Core Mathematics, and
 *     (Integrated Science OR Social Studies — whichever the target programme requires)
 *   - 3 best electives by lowest points
 *
 * IMPORTANT — every SHS student in Ghana SITS all 4 cores (English, Core Mathematics,
 * Integrated Science, Social Studies). The "Integrated Science vs Social Studies"
 * choice is an *admissions counting rule* used by universities to compute aggregates
 * for cutoff comparison — it is NOT a WAEC sitting rule. Source: WAEC + UG admissions.
 *
 * Aggregate range: 6 (all A1) to 54 (all F9). Most degree programs require ≤ C6 in all
 * counted subjects.
 *
 * Per-university quirks:
 *   - KNUST's 2025/26 cutoffs treat C4, C5, and C6 all as "4 points" for aggregate
 *     math (so a student with C5/C6 grades looks better for KNUST than for UG/UCC).
 *     Use calculateKNUSTAggregate() when comparing against KNUST cutoffs.
 *     Source: KNUST 2025/26 admissions notice.
 *
 * References: WAEC (waecdirect.org), Ghana Education Service curriculum guide,
 * KNUST/UG admissions handbooks (aggregate cutoffs).
 */

// Standard WAEC grade → points (used by UG, UCC, UEW, and most other universities)
const GRADE_POINTS = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  D7: 7,
  E8: 8,
  F9: 9,
}

// KNUST 2025/26 admissions quirk: C4, C5, C6 are all counted as 4 for cutoff math.
// Everything else matches the standard scale.
const KNUST_GRADE_POINTS = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 4,
  C6: 4,
  D7: 7,
  E8: 8,
  F9: 9,
}

const PASS_THRESHOLD = 6 // C6 — minimum for admission to most Ghana degree programs

// Per WAEC + Ghanaian universities: every SHS student takes BOTH Integrated Science
// AND Social Studies as cores. For the 3-core aggregate slot, programmes that require
// Integrated Science (sciences, medicine, engineering, agriculture, technical) use it;
// programmes that require Social Studies (arts, business, home-ec, visual-arts) use that.
// Whichever produces the better grade for the student's chosen stream is the one we lock in.
const STREAMS_USING_SCIENCE_CORE = new Set([
  'science',
  'general-science',
  'agricultural-science',
  'home-economics', // Many Home Economics students apply to Nursing/Nutrition (Sci required)
  'technical',
])

const STREAMS_USING_SOCIAL_CORE = new Set([
  'arts',
  'general-arts',
  'business',
  'visual-arts',
])

function normalize(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const SUBJECT_PATTERNS = {
  english: [/\benglish\b/, /\blanguage arts\b/],
  mathematics: [/\bmathematics\b/, /\bmath(s)?\b/, /\bcore math/],
  science: [/\bintegrated science\b/, /\bcore science\b/, /\bgeneral science\b/],
  social: [/\bsocial studies\b/, /\bsocial science\b/],
}

function classifyCore(subjectName) {
  const n = normalize(subjectName)
  if (SUBJECT_PATTERNS.english.some((re) => re.test(n))) return 'english'
  if (
    SUBJECT_PATTERNS.mathematics.some((re) => re.test(n)) &&
    !/\belective\b/.test(n) &&
    !/\badditional\b/.test(n)
  )
    return 'mathematics'
  if (SUBJECT_PATTERNS.science.some((re) => re.test(n))) return 'science'
  if (SUBJECT_PATTERNS.social.some((re) => re.test(n))) return 'social'
  return null
}

function gradeToPoints(grade, table = GRADE_POINTS) {
  if (!grade || !(grade in table)) {
    throw new Error(`Invalid WASSCE grade: ${grade}`)
  }
  return table[grade]
}

/**
 * Calculate WASSCE aggregate.
 *
 * @param {Array<{name: string, grade: string}>|string[]} subjectsOrGrades
 *        Either an array of {name, grade} objects (preferred — enables core enforcement)
 *        or a bare array of grade strings (legacy — falls back to best-6-by-points).
 * @param {object} [options]
 * @param {string} [options.courseStream] — 'science' | 'arts' | 'business' | etc.
 *        Used to decide whether Integrated Science or Social Studies counts as the third core.
 * @param {boolean} [options.strict=true] — when true, require the 3 cores; throw if missing.
 * @returns {{
 *   aggregate: number,
 *   best6: Array<{name?: string, grade: string, points: number, isCore: boolean, coreType?: string}>,
 *   cores: Array<{name: string, grade: string, points: number, coreType: string}>,
 *   electives: Array<{name: string, grade: string, points: number}>,
 *   totalSubjects: number,
 *   missingCores: string[],
 *   warnings: string[],
 * }}
 */
function calculateWASSCEAggregate(subjectsOrGrades, options = {}) {
  const { courseStream, strict = true, gradeTable = GRADE_POINTS } = options

  if (!Array.isArray(subjectsOrGrades) || subjectsOrGrades.length === 0) {
    throw new Error('Must provide an array of subjects')
  }

  // Normalize input — support both {name, grade}[] and string[]
  const subjects = subjectsOrGrades.map((s) => {
    if (typeof s === 'string') {
      return { name: null, grade: s, points: gradeToPoints(s, gradeTable) }
    }
    if (!s || typeof s !== 'object' || !s.grade) {
      throw new Error(`Invalid subject entry: ${JSON.stringify(s)}`)
    }
    return { name: s.name ?? null, grade: s.grade, points: gradeToPoints(s.grade, gradeTable) }
  })

  if (subjects.length < 6) {
    throw new Error('At least 6 subjects required to compute aggregate')
  }

  const namedSubjects = subjects.filter((s) => s.name)
  const usesNamedSubjects = namedSubjects.length === subjects.length

  // If we have no names, we cannot enforce cores — fall back to best 6 (legacy mode).
  if (!usesNamedSubjects) {
    const sorted = [...subjects].sort((a, b) => a.points - b.points)
    const best6 = sorted.slice(0, 6)
    return {
      aggregate: best6.reduce((sum, s) => sum + s.points, 0),
      best6: best6.map((s) => ({ ...s, isCore: false })),
      cores: [],
      electives: best6,
      totalSubjects: subjects.length,
      missingCores: [],
      warnings: ['Core subjects could not be verified — pass {name, grade} objects to enable core enforcement.'],
    }
  }

  // Tag every subject as core or elective
  const tagged = subjects.map((s) => {
    const coreType = classifyCore(s.name)
    return { ...s, coreType, isCore: coreType !== null }
  })

  // Determine the third-core preference (Science vs Social) based on stream.
  // Stream IDs arrive as kebab-case slugs ('visual-arts', 'home-economics'); do NOT
  // pass them through normalize() — that replaces hyphens with spaces and breaks
  // the Set lookups below.
  const stream = String(courseStream || '').toLowerCase().trim()
  const prefersSocialCore = STREAMS_USING_SOCIAL_CORE.has(stream)
  const prefersScienceCore = STREAMS_USING_SCIENCE_CORE.has(stream)

  // Pick the best entry per core type (in case student listed e.g. two English papers)
  const picksBy = (type) => {
    const candidates = tagged.filter((s) => s.coreType === type)
    if (candidates.length === 0) return null
    return [...candidates].sort((a, b) => a.points - b.points)[0]
  }

  const englishPick = picksBy('english')
  const mathPick = picksBy('mathematics')
  const sciencePick = picksBy('science')
  const socialPick = picksBy('social')

  const missingCores = []
  if (!englishPick) missingCores.push('English Language')
  if (!mathPick) missingCores.push('Core Mathematics')

  // Choose the third core. Priority:
  //   1. Explicit stream preference (Science for sci/tech/agri/HE, Social for arts/biz/visual)
  //   2. Whichever produces the better aggregate (when stream is unknown)
  //   3. Whichever the student has (last resort)
  let thirdCorePick = null
  let thirdCoreLabel = null
  if (prefersSocialCore && socialPick) {
    thirdCorePick = socialPick
    thirdCoreLabel = 'social'
  } else if (prefersScienceCore && sciencePick) {
    thirdCorePick = sciencePick
    thirdCoreLabel = 'science'
  } else if (sciencePick && socialPick) {
    // Unknown stream — pick whichever gives the better aggregate (lower points)
    thirdCorePick = sciencePick.points <= socialPick.points ? sciencePick : socialPick
    thirdCoreLabel = thirdCorePick === sciencePick ? 'science' : 'social'
  } else if (sciencePick) {
    thirdCorePick = sciencePick
    thirdCoreLabel = 'science'
  } else if (socialPick) {
    thirdCorePick = socialPick
    thirdCoreLabel = 'social'
  } else {
    missingCores.push('Integrated Science or Social Studies')
  }

  if (missingCores.length > 0) {
    if (strict) {
      const err = new Error(
        `Aggregate requires 3 core subjects. Missing: ${missingCores.join(', ')}`
      )
      err.code = 'MISSING_CORES'
      err.missingCores = missingCores
      throw err
    }
    // Non-strict fallback: still take best 6 but flag the missing cores
    const sorted = [...tagged].sort((a, b) => a.points - b.points)
    const best6 = sorted.slice(0, 6)
    return {
      aggregate: best6.reduce((sum, s) => sum + s.points, 0),
      best6,
      cores: best6.filter((s) => s.isCore),
      electives: best6.filter((s) => !s.isCore),
      totalSubjects: subjects.length,
      missingCores,
      warnings: [
        `Aggregate computed without all 3 cores. Missing: ${missingCores.join(', ')}. ` +
          `Real WAEC aggregate cannot be issued; this is an estimate only.`,
      ],
    }
  }

  const cores = [englishPick, mathPick, thirdCorePick].filter(Boolean)
  const coreIds = new Set(cores.map((c) => c))
  const electives = tagged
    .filter((s) => !coreIds.has(s))
    .sort((a, b) => a.points - b.points)

  if (electives.length < 3) {
    throw new Error(
      'Need at least 3 elective subjects in addition to the 3 cores'
    )
  }

  const best3Electives = electives.slice(0, 3)
  const best6 = [...cores, ...best3Electives].sort((a, b) => a.points - b.points)

  const aggregate = best6.reduce((sum, s) => sum + s.points, 0)

  const warnings = []
  const coreFail = cores.find((c) => c.points > PASS_THRESHOLD)
  if (coreFail) {
    warnings.push(
      `Grade ${coreFail.grade} in ${coreFail.name} is below C6 — most Ghana degree programs require ≤ C6 in all cores.`
    )
  }

  return {
    aggregate,
    best6: best6.map((s) => ({
      name: s.name,
      grade: s.grade,
      points: s.points,
      isCore: s.isCore,
      coreType: s.coreType,
    })),
    cores: cores.map((s) => ({
      name: s.name,
      grade: s.grade,
      points: s.points,
      coreType: s.coreType,
    })),
    electives: best3Electives.map((s) => ({
      name: s.name,
      grade: s.grade,
      points: s.points,
    })),
    totalSubjects: subjects.length,
    missingCores: [],
    warnings,
    thirdCoreSelection: thirdCoreLabel, // 'science' or 'social'
  }
}

/**
 * KNUST-style aggregate. KNUST's 2025/26 admissions notice counts C4, C5, and C6
 * all as 4 points (instead of 4/5/6). Use this when comparing a student's grades
 * against a KNUST cutoff — using the standard aggregate would under-rate them
 * for KNUST programmes specifically.
 *
 * Returns the same shape as calculateWASSCEAggregate but with KNUST-scaled points.
 * Other universities (UG, UCC, UEW, …) should keep using calculateWASSCEAggregate.
 */
function calculateKNUSTAggregate(subjectsOrGrades, options = {}) {
  return calculateWASSCEAggregate(subjectsOrGrades, {
    ...options,
    gradeTable: KNUST_GRADE_POINTS,
  })
}

/**
 * Universities whose admissions use the KNUST C4=C5=C6=4 rule (per their public
 * admission notices). Use this set when deciding which aggregate to compare
 * against a programme's cutoff.
 */
const UNIVERSITIES_USING_KNUST_SCALE = new Set(['KNUST'])

module.exports = {
  calculateWASSCEAggregate,
  calculateKNUSTAggregate,
  gradeToPoints,
  classifyCore,
  GRADE_POINTS,
  KNUST_GRADE_POINTS,
  PASS_THRESHOLD,
  STREAMS_USING_SCIENCE_CORE,
  STREAMS_USING_SOCIAL_CORE,
  UNIVERSITIES_USING_KNUST_SCALE,
}
