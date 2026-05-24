const {
  calculateWASSCEAggregate,
  calculateKNUSTAggregate,
  gradeToPoints,
  classifyCore,
  GRADE_POINTS,
  KNUST_GRADE_POINTS,
} = require('../services/wassce.service')

describe('wassce.service — grade point mapping', () => {
  test('uses the official 9-grade WAEC scale (A1..F9)', () => {
    expect(GRADE_POINTS).toEqual({
      A1: 1, B2: 2, B3: 3, C4: 4, C5: 5, C6: 6, D7: 7, E8: 8, F9: 9,
    })
  })

  test('throws on invalid grades (e.g. A2, D8 — not real WASSCE grades)', () => {
    expect(() => gradeToPoints('A2')).toThrow(/Invalid WASSCE grade/)
    expect(() => gradeToPoints('D8')).toThrow(/Invalid WASSCE grade/)
    expect(() => gradeToPoints('')).toThrow(/Invalid WASSCE grade/)
    expect(() => gradeToPoints(null)).toThrow(/Invalid WASSCE grade/)
  })

  test('A1 = 1 point (best), F9 = 9 points (worst)', () => {
    expect(gradeToPoints('A1')).toBe(1)
    expect(gradeToPoints('F9')).toBe(9)
  })
})

describe('wassce.service — core subject classification', () => {
  test('recognises core subjects across naming variants', () => {
    expect(classifyCore('English Language')).toBe('english')
    expect(classifyCore('English')).toBe('english')
    expect(classifyCore('Core English')).toBe('english')

    expect(classifyCore('Core Mathematics')).toBe('mathematics')
    expect(classifyCore('Mathematics')).toBe('mathematics')
    expect(classifyCore('Math')).toBe('mathematics')

    expect(classifyCore('Integrated Science')).toBe('science')
    expect(classifyCore('Core Science')).toBe('science')

    expect(classifyCore('Social Studies')).toBe('social')
  })

  test('does NOT mis-classify Elective Mathematics as a core', () => {
    expect(classifyCore('Elective Mathematics')).toBeNull()
    expect(classifyCore('Additional Mathematics')).toBeNull()
  })

  test('returns null for electives', () => {
    expect(classifyCore('Physics')).toBeNull()
    expect(classifyCore('Chemistry')).toBeNull()
    expect(classifyCore('Economics')).toBeNull()
    expect(classifyCore('Geography')).toBeNull()
  })
})

describe('wassce.service — legacy bare-grade mode', () => {
  test('best 6 by lowest points (legacy behaviour)', () => {
    const res = calculateWASSCEAggregate(
      ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8'],
      { strict: false }
    )
    expect(res.aggregate).toBe(1 + 2 + 3 + 4 + 5 + 6)
    expect(res.totalSubjects).toBe(8)
    expect(res.warnings.length).toBeGreaterThan(0)
  })

  test('rejects fewer than 6 subjects', () => {
    expect(() => calculateWASSCEAggregate(['A1', 'B2', 'B3'])).toThrow(/At least 6/)
  })

  test('all A1 → aggregate 6 (best possible)', () => {
    const res = calculateWASSCEAggregate(
      Array(8).fill('A1'),
      { strict: false }
    )
    expect(res.aggregate).toBe(6)
  })

  test('all F9 → aggregate 54 (worst possible)', () => {
    const res = calculateWASSCEAggregate(
      Array(8).fill('F9'),
      { strict: false }
    )
    expect(res.aggregate).toBe(54)
  })
})

