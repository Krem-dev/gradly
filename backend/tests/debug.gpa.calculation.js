const {
  calculateScholaroGPA,
  ghanaPercentageToUSGrade,
  usGradeToPoints
} = require('../services/university.converter.service')

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

console.log('='.repeat(80))
console.log('DETAILED GPA CALCULATION DEBUG')
console.log('='.repeat(80))

let totalPoints = 0
let totalCredits = 0
let gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 }

console.log('\nCOURSE-BY-COURSE BREAKDOWN:\n')
console.log('Score | Grade | GPA | Credits | Points | Course Name')
console.log('-'.repeat(80))

allCourses.forEach((course, index) => {
  const score = parseFloat(course.score)
  const credits = parseFloat(course.creditHours)
  const grade = ghanaPercentageToUSGrade(score)
  const gpaPoints = usGradeToPoints(grade)
  const coursePoints = gpaPoints * credits
  
  totalPoints += coursePoints
  totalCredits += credits
  gradeDistribution[grade]++
  
  console.log(`${score.toString().padStart(5)} | ${grade.padEnd(5)} | ${gpaPoints.toFixed(1)} | ${credits.toString().padStart(7)} | ${coursePoints.toFixed(1).padStart(6)} | ${course.name}`)
})

console.log('-'.repeat(80))
console.log(`TOTALS: ${totalCredits} credits, ${totalPoints.toFixed(1)} total points`)

const calculatedGPA = totalPoints / totalCredits

console.log('\n' + '='.repeat(80))
console.log('GRADE DISTRIBUTION')
console.log('='.repeat(80))
console.log(`A grades (70-100%): ${gradeDistribution.A} courses`)
console.log(`B grades (60-69%):  ${gradeDistribution.B} courses`)
console.log(`C grades (50-59%):  ${gradeDistribution.C} courses`)
console.log(`D grades (40-49%):  ${gradeDistribution.D} courses`)
console.log(`F grades (<40%):    ${gradeDistribution.F} courses`)

console.log('\n' + '='.repeat(80))
console.log('FINAL CALCULATION')
console.log('='.repeat(80))
console.log(`Total GPA Points: ${totalPoints.toFixed(2)}`)
console.log(`Total Credits: ${totalCredits}`)
console.log(`Calculated GPA: ${totalPoints} ÷ ${totalCredits} = ${calculatedGPA.toFixed(4)}`)
console.log(`Rounded GPA: ${Math.round(calculatedGPA * 100) / 100}`)

console.log('\n' + '='.repeat(80))
console.log('COMPARISON')
console.log('='.repeat(80))
console.log(`Our System: ${calculateScholaroGPA(allCourses, 'ghana_cwa')}`)
console.log(`Manual Calculation: ${Math.round(calculatedGPA * 100) / 100}`)
console.log(`ChatGPT Calculation: 3.64`)
console.log(`Expected (Scholaro): 3.51`)

console.log('\n' + '='.repeat(80))
console.log('ANALYSIS')
console.log('='.repeat(80))

if (Math.abs(calculatedGPA - 3.64) < 0.01) {
  console.log('✓ Our calculation matches ChatGPT (3.64)')
  console.log('⚠ But this differs from previous Scholaro test (3.51)')
  console.log('Need to investigate why Scholaro comparison showed 3.51')
} else if (Math.abs(calculatedGPA - 3.51) < 0.01) {
  console.log('✓ Our calculation matches Scholaro (3.51)')
  console.log('⚠ ChatGPT may have different course data or rounding')
} else {
  console.log(`⚠ Our calculation (${calculatedGPA.toFixed(2)}) differs from both`)
}

console.log('\n' + '='.repeat(80))
