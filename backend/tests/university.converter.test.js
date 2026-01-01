const {
  convertGrade,
  calculateWeightedAverage,
  getDegreeClassification,
  CONVERSION_RULES,
  GRADING_SYSTEMS
} = require('../services/university.converter.service')

console.log('='.repeat(80))
console.log('UNIVERSITY GRADE CONVERTER - COMPREHENSIVE TEST SUITE')
console.log('='.repeat(80))

let passedTests = 0
let failedTests = 0

function assert(condition, testName, expected, actual) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`)
    passedTests++
  } else {
    console.log(`✗ FAIL: ${testName}`)
    console.log(`  Expected: ${expected}`)
    console.log(`  Actual: ${actual}`)
    failedTests++
  }
}

function assertApprox(actual, expected, tolerance, testName) {
  const diff = Math.abs(actual - expected)
  if (diff <= tolerance) {
    console.log(`✓ PASS: ${testName}`)
    passedTests++
  } else {
    console.log(`✗ FAIL: ${testName}`)
    console.log(`  Expected: ${expected} (±${tolerance})`)
    console.log(`  Actual: ${actual}`)
    console.log(`  Difference: ${diff}`)
    failedTests++
  }
}

console.log('\n' + '='.repeat(80))
console.log('TEST 1: Ghana CWA (Percentage) Conversions')
console.log('='.repeat(80))

const ghanaCWATests = [
  { cwa: 85, expectedUSA: 3.4, expectedUK: 85, classification: 'First Class' },
  { cwa: 70, expectedUSA: 2.8, expectedUK: 70, classification: 'First Class' },
  { cwa: 65, expectedUSA: 2.6, expectedUK: 65, classification: 'Second Class Upper' },
  { cwa: 55, expectedUSA: 2.2, expectedUK: 55, classification: 'Second Class Lower' },
  { cwa: 45, expectedUSA: 1.8, expectedUK: 45, classification: 'Third Class' }
]

ghanaCWATests.forEach(test => {
  const result = convertGrade('ghana_cwa', test.cwa)
  assertApprox(result.usaGpa, test.expectedUSA, 0.01, 
    `Ghana CWA ${test.cwa}% → USA GPA ${test.expectedUSA}`)
  assertApprox(result.ukPercentage, test.expectedUK, 0.01, 
    `Ghana CWA ${test.cwa}% → UK ${test.expectedUK}%`)
  assert(result.degreeClassification.sourceClassification === test.classification,
    `Ghana CWA ${test.cwa}% classification`,
    test.classification,
    result.degreeClassification.sourceClassification)
})

console.log('\n' + '='.repeat(80))
console.log('TEST 2: Ghana GPA (4.0 Scale) Conversions')
console.log('='.repeat(80))

const ghanaGPATests = [
  { gpa: 4.0, expectedUSA: 4.0, expectedUK: 100, classification: 'First Class' },
  { gpa: 3.6, expectedUSA: 3.6, expectedUK: 90, classification: 'First Class' },
  { gpa: 3.3, expectedUSA: 3.3, expectedUK: 82.5, classification: 'Second Class Upper' },
  { gpa: 2.5, expectedUSA: 2.5, expectedUK: 62.5, classification: 'Second Class Lower' },
  { gpa: 1.8, expectedUSA: 1.8, expectedUK: 45, classification: 'Third Class' }
]

ghanaGPATests.forEach(test => {
  const result = convertGrade('ghana_gpa', test.gpa)
  assertApprox(result.usaGpa, test.expectedUSA, 0.01, 
    `Ghana GPA ${test.gpa} → USA GPA ${test.expectedUSA}`)
  assertApprox(result.ukPercentage, test.expectedUK, 0.01, 
    `Ghana GPA ${test.gpa} → UK ${test.expectedUK}%`)
  assert(result.degreeClassification.sourceClassification === test.classification,
    `Ghana GPA ${test.gpa} classification`,
    test.classification,
    result.degreeClassification.sourceClassification)
})

console.log('\n' + '='.repeat(80))
console.log('TEST 3: Nigeria CGPA (5.0 Scale) Conversions')
console.log('='.repeat(80))

const nigeriaCGPA5Tests = [
  { cgpa: 5.0, expectedUSA: 4.0, expectedUK: 100, classification: 'First Class' },
  { cgpa: 4.5, expectedUSA: 3.6, expectedUK: 90, classification: 'First Class' },
  { cgpa: 4.0, expectedUSA: 3.2, expectedUK: 80, classification: 'Second Class Upper' },
  { cgpa: 3.5, expectedUSA: 2.8, expectedUK: 70, classification: 'Second Class Upper' },
  { cgpa: 3.0, expectedUSA: 2.4, expectedUK: 60, classification: 'Second Class Lower' },
  { cgpa: 2.5, expectedUSA: 2.0, expectedUK: 50, classification: 'Second Class Lower' }
]

nigeriaCGPA5Tests.forEach(test => {
  const result = convertGrade('nigeria_cgpa_5', test.cgpa)
  assertApprox(result.usaGpa, test.expectedUSA, 0.01, 
    `Nigeria CGPA ${test.cgpa} (5.0) → USA GPA ${test.expectedUSA}`)
  assertApprox(result.ukPercentage, test.expectedUK, 0.01, 
    `Nigeria CGPA ${test.cgpa} (5.0) → UK ${test.expectedUK}%`)
  assert(result.degreeClassification.sourceClassification === test.classification,
    `Nigeria CGPA ${test.cgpa} (5.0) classification`,
    test.classification,
    result.degreeClassification.sourceClassification)
})

console.log('\n' + '='.repeat(80))
console.log('TEST 4: Nigeria CGPA (4.0 Scale) Conversions')
console.log('='.repeat(80))

const nigeriaCGPA4Tests = [
  { cgpa: 4.0, expectedUSA: 4.0, expectedUK: 100, classification: 'First Class' },
  { cgpa: 3.5, expectedUSA: 3.5, expectedUK: 87.5, classification: 'First Class' },
  { cgpa: 3.0, expectedUSA: 3.0, expectedUK: 75, classification: 'Second Class Upper' },
  { cgpa: 2.5, expectedUSA: 2.5, expectedUK: 62.5, classification: 'Second Class Upper' },
  { cgpa: 2.0, expectedUSA: 2.0, expectedUK: 50, classification: 'Second Class Lower' }
]

nigeriaCGPA4Tests.forEach(test => {
  const result = convertGrade('nigeria_cgpa_4', test.cgpa)
  assertApprox(result.usaGpa, test.expectedUSA, 0.01, 
    `Nigeria CGPA ${test.cgpa} (4.0) → USA GPA ${test.expectedUSA}`)
  assertApprox(result.ukPercentage, test.expectedUK, 0.01, 
    `Nigeria CGPA ${test.cgpa} (4.0) → UK ${test.expectedUK}%`)
  assert(result.degreeClassification.sourceClassification === test.classification,
    `Nigeria CGPA ${test.cgpa} (4.0) classification`,
    test.classification,
    result.degreeClassification.sourceClassification)
})

console.log('\n' + '='.repeat(80))
console.log('TEST 5: Weighted Average Calculation')
console.log('='.repeat(80))

const courseTests = [
  {
    name: 'Simple 3 courses',
    courses: [
      { name: 'Math', score: '85', creditHours: '3' },
      { name: 'Physics', score: '90', creditHours: '4' },
      { name: 'Chemistry', score: '78', creditHours: '3' }
    ],
    expected: 84.9
  },
  {
    name: 'Equal credits',
    courses: [
      { name: 'Course 1', score: '80', creditHours: '3' },
      { name: 'Course 2', score: '90', creditHours: '3' },
      { name: 'Course 3', score: '70', creditHours: '3' }
    ],
    expected: 80
  },
  {
    name: 'Varying credits',
    courses: [
      { name: 'Major', score: '95', creditHours: '6' },
      { name: 'Minor', score: '70', creditHours: '2' }
    ],
    expected: 88.75
  }
]

courseTests.forEach(test => {
  const result = calculateWeightedAverage(test.courses)
  assertApprox(result, test.expected, 0.01, 
    `Weighted average: ${test.name}`)
})

console.log('\n' + '='.repeat(80))
console.log('TEST 6: Real-World Scenario - Ghana Student')
console.log('='.repeat(80))

const ghanaStudentCourses = [
  { name: 'Mathematics', score: '85', creditHours: '4' },
  { name: 'Physics', score: '78', creditHours: '3' },
  { name: 'Chemistry', score: '82', creditHours: '3' },
  { name: 'English', score: '88', creditHours: '3' },
  { name: 'Computer Science', score: '92', creditHours: '4' }
]

const ghanaWeighted = calculateWeightedAverage(ghanaStudentCourses)
console.log(`Ghana Student CWA: ${ghanaWeighted}%`)

const ghanaConversion = convertGrade('ghana_cwa', ghanaWeighted)
console.log(`USA GPA: ${ghanaConversion.usaGpa}`)
console.log(`UK Percentage: ${ghanaConversion.ukPercentage}%`)
console.log(`Classification: ${ghanaConversion.degreeClassification.sourceClassification}`)
console.log(`USA Equivalent: ${ghanaConversion.degreeClassification.usaEquivalent}`)
console.log(`UK Equivalent: ${ghanaConversion.degreeClassification.ukEquivalent}`)

assertApprox(ghanaWeighted, 85.12, 0.1, 'Ghana student weighted CWA')
assertApprox(ghanaConversion.usaGpa, 3.40, 0.05, 'Ghana student USA GPA')

console.log('\n' + '='.repeat(80))
console.log('TEST 7: Real-World Scenario - Nigeria Student')
console.log('='.repeat(80))

const nigeriaStudentCourses = [
  { name: 'Engineering Math', score: '4.5', creditHours: '4' },
  { name: 'Physics', score: '4.0', creditHours: '3' },
  { name: 'Chemistry', score: '4.2', creditHours: '3' },
  { name: 'Technical Writing', score: '4.8', creditHours: '2' },
  { name: 'Programming', score: '4.6', creditHours: '4' }
]

const nigeriaWeighted = calculateWeightedAverage(nigeriaStudentCourses)
console.log(`Nigeria Student CGPA: ${nigeriaWeighted} (5.0 scale)`)

const nigeriaConversion = convertGrade('nigeria_cgpa_5', nigeriaWeighted)
console.log(`USA GPA: ${nigeriaConversion.usaGpa}`)
console.log(`UK Percentage: ${nigeriaConversion.ukPercentage}%`)
console.log(`Classification: ${nigeriaConversion.degreeClassification.sourceClassification}`)
console.log(`USA Equivalent: ${nigeriaConversion.degreeClassification.usaEquivalent}`)
console.log(`UK Equivalent: ${nigeriaConversion.degreeClassification.ukEquivalent}`)

assertApprox(nigeriaWeighted, 4.44, 0.1, 'Nigeria student weighted CGPA')
assertApprox(nigeriaConversion.usaGpa, 3.55, 0.05, 'Nigeria student USA GPA')

console.log('\n' + '='.repeat(80))
console.log('TEST 8: Edge Cases and Validation')
console.log('='.repeat(80))

try {
  convertGrade('invalid_system', 85)
  console.log('✗ FAIL: Should throw error for invalid system')
  failedTests++
} catch (error) {
  console.log('✓ PASS: Correctly rejects invalid grading system')
  passedTests++
}

try {
  convertGrade('ghana_cwa', 150)
  console.log('✗ FAIL: Should throw error for out-of-range score')
  failedTests++
} catch (error) {
  console.log('✓ PASS: Correctly rejects out-of-range score')
  passedTests++
}

try {
  calculateWeightedAverage([])
  console.log('✗ FAIL: Should throw error for empty courses')
  failedTests++
} catch (error) {
  console.log('✓ PASS: Correctly rejects empty courses array')
  passedTests++
}

try {
  calculateWeightedAverage([
    { name: 'Test', score: 'invalid', creditHours: '3' }
  ])
  console.log('✗ FAIL: Should throw error for invalid score')
  failedTests++
} catch (error) {
  console.log('✓ PASS: Correctly rejects invalid score')
  passedTests++
}

console.log('\n' + '='.repeat(80))
console.log('TEST SUMMARY')
console.log('='.repeat(80))
console.log(`Total Tests: ${passedTests + failedTests}`)
console.log(`Passed: ${passedTests}`)
console.log(`Failed: ${failedTests}`)
console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(2)}%`)
console.log('='.repeat(80))

if (failedTests === 0) {
  console.log('✓ ALL TESTS PASSED - SYSTEM IS RELIABLE')
  process.exit(0)
} else {
  console.log('✗ SOME TESTS FAILED - REVIEW REQUIRED')
  process.exit(1)
}