describe('wassce.service — core-enforced aggregate (the WAEC-correct algorithm)', () => {
  const scienceStudent = [
    { name: 'English Language', grade: 'B2' },     // core - 2pt
    { name: 'Core Mathematics', grade: 'B3' },     // core - 3pt
    { name: 'Integrated Science', grade: 'C4' },   // core - 4pt (sci stream → 3rd core)
    { name: 'Social Studies', grade: 'A1' },       // would-be core if Arts stream
    { name: 'Physics', grade: 'A1' },              // elective - 1pt
    { name: 'Chemistry', grade: 'B2' },            // elective - 2pt
    { name: 'Biology', grade: 'B3' },              // elective - 3pt
    { name: 'Elective Mathematics', grade: 'B2' }, // elective - 2pt (not a core!)
  ]

  test('picks 3 cores + 3 best electives, NOT plain best 6', () => {
    const res = calculateWASSCEAggregate(scienceStudent, { courseStream: 'science' })

    // Cores: English B2(2) + Math B3(3) + Integrated Science C4(4) = 9
    // Electives pool: Social Studies A1(1), Physics A1(1), Chemistry B2(2), Elective Math B2(2), Biology B3(3)
    //   (Social Studies becomes an elective in science stream since Integrated Science is the 3rd core)
    // Best 3 electives: 1 + 1 + 2 = 4
    // Total = 13
    expect(res.aggregate).toBe(13)
    expect(res.cores).toHaveLength(3)
    expect(res.electives).toHaveLength(3)
    expect(res.thirdCoreSelection).toBe('science')
  })

  test('arts stream uses Social Studies instead of Integrated Science', () => {
    const res = calculateWASSCEAggregate(scienceStudent, { courseStream: 'arts' })
    // Cores: English B2(2) + Math B3(3) + Social Studies A1(1) = 6
    // Best 3 electives from {Physics A1, Chemistry B2, Biology B3, Elective Math B2, Integrated Science C4}
    //   → Physics A1(1) + Chemistry B2(2) + Elective Math B2(2) = 5
    // Total = 11
    expect(res.aggregate).toBe(11)
    expect(res.thirdCoreSelection).toBe('social')
  })

  test('best-6-by-points would have given a DIFFERENT (and wrong) answer', () => {
    // If the algorithm just took raw best 6 by points (the old bug):
    // sorted: Physics A1(1), Social Studies A1(1), English B2(2), Chemistry B2(2), Elective Math B2(2), Math B3(3) = 11
    // But the WAEC-correct aggregate for science stream is 13, because Integrated Science (C4=4)
    // MUST be one of the cores — it can't be silently dropped in favour of a stronger non-core.
    const strictRes = calculateWASSCEAggregate(scienceStudent, { courseStream: 'science' })
    expect(strictRes.aggregate).not.toBe(11) // verify the bug fix
    expect(strictRes.aggregate).toBe(13)
  })

  test('errors with code MISSING_CORES if English is absent', () => {
    const missing = [
      { name: 'Core Mathematics', grade: 'A1' },
      { name: 'Integrated Science', grade: 'A1' },
      { name: 'Physics', grade: 'A1' },
      { name: 'Chemistry', grade: 'A1' },
      { name: 'Biology', grade: 'A1' },
      { name: 'Elective Maths', grade: 'A1' },
    ]
    expect(() => calculateWASSCEAggregate(missing, { courseStream: 'science' })).toThrow(/Missing.*English/i)
  })

  test('non-strict mode falls back to best 6 but flags missing cores', () => {
    const missing = [
      { name: 'Core Mathematics', grade: 'A1' },
      { name: 'Integrated Science', grade: 'A1' },
      { name: 'Physics', grade: 'A1' },
      { name: 'Chemistry', grade: 'A1' },
      { name: 'Biology', grade: 'A1' },
      { name: 'Elective Maths', grade: 'A1' },
    ]
    const res = calculateWASSCEAggregate(missing, { strict: false })
    expect(res.aggregate).toBe(6)
    expect(res.missingCores).toContain('English Language')
    expect(res.warnings.length).toBeGreaterThan(0)
  })

  test('warns if a core grade is below C6 (most degree programs require ≤C6 in cores)', () => {
    const weakCore = [
      { name: 'English Language', grade: 'D7' },     // weak core
      { name: 'Core Mathematics', grade: 'C6' },
      { name: 'Integrated Science', grade: 'C5' },
      { name: 'Physics', grade: 'A1' },
      { name: 'Chemistry', grade: 'A1' },
      { name: 'Biology', grade: 'A1' },
    ]
    const res = calculateWASSCEAggregate(weakCore, { courseStream: 'science' })
    expect(res.warnings.some((w) => /below C6/i.test(w))).toBe(true)
  })
})

