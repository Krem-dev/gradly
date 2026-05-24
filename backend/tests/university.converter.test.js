const {
  calculateWeightedAverage,
  calculateScholaroGPA,
  convertGrade,
  getDegreeClassification,
} = require('../services/university.converter.service')

describe('university.converter — weighted average', () => {
  test('canonical example: 85×3 + 90×4 + 78×3 / 10 = 84.9', () => {
    const courses = [
      { name: 'Math',    score: '85', creditHours: '3' },
      { name: 'Physics', score: '90', creditHours: '4' },
      { name: 'Chem',    score: '78', creditHours: '3' },
    ]
    expect(calculateWeightedAverage(courses)).toBe(84.9)
  })

  test('single course returns its own score', () => {
    expect(calculateWeightedAverage([{ name: 'X', score: '72', creditHours: '3' }])).toBe(72)
  })

  test('rejects empty / zero-credit input', () => {
    expect(() => calculateWeightedAverage([])).toThrow()
    expect(() => calculateWeightedAverage([{ name: 'X', score: '50', creditHours: '0' }])).toThrow()
  })

  test('rejects non-numeric score', () => {
    expect(() => calculateWeightedAverage([{ name: 'X', score: 'A', creditHours: '3' }])).toThrow()
  })
})

describe('university.converter — Scholaro GPA (course-by-course)', () => {
  const courses = [
    { name: 'Math',    score: '85', creditHours: '3' },
    { name: 'Physics', score: '73', creditHours: '4' },
    { name: 'Chem',    score: '62', creditHours: '3' },
  ]

  test('weighted by credit hours, using Scholaro letter mapping', async () => {
    // Math 85% → A → 4.0 × 3 = 12.0
    // Physics 73% → B+ → 3.3 × 4 = 13.2
    // Chem 62% → B- → 2.7 × 3 = 8.1
    // Total = 33.3, credits = 10, GPA = 3.33
    const gpa = await calculateScholaroGPA(courses, 'ghana_cwa')
    expect(gpa).toBe(3.33)
  })

  test('returns null for non-Ghana-CWA systems (Scholaro only applies to Ghana percentages)', async () => {
    const gpa = await calculateScholaroGPA(courses, 'nigeria_cgpa_5')
    expect(gpa).toBeNull()
  })

  test('throws on bad input', async () => {
    await expect(calculateScholaroGPA([], 'ghana_cwa')).rejects.toThrow()
  })
})

describe('university.converter — convertGrade (single-score conversion)', () => {
  test('ghana_gpa: 1:1 with USA GPA, percent via /4*100', () => {
    const r = convertGrade('ghana_gpa', 3.6)
    expect(r.usaGpa).toBe(3.6)
    expect(r.ukPercentage).toBe(90)
    expect(r.degreeClassification.sourceClassification).toBe('First Class')
  })

  test('ghana_cwa uses Scholaro letter mapping (NOT linear)', () => {
    const r = convertGrade('ghana_cwa', 73)
    // 73% → B+ → 3.3
    expect(r.usaGpa).toBe(3.3)
    expect(r.ukPercentage).toBe(73)
  })

  test('nigeria_cgpa_5 linearly scaled to 4.0', () => {
    const r = convertGrade('nigeria_cgpa_5', 4.5)
    // 4.5/5 * 4 = 3.6
    expect(r.usaGpa).toBe(3.6)
    expect(r.ukPercentage).toBe(90)
  })

  test('nigeria_cgpa_4 direct mapping', () => {
    const r = convertGrade('nigeria_cgpa_4', 3.5)
    expect(r.usaGpa).toBe(3.5)
    expect(r.ukPercentage).toBe(87.5)
  })

  test('rejects unknown system', () => {
    expect(() => convertGrade('mars_gpa', 3.0)).toThrow(/Unsupported grading system/)
  })

  test('rejects out-of-range score', () => {
    expect(() => convertGrade('ghana_gpa', 4.5)).toThrow()
    expect(() => convertGrade('nigeria_cgpa_5', -0.1)).toThrow()
  })
})

describe('university.converter — degree classification', () => {
  test('Ghana CWA 70% → First Class', () => {
    expect(getDegreeClassification('ghana_cwa', 70).sourceClassification).toBe('First Class')
  })
  test('Ghana CWA 60% → Second Class Upper', () => {
    expect(getDegreeClassification('ghana_cwa', 60).sourceClassification).toBe('Second Class Upper')
  })
  test('Ghana CWA 50% → Second Class Lower', () => {
    expect(getDegreeClassification('ghana_cwa', 50).sourceClassification).toBe('Second Class Lower')
  })
  test('Ghana CWA 40% → Third Class', () => {
    expect(getDegreeClassification('ghana_cwa', 40).sourceClassification).toBe('Third Class')
  })
  test('Ghana CWA 39% → Fail', () => {
    expect(getDegreeClassification('ghana_cwa', 39).sourceClassification).toBe('Fail')
  })
})
