const {
  GHANA_UNIVERSITIES,
  percentageToLetter,
  percentageToPoints,
  cwaToClassification,
  cgpaToClassification,
  calculateGhanaCGPA,
  calculateCWA,
  calculateScholaroGPA,
  gpaToScholaroPercentageRange,
  KNUST_BANDS,
  UG_BANDS,
  SCHOLARO_BANDS,
} = require('../services/ghanaGrading.service')

describe('ghanaGrading — registry', () => {
  test('exposes KNUST, UG, UCC, UEW', () => {
    expect(Object.keys(GHANA_UNIVERSITIES).sort()).toEqual(['KNUST', 'UCC', 'UEW', 'UG'])
  })
  test('KNUST scale is CWA (0-100), no GPA', () => {
    expect(GHANA_UNIVERSITIES.KNUST.scaleType).toBe('CWA')
    expect(GHANA_UNIVERSITIES.KNUST.scaleMax).toBe(100)
    expect(percentageToPoints('KNUST', 75)).toBeNull()
  })
  test('UG/UCC/UEW are CGPA (0-4.0)', () => {
    for (const id of ['UG', 'UCC', 'UEW']) {
      expect(GHANA_UNIVERSITIES[id].scaleType).toBe('CGPA')
      expect(GHANA_UNIVERSITIES[id].scaleMax).toBe(4.0)
    }
  })
  test('unknown university throws', () => {
    expect(() => percentageToLetter('YALE', 80)).toThrow(/Unknown Ghana university/)
  })
})

describe('ghanaGrading — KNUST 6-letter scheme (A starts at 70, NOT 80)', () => {
  test.each([
    [85, 'A'], [70, 'A'],
    [65, 'B'], [60, 'B'],
    [55, 'C'], [50, 'C'],
    [48, 'D'], [45, 'D'],
    [42, 'E'], [40, 'E'],
    [39, 'F'], [0, 'F'],
  ])('KNUST: %d%% → %s', (pct, letter) => {
    expect(percentageToLetter('KNUST', pct)).toBe(letter)
  })

  test('KNUST 70% is A (CRITICAL — at UG/UCC/UEW the same 70% is only B)', () => {
    expect(percentageToLetter('KNUST', 70)).toBe('A')
    expect(percentageToLetter('UG', 70)).toBe('B')
    expect(percentageToLetter('UCC', 70)).toBe('B')
    expect(percentageToLetter('UEW', 70)).toBe('B')
  })
})

describe('ghanaGrading — UG/UCC/UEW 9-letter 4.0 scheme', () => {
  test.each([
    [85, 'A',  4.0],
    [78, 'B+', 3.5],
    [72, 'B',  3.0],
    [67, 'C+', 2.5],
    [62, 'C',  2.0],
    [57, 'D+', 1.5],
    [52, 'D',  1.0],
    [47, 'E',  0.5],
    [40, 'F',  0.0],
  ])('UG: %d%% → %s (%f pts)', (pct, letter, pts) => {
    expect(percentageToLetter('UG', pct)).toBe(letter)
    expect(percentageToPoints('UG', pct)).toBe(pts)
  })

  test('UCC and UEW use the same letter→% bands as UG', () => {
    for (const pct of [85, 75, 72, 65, 60, 55, 50, 45, 0]) {
      const ug = percentageToLetter('UG', pct)
      expect(percentageToLetter('UCC', pct)).toBe(ug)
      expect(percentageToLetter('UEW', pct)).toBe(ug)
    }
  })
})

describe('ghanaGrading — KNUST CWA classifications', () => {
  test.each([
    [75,  'First Class'],
    [70,  'First Class'],
    [69,  'Second Class Upper'],
    [60,  'Second Class Upper'],
    [55,  'Second Class Lower'],
    [50,  'Second Class Lower'],
    [49,  'Third Class'],
    [45,  'Third Class'],
    [44,  'Pass'],
    [40,  'Pass'],
    [39,  'Fail'],
  ])('KNUST CWA %d → %s', (cwa, label) => {
    expect(cwaToClassification('KNUST', cwa)).toBe(label)
  })

  test('Pass tier (40-44) exists at KNUST — was missing from the legacy converter', () => {
    expect(cwaToClassification('KNUST', 42)).toBe('Pass')
  })
})