describe('wassce.service — per-stream third-core selection (regression: kebab-case stream IDs)', () => {
  // Bug we're guarding against: prior to the fix, normalize() replaced hyphens with spaces,
  // so 'visual-arts' became 'visual arts' which never matched the kebab-case Sets, and ALL
  // hyphenated streams silently fell through to "always pick Integrated Science."
  const balancedSubjects = (extras = []) => [
    { name: 'English Language', grade: 'B2' },
    { name: 'Core Mathematics', grade: 'C5' },
    { name: 'Integrated Science', grade: 'D7' }, // intentionally weaker than Social
    { name: 'Social Studies', grade: 'B2' },     // intentionally stronger than Science
    ...extras,
  ]

  test('visual-arts picks Social Studies as third core (not Science)', () => {
    const res = calculateWASSCEAggregate(
      balancedSubjects([
        { name: 'General Knowledge in Art', grade: 'A1' },
        { name: 'Graphic Design', grade: 'B2' },
        { name: 'Picture Making', grade: 'B3' },
      ]),
      { courseStream: 'visual-arts' }
    )
    expect(res.thirdCoreSelection).toBe('social')
  })

  test('home-economics picks Integrated Science (HE students apply to Nursing/Nutrition)', () => {
    const res = calculateWASSCEAggregate(
      [
        { name: 'English Language', grade: 'B2' },
        { name: 'Core Mathematics', grade: 'B3' },
        { name: 'Integrated Science', grade: 'B3' },
        { name: 'Social Studies', grade: 'A1' }, // stronger than Science — but stream still picks Science
        { name: 'Food and Nutrition', grade: 'A1' },
        { name: 'Biology', grade: 'B2' },
        { name: 'Chemistry', grade: 'B3' },
      ],
      { courseStream: 'home-economics' }
    )
    expect(res.thirdCoreSelection).toBe('science')
    expect(res.cores.find((c) => c.coreType === 'science')).toBeDefined()
  })

  test('technical picks Integrated Science as third core', () => {
    const res = calculateWASSCEAggregate(
      [
        { name: 'English Language', grade: 'B3' },
        { name: 'Core Mathematics', grade: 'C4' },
        { name: 'Integrated Science', grade: 'B3' },
        { name: 'Social Studies', grade: 'C5' },
        { name: 'Technical Drawing', grade: 'A1' },
        { name: 'Building Construction', grade: 'B2' },
        { name: 'Applied Electricity', grade: 'C4' },
      ],
      { courseStream: 'technical' }
    )
    expect(res.thirdCoreSelection).toBe('science')
  })

  test('agricultural-science picks Integrated Science as third core', () => {
    const res = calculateWASSCEAggregate(
      [
        { name: 'English Language', grade: 'B3' },
        { name: 'Core Mathematics', grade: 'C4' },
        { name: 'Integrated Science', grade: 'B2' },
        { name: 'Social Studies', grade: 'B3' },
        { name: 'General Agriculture', grade: 'A1' },
        { name: 'Chemistry', grade: 'B2' },
        { name: 'Biology', grade: 'B3' },
      ],
      { courseStream: 'agricultural-science' }
    )
    expect(res.thirdCoreSelection).toBe('science')
  })

  test('general-arts picks Social Studies as third core', () => {
    const res = calculateWASSCEAggregate(
      balancedSubjects([
        { name: 'Literature-in-English', grade: 'A1' },
        { name: 'Geography', grade: 'B2' },
        { name: 'History', grade: 'B3' },
      ]),
      { courseStream: 'general-arts' }
    )
    expect(res.thirdCoreSelection).toBe('social')
  })

  test('business picks Social Studies as third core', () => {
    const res = calculateWASSCEAggregate(
      balancedSubjects([
        { name: 'Financial Accounting', grade: 'A1' },
        { name: 'Economics', grade: 'B2' },
        { name: 'Business Management', grade: 'B3' },
      ]),
      { courseStream: 'business' }
    )
    expect(res.thirdCoreSelection).toBe('social')
  })

  test('unknown stream falls back to whichever core has the better grade', () => {
    // No courseStream → no preference → pick the better of (Science, Social)
    const res = calculateWASSCEAggregate(
      [
        { name: 'English Language', grade: 'B2' },
        { name: 'Core Mathematics', grade: 'C5' },
        { name: 'Integrated Science', grade: 'D7' }, // 7
        { name: 'Social Studies', grade: 'B2' },     // 2 — better
        { name: 'Literature-in-English', grade: 'A1' },
        { name: 'Geography', grade: 'B2' },
        { name: 'History', grade: 'B3' },
      ]
    )
    expect(res.thirdCoreSelection).toBe('social')
  })
})

describe('wassce.service — real-world examples from the ALGORITHMS.md spec', () => {
  test('Spec example: 8 subjects {A1, B2, B3, C4, C5, C6, D7, E8}', () => {
    // Per the spec's Test Case 3, the answer is 21. But that's only valid if those 8
    // subjects happen to be assignable as 3 cores + 3 best electives. We replicate
    // using named subjects to keep the math honest:
    const subjects = [
      { name: 'English Language', grade: 'A1' },
      { name: 'Core Mathematics', grade: 'B2' },
      { name: 'Integrated Science', grade: 'B3' },
      { name: 'Physics', grade: 'C4' },
      { name: 'Chemistry', grade: 'C5' },
      { name: 'Biology', grade: 'C6' },
      { name: 'Elective Mathematics', grade: 'D7' },
      { name: 'Geography', grade: 'E8' },
    ]
    const res = calculateWASSCEAggregate(subjects, { courseStream: 'science' })
    // Cores: 1 + 2 + 3 = 6
    // Best 3 electives: 4 + 5 + 6 = 15
    // Total = 21 (matches spec)
    expect(res.aggregate).toBe(21)
  })
})

