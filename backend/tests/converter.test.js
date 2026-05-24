const {
  convertPercentageToCGPA,
  scholaroPercentageToCGPA,
  linearPercentageToCGPA,
  convertCGPAToPercentage,
  convertCGPAToPercentageLinear,
  validatePercentage,
} = require('../services/converter.service')

describe('converter.service — Scholaro/WES letter-grade method (Ghana CWA → USA GPA)', () => {
  test.each([
    [95, 4.0, 'A'],
    [85, 4.0, 'A'],
    [80, 4.0, 'A'],
    [79, 3.7, 'A-'],
    [75, 3.7, 'A-'],
    [74, 3.3, 'B+'],
    [70, 3.3, 'B+'],
    [69, 3.0, 'B'],
    [65, 3.0, 'B'],
    [64, 2.7, 'B-'],
    [60, 2.7, 'B-'],
    [59, 2.3, 'C+'],
    [55, 2.3, 'C+'],
    [54, 2.0, 'C'],
    [50, 2.0, 'C'],
    [49, 0.0, 'F'],
    [0, 0.0, 'F'],
  ])('CWA %d%% → CGPA %f (letter %s)', (cwa, expectedCgpa, expectedLetter) => {
    const r = scholaroPercentageToCGPA(cwa)
    expect(r.cgpa).toBe(expectedCgpa)
    expect(r.letter).toBe(expectedLetter)
    expect(r.method).toBe('scholaro')
  })

  test('default convertPercentageToCGPA uses Scholaro (NOT linear)', () => {
    const r = convertPercentageToCGPA(85)
    expect(r.cgpa).toBe(4.0) // Scholaro gives 4.0, linear would give 3.4
    expect(r.method).toBe('scholaro')
  })

  test('explicit linear method when requested', () => {
    const r = convertPercentageToCGPA(85, { method: 'linear' })
    expect(r.cgpa).toBe(3.4)
    expect(r.method).toBe('linear')
  })
})

describe('converter.service — input validation', () => {
  test.each([-1, 101, NaN, Infinity, 'abc', null, undefined])(
    'rejects invalid percentage: %p',
    (bad) => {
      expect(() => validatePercentage(bad)).toThrow()
    }
  )

  test('accepts 0 and 100 as bounds', () => {
    expect(() => validatePercentage(0)).not.toThrow()
    expect(() => validatePercentage(100)).not.toThrow()
  })
})

describe('converter.service — reverse CGPA → percentage (RANGE, not point — there is no canonical inverse)', () => {
  test('4.0 → range 80-100 with A+ letter and caveat', () => {
    const r = convertCGPAToPercentage(4.0)
    expect(r.min).toBe(80)
    expect(r.max).toBe(100)
    expect(r.letter).toBe('A+')
    expect(r.midpoint).toBe(90)
    expect(r.caveat).toMatch(/No official inverse/i)
  })

  test('3.5 → maps to A- band (75-79), not 87.5 like the old linear bug', () => {
    const r = convertCGPAToPercentage(3.5)
    // 3.5 is between A (3.7) and B+ (3.3) — round up to the next achievable letter.
    expect(r.letter).toBe('A')
    expect(r.min).toBe(75)
    expect(r.max).toBeCloseTo(79.999, 2)
  })

  test('0 → F band (0-49)', () => {
    const r = convertCGPAToPercentage(0)
    expect(r.letter).toBe('F')
    expect(r.min).toBe(0)
  })

  test('rejects out-of-range CGPA', () => {
    expect(() => convertCGPAToPercentage(-0.1)).toThrow()
    expect(() => convertCGPAToPercentage(4.1)).toThrow()
  })

  test('convertCGPAToPercentageLinear still available for legacy callers', () => {
    expect(convertCGPAToPercentageLinear(4.0)).toBe(100)
    expect(convertCGPAToPercentageLinear(3.5)).toBe(87.5)
    expect(convertCGPAToPercentageLinear(0)).toBe(0)
  })
})

describe('converter.service — Scholaro vs linear (the bug this fixes)', () => {
  test('Scholaro is significantly stricter for Ghana 70-79% range', () => {
    // Real example: KNUST B.Sc Computer Eng, CWA 73.54%
    // Linear formula: 73.54/100 * 4 = 2.94 (wrong — undersells the student)
    // Scholaro:      73.54 → B+ → 3.3 (closer to real WES evaluation)
    const linear = linearPercentageToCGPA(73.54)
    const scholaro = scholaroPercentageToCGPA(73.54)
    expect(scholaro.cgpa).toBeGreaterThan(linear.cgpa)
    expect(scholaro.cgpa).toBe(3.3)
  })

  test('Scholaro flattens grades within the same letter band', () => {
    // 65% and 69% both fall in the B band → same GPA points
    expect(scholaroPercentageToCGPA(65).cgpa).toBe(scholaroPercentageToCGPA(69).cgpa)
  })
})
