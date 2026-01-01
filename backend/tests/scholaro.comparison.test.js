const {
  calculateWeightedAverage
} = require('../services/university.converter.service')

console.log('='.repeat(80))
console.log('SCHOLARO ALGORITHM vs OUR ALGORITHM COMPARISON')
console.log('Testing with Isaac Yaw Amponsah\'s KNUST Transcript')
console.log('='.repeat(80))

const allCourses = [
  { name: 'CE 155 ENVIRONMENTAL STUDIES', score: '66', creditHours: '2' },
  { name: 'COE 153 ENGINEERING TECHNOLOGY', score: '65', creditHours: '2' },
  { name: 'COE 181 APPLIED ELECTRICITY', score: '60', creditHours: '3' },
  { name: 'ENGL 157 COMMUNICATION SKILLS I', score: '78', creditHours: '2' },
  { name: 'MATH 151 ALGEBRA', score: '75', creditHours: '4' },
  { name: 'ME 159 TECHNICAL DRAWING', score: '63', creditHours: '2' },
  { name: 'ME 161 BASIC MECHANICS', score: '76', creditHours: '3' },
  { name: 'COE 152 BASIC ELECTRONICS', score: '85', creditHours: '3' },
  { name: 'COE 162 PROGRAMMING AND PROBLEM SOLVING', score: '75', creditHours: '2' },
  { name: 'COE 164 INTRODUCTION TO MATLAB AND LABVIEW', score: '85', creditHours: '2' },
  { name: 'EE 156 ELECTRICAL ENG. DRAWING', score: '89', creditHours: '2' },
  { name: 'EE 172 ELECTRICAL MACHINES', score: '83', creditHours: '3' },
  { name: 'ENGL 158 COMMUNICATION SKILLS II', score: '66', creditHours: '2' },
  { name: 'MATH 152 CALCULUS WITH ANALYSIS', score: '65', creditHours: '4' },
  { name: 'ME 166 APPLIED THERMODYNAMICS', score: '77', creditHours: '2' },
  { name: 'COE 273 COMPUTER ORGANIZATION', score: '74', creditHours: '2' },
  { name: 'CENG 291 ENGINEERING IN SOCIETY', score: '81', creditHours: '2' },
  { name: 'COE 241 COMMUNICATION SYSTEMS', score: '78', creditHours: '2' },
  { name: 'COE 251 DISCRETE STRUCTURES', score: '75', creditHours: '3' },
  { name: 'COE 271 SEMICONDUCTOR DEVICES', score: '54', creditHours: '2' },
  { name: 'COE 287 CIRCUIT THEORY', score: '84', creditHours: '2' },
  { name: 'COE 291 COMPUTER ENGINEERING LAB. I', score: '76', creditHours: '2' },
  { name: 'FC 181 FRENCH FOR COMMUNICATION PURPOSES I', score: '88', creditHours: '2' },
  { name: 'MATH 251 DIFFERENTIAL EQUATIONS', score: '70', creditHours: '4' },
  { name: 'COE 252 DATA STRUCTURES AND ALGORITHMS', score: '65', creditHours: '3' },
  { name: 'COE 272 DIGITAL SYSTEMS DESIGN I', score: '53', creditHours: '3' },
  { name: 'COE 288 ELECTRICAL MEASUREMENTS AND INSTRUMENTATION', score: '92', creditHours: '3' },
  { name: 'COE 292 COMPUTER ENGINEERING LAB II', score: '79', creditHours: '2' },
  { name: 'FC 182 FRENCH FOR COMMUNICATION', score: '79', creditHours: '2' },
  { name: 'MATH 252 CALCULUS WITH SEVERAL VARIABLES', score: '57', creditHours: '4' },
  { name: 'TE 262 ELECTROMAGNETIC FIELDS', score: '75', creditHours: '2' },
  { name: 'COE 353 INFORMATION THEORY', score: '74', creditHours: '2' },
  { name: 'MATH 351 NUMERICAL ANALYSIS', score: '59', creditHours: '2' },
  { name: 'COE 371 LINEAR ELECTRONIC CIRCUITS', score: '56', creditHours: '3' },
  { name: 'STAT 253 PROBABILITY AND STATISTICS', score: '48', creditHours: '2' },
  { name: 'COE 387 CLASSICAL CONTROL SYSTEMS', score: '72', creditHours: '3' },
  { name: 'COE 381 MICROPROCESSORS', score: '81', creditHours: '3' },
  { name: 'COE 351 OBJECT ORIENTED PROGRAMMING', score: '91', creditHours: '4' },
  { name: 'COE 368 DATABASE AND INFORMATION RETRIEVAL', score: '71', creditHours: '3' },
  { name: 'COE 356 INTRODUCTION TO SOFTWARE ENG.', score: '79', creditHours: '3' },
  { name: 'COE 354 OPERATING SYSTEMS', score: '75', creditHours: '4' },
  { name: 'COE 392 AUTOTRONIC LAB.', score: '91', creditHours: '2' },
  { name: 'COE 358 EMBEDDED SYSTEMS', score: '60', creditHours: '3' },
  { name: 'COE 372 DIGITAL SYSTEMS DESIGN II', score: '64', creditHours: '3' },
  { name: 'COE 453 DISTRIBUTED COMPUTING', score: '94', creditHours: '3' },
  { name: 'COE 475 COMPUTER NETWORKING', score: '68', creditHours: '4' },
  { name: 'COE 485 COMPUTER ARCHITECTURE', score: '57', creditHours: '3' },
  { name: 'COE 497 PROJECT 1', score: '83', creditHours: '3' },
  { name: 'COE 499 VACATION TRAINING', score: '70', creditHours: '2' },
  { name: 'ME 491 ENGINEERING ECONOMICS AND MANAGEMENT', score: '79', creditHours: '2' },
  { name: 'COE 454 SOFTWARE ENGINEERING', score: '88', creditHours: '3' },
  { name: 'COE 456 SECURE NETWORK SYSTEMS', score: '81', creditHours: '3' },
  { name: 'COE 472 DIGITAL SIGNAL PROCESSING', score: '76', creditHours: '3' },
  { name: 'COE 498 PROJECT II', score: '81', creditHours: '5' },
  { name: 'ME 492 MANAGEMENT AND ENTREPRENEURSHIP DEVELOPMENT', score: '58', creditHours: '2' }
]