describe('ghanaGrading — UG vs UCC vs UEW classifications (SAME CGPA, DIFFERENT CLASS)', () => {
  test('A CGPA of 2.50 is Second Class Lower at UCC/UEW but Second Class Upper at UG? Check.', () => {
    // UG 2nd Lower: 2.00-2.99 → 2.50 is "Second Class Lower"
    // UCC 2nd Lower: 2.50-2.999 → 2.50 is "Second Class Lower"
    // UEW 2nd Lower: 2.50-2.999 → 2.50 is "Second Class Lower"
    expect(cgpaToClassification('UG',  2.50)).toBe('Second Class Lower')
    expect(cgpaToClassification('UCC', 2.50)).toBe('Second Class Lower')
    expect(cgpaToClassification('UEW', 2.50)).toBe('Second Class Lower')
  })

  test('A CGPA of 2.30 is Second Class Lower at UG but Third Class at UCC/UEW', () => {
    expect(cgpaToClassification('UG',  2.30)).toBe('Second Class Lower')
    expect(cgpaToClassification('UCC', 2.30)).toBe('Third Class')
    expect(cgpaToClassification('UEW', 2.30)).toBe('Third Class')
  })

  test('A CGPA of 3.55 is First Class at UEW but Second Class Upper at UG/UCC', () => {
    expect(cgpaToClassification('UEW', 3.55)).toBe('First Class')
    expect(cgpaToClassification('UG',  3.55)).toBe('Second Class Upper')
    expect(cgpaToClassification('UCC', 3.55)).toBe('Second Class Upper')
  })

  test('First Class threshold per uni: UG=3.60, UCC=3.60, UEW=3.50', () => {
    expect(cgpaToClassification('UG',  3.60)).toBe('First Class')
    expect(cgpaToClassification('UG',  3.59)).toBe('Second Class Upper')
    expect(cgpaToClassification('UCC', 3.60)).toBe('First Class')
    expect(cgpaToClassification('UCC', 3.59)).toBe('Second Class Upper')
    expect(cgpaToClassification('UEW', 3.50)).toBe('First Class')
    expect(cgpaToClassification('UEW', 3.49)).toBe('Second Class Upper')
  })

  test('cgpaToClassification rejects KNUST (KNUST uses CWA, not CGPA)', () => {
    expect(() => cgpaToClassification('KNUST', 3.5)).toThrow(/does not use CGPA/i)
  })

  test('cwaToClassification rejects UG/UCC/UEW (they use CGPA)', () => {
    expect(() => cwaToClassification('UG', 75)).toThrow(/does not use CWA/i)
  })
})

describe('ghanaGrading — calculateGhanaCGPA (course-by-course)', () => {
  const courses = [
    { name: 'Math',    score: '85', creditHours: '3' }, // UG: A → 4.0
    { name: 'Physics', score: '72', creditHours: '4' }, // UG: B → 3.0
    { name: 'Chem',    score: '67', creditHours: '3' }, // UG: C+ → 2.5
  ]

  test('UG: weighted by credits (4.0×3 + 3.0×4 + 2.5×3) / 10 = 3.15', () => {
    // 12 + 12 + 7.5 = 31.5 / 10 = 3.15
    expect(calculateGhanaCGPA(courses, 'UG')).toBe(3.15)
  })

  test('UCC produces the same number as UG (same bands)', () => {
    expect(calculateGhanaCGPA(courses, 'UCC')).toBe(3.15)
  })

  test('returns null for KNUST (no official CGPA)', () => {
    expect(calculateGhanaCGPA(courses, 'KNUST')).toBeNull()
  })

  test('throws on empty / zero-credit input', () => {
    expect(() => calculateGhanaCGPA([], 'UG')).toThrow()
    expect(() =>
      calculateGhanaCGPA([{ name: 'X', score: '70', creditHours: '0' }], 'UG')
    ).toThrow(/credit hours/i)
  })
})

describe('ghanaGrading — calculateCWA', () => {
  test('weighted percentage average regardless of university', () => {
    const courses = [
      { name: 'A', score: '85', creditHours: '3' },
      { name: 'B', score: '90', creditHours: '4' },
      { name: 'C', score: '78', creditHours: '3' },
    ]
    // (85×3 + 90×4 + 78×3) / 10 = (255 + 360 + 234) / 10 = 84.9
    expect(calculateCWA(courses)).toBe(84.9)
  })
})

describe('ghanaGrading — Scholaro WES (course-by-course for US grad apps)', () => {
  test('canonical 3-course example matches the legacy converter', () => {
    const courses = [
      { name: 'Math',    score: '85', creditHours: '3' }, // A+ → 4.0
      { name: 'Physics', score: '73', creditHours: '4' }, // B+ → 3.3
      { name: 'Chem',    score: '62', creditHours: '3' }, // B- → 2.7
    ]
    // 12 + 13.2 + 8.1 = 33.3 / 10 = 3.33
    expect(calculateScholaroGPA(courses)).toBe(3.33)
  })

  test('SCHOLARO_BANDS uses 8 letters (A+ at 80, A at 75 — NOT identical to KNUST or UG)', () => {
    expect(SCHOLARO_BANDS.find((b) => b.min === 80).letter).toBe('A+')
    expect(SCHOLARO_BANDS.find((b) => b.min === 75).letter).toBe('A')
  })
})

describe('ghanaGrading — GPA → percentage reverse (range, not point)', () => {
  test('3.5 GPA → range with caveat, not a false-precise number', () => {
    const r = gpaToScholaroPercentageRange(3.5)
    expect(r).toHaveProperty('min')
    expect(r).toHaveProperty('max')
    expect(r).toHaveProperty('letter')
    expect(r.caveat).toMatch(/No official inverse/i)
  })

  test('4.0 GPA → 80-100% range (A+)', () => {
    const r = gpaToScholaroPercentageRange(4.0)
    expect(r.min).toBe(80)
    expect(r.max).toBe(100)
    expect(r.letter).toBe('A+')
  })

  test('3.0 GPA → 65-69 range (B)', () => {
    const r = gpaToScholaroPercentageRange(3.0)
    expect(r.min).toBe(65)
    expect(r.letter).toBe('B')
  })
})

describe('ghanaGrading — regression: the "KNUST graduate drops a class" warning', () => {
  test('KNUST CWA 70 is First Class internally — must NOT be classified as Second Upper', () => {
    expect(cwaToClassification('KNUST', 70)).toBe('First Class')
    // Linear /4×100 would give 2.8 GPA which is "Second Class Lower" at UG — this is the
    // bug the WES research warned about. Make sure we never silently apply a linear conversion.
    expect(calculateGhanaCGPA([{ name: 'X', score: 70, creditHours: 3 }], 'KNUST')).toBeNull()
  })
})