describe('wassce.service — KNUST aggregate variant (C4=C5=C6=4)', () => {
  test('KNUST_GRADE_POINTS treats C4, C5, C6 all as 4', () => {
    expect(KNUST_GRADE_POINTS).toEqual({
      A1: 1, B2: 2, B3: 3, C4: 4, C5: 4, C6: 4, D7: 7, E8: 8, F9: 9,
    })
  })

  test('a student with C5/C6 grades gets a BETTER aggregate at KNUST than standard', () => {
    const subjects = [
      { name: 'English Language', grade: 'B3' },        // 3 (both)
      { name: 'Core Mathematics', grade: 'C5' },        // standard 5, KNUST 4
      { name: 'Integrated Science', grade: 'B3' },      // 3 (both)
      { name: 'Physics', grade: 'C5' },                 // standard 5, KNUST 4
      { name: 'Chemistry', grade: 'C6' },               // standard 6, KNUST 4
      { name: 'Biology', grade: 'C4' },                 // 4 (both)
      { name: 'Elective Mathematics', grade: 'C6' },    // standard 6, KNUST 4
    ]
    const standard = calculateWASSCEAggregate(subjects, { courseStream: 'science' })
    const knust = calculateKNUSTAggregate(subjects, { courseStream: 'science' })

    // Standard cores: 3 + 5 + 3 = 11; best 3 electives: C4(4) + C5(5) + C6(6) = 15; total 26
    // KNUST cores:    3 + 4 + 3 = 10; best 3 electives: 4 + 4 + 4 = 12; total 22
    expect(standard.aggregate).toBe(26)
    expect(knust.aggregate).toBe(22)
    expect(knust.aggregate).toBeLessThan(standard.aggregate)
  })

  test('A1/B2/B3/D7/E8/F9 grades are unchanged between standard and KNUST', () => {
    const subjects = [
      { name: 'English Language', grade: 'A1' },
      { name: 'Core Mathematics', grade: 'B2' },
      { name: 'Integrated Science', grade: 'B3' },
      { name: 'Physics', grade: 'A1' },
      { name: 'Chemistry', grade: 'D7' },
      { name: 'Biology', grade: 'E8' },
      { name: 'Elective Mathematics', grade: 'F9' },
    ]
    const standard = calculateWASSCEAggregate(subjects, { courseStream: 'science' })
    const knust = calculateKNUSTAggregate(subjects, { courseStream: 'science' })
    expect(knust.aggregate).toBe(standard.aggregate)
  })

  test('KNUST aggregate enforces the same core-subject rules as standard', () => {
    expect(() =>
      calculateKNUSTAggregate(
        [
          { name: 'Core Mathematics', grade: 'A1' },
          { name: 'Integrated Science', grade: 'A1' },
          { name: 'Physics', grade: 'A1' },
          { name: 'Chemistry', grade: 'A1' },
          { name: 'Biology', grade: 'A1' },
          { name: 'Elective Maths', grade: 'A1' },
        ],
        { courseStream: 'science' }
      )
    ).toThrow(/Missing.*English/i)
  })

  test('returns the same shape (cores, electives, warnings, thirdCoreSelection)', () => {
    const subjects = [
      { name: 'English Language', grade: 'B2' },
      { name: 'Core Mathematics', grade: 'C5' },
      { name: 'Integrated Science', grade: 'C5' },
      { name: 'Physics', grade: 'B2' },
      { name: 'Chemistry', grade: 'B3' },
      { name: 'Biology', grade: 'C4' },
      { name: 'Elective Mathematics', grade: 'C5' },
    ]
    const knust = calculateKNUSTAggregate(subjects, { courseStream: 'science' })
    expect(knust).toHaveProperty('cores')
    expect(knust).toHaveProperty('electives')
    expect(knust).toHaveProperty('best6')
    expect(knust).toHaveProperty('thirdCoreSelection', 'science')
    expect(knust.cores).toHaveLength(3)
    expect(knust.electives).toHaveLength(3)
  })
})