function ghanaPercentageToUSGrade(percentage) {
  if (percentage >= 70) return 'A'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C'
  if (percentage >= 40) return 'D'
  return 'F'
}

function usGradeToPoints(grade) {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'AB': 3.5,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'BC': 2.5,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'CD': 1.5,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  }
  return gradePoints[grade] || 0.0
}

function calculateScholaroGPA(courses) {
  let totalPoints = 0
  let totalCredits = 0
  
  courses.forEach(course => {
    const percentage = parseFloat(course.score)
    const credits = parseFloat(course.creditHours)
    
    const usGrade = ghanaPercentageToUSGrade(percentage)
    const gradePoints = usGradeToPoints(usGrade)
    
    totalPoints += gradePoints * credits
    totalCredits += credits
  })
  
  return totalPoints / totalCredits
}

function calculateOurAlgorithmGPA(courses) {
  const cwa = calculateWeightedAverage(courses)
  const usaGpa = (cwa / 100) * 4.0
  return { cwa, usaGpa }
}

console.log('\n' + '='.repeat(80))
console.log('SCHOLARO ALGORITHM (Step-by-Step)')
console.log('='.repeat(80))
console.log('Step 1: Convert Ghana percentage to U.S. letter grade')
console.log('  70-100% → A (4.0 points)')
console.log('  60-69%  → B (3.0 points)')
console.log('  50-59%  → C (2.0 points)')
console.log('  40-49%  → D (1.0 points)')
console.log('  0-39%   → F (0.0 points)')
console.log('\nStep 2: Multiply grade points by credits for each course')
console.log('Step 3: Sum all points and divide by total credits')

const scholaroGPA = calculateScholaroGPA(allCourses)

console.log('\n' + '-'.repeat(80))
console.log('SCHOLARO RESULT:')
console.log(`USA GPA: ${scholaroGPA.toFixed(2)}`)

console.log('\n' + '='.repeat(80))
console.log('OUR ALGORITHM (Linear Conversion)')
console.log('='.repeat(80))
console.log('Step 1: Calculate weighted average (CWA) from all courses')
console.log('Step 2: Apply formula: USA GPA = (CWA / 100) × 4.0')

const ourResult = calculateOurAlgorithmGPA(allCourses)

console.log('\n' + '-'.repeat(80))
console.log('OUR ALGORITHM RESULT:')
console.log(`Weighted Average (CWA): ${ourResult.cwa.toFixed(2)}%`)
console.log(`USA GPA: ${ourResult.usaGpa.toFixed(2)}`)

console.log('\n' + '='.repeat(80))
console.log('COMPARISON')
console.log('='.repeat(80))
console.log(`Scholaro Algorithm:  ${scholaroGPA.toFixed(2)} GPA`)
console.log(`Our Algorithm:       ${ourResult.usaGpa.toFixed(2)} GPA`)
console.log(`Difference:          ${Math.abs(scholaroGPA - ourResult.usaGpa).toFixed(2)} GPA`)
console.log(`Percentage Diff:     ${(Math.abs(scholaroGPA - ourResult.usaGpa) / scholaroGPA * 100).toFixed(2)}%`)

console.log('\n' + '='.repeat(80))
console.log('ANALYSIS')
console.log('='.repeat(80))

if (Math.abs(scholaroGPA - ourResult.usaGpa) < 0.1) {
  console.log('✓ VERY CLOSE - Algorithms produce similar results')
} else if (Math.abs(scholaroGPA - ourResult.usaGpa) < 0.3) {
  console.log('✓ ACCEPTABLE - Results are within reasonable range')
} else {
  console.log('⚠ SIGNIFICANT DIFFERENCE - Need to review approach')
}

console.log('\nScholaro Approach:')
console.log('  - Converts each grade to letter grade first (loses precision)')
console.log('  - Uses fixed grade points (A=4.0, B=3.0, C=2.0, D=1.0)')
console.log('  - More conservative (70% = A = 4.0, but 69% = B = 3.0)')

console.log('\nOur Approach:')
console.log('  - Uses exact percentage values (preserves precision)')
console.log('  - Linear scaling maintains proportional relationships')
console.log('  - More granular (73.54% = 2.94, not rounded to letter grade)')

console.log('\n' + '='.repeat(80))
console.log('TRANSCRIPT VERIFICATION')
console.log('='.repeat(80))
console.log(`Transcript CWA: 73.54%`)
console.log(`Transcript Class: First Class (70-100%)`)
console.log(`\nScholaro would classify 73.54% as: A (4.0 GPA)`)
console.log(`Our algorithm calculates: ${ourResult.usaGpa.toFixed(2)} GPA`)

console.log('\n' + '='.repeat(80))
console.log('RECOMMENDATION')
console.log('='.repeat(80))
console.log('Both algorithms are valid but serve different purposes:')
console.log('')
console.log('Scholaro (Letter Grade Method):')
console.log('  ✓ Simpler, matches traditional transcript formats')
console.log('  ✓ Aligns with how universities read transcripts')
console.log('  ✗ Loses precision (69% and 60% both = B = 3.0)')
console.log('')
console.log('Our Algorithm (Linear Method):')
console.log('  ✓ Maintains precision and proportional relationships')
console.log('  ✓ Better for comparing students within same system')
console.log('  ✗ May not match how admissions officers interpret grades')
console.log('')
console.log('For subscription service credibility, Scholaro method may be')
console.log('more trusted as it matches official credential evaluators.')

console.log('\n' + '='.repeat(80))
