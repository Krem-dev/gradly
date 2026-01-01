const {
  convertGrade,
  calculateWeightedAverage,
  convertUniversityGrades
} = require('../services/university.converter.service')

console.log('='.repeat(80))
console.log('REAL TRANSCRIPT TEST - Isaac Yaw Amponsah')
console.log('KNUST - BSc Computer Engineering')
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

console.log('\nTotal Courses: ' + allCourses.length)
console.log('Total Credits: ' + allCourses.reduce((sum, c) => sum + parseInt(c.creditHours), 0))

const weightedAverage = calculateWeightedAverage(allCourses)
console.log('\nCalculated Weighted Average (CWA): ' + weightedAverage + '%')
console.log('Transcript Shows: 73.54%')
console.log('Difference: ' + Math.abs(weightedAverage - 73.54).toFixed(2) + '%')

if (Math.abs(weightedAverage - 73.54) < 0.5) {
  console.log('✓ MATCH - Our calculation is accurate!')
} else {
  console.log('✗ MISMATCH - Need to investigate')
}

console.log('\n' + '='.repeat(80))
console.log('CONVERSION TO USA GPA AND UK PERCENTAGE')
console.log('='.repeat(80))

const conversion = convertGrade('ghana_cwa', weightedAverage)

console.log('\nSource System: Ghana CWA (Percentage)')
console.log('Source Score: ' + conversion.sourceScore + '%')
console.log('\nCONVERSION RESULTS:')
console.log('-'.repeat(80))
console.log('USA GPA (4.0 scale): ' + conversion.usaGpa)
console.log('UK Percentage: ' + conversion.ukPercentage + '%')

console.log('\nDEGREE CLASSIFICATION:')
console.log('-'.repeat(80))
console.log('Ghana Classification: ' + conversion.degreeClassification.sourceClassification)
console.log('USA Equivalent: ' + conversion.degreeClassification.usaEquivalent)
console.log('UK Equivalent: ' + conversion.degreeClassification.ukEquivalent)

console.log('\n' + '='.repeat(80))
console.log('VERIFICATION AGAINST TRANSCRIPT')
console.log('='.repeat(80))
console.log('Transcript Shows: FIRST CLASS (70-100%)')
console.log('Our System Calculated: ' + conversion.degreeClassification.sourceClassification)

if (conversion.degreeClassification.sourceClassification === 'First Class') {
  console.log('✓ CLASSIFICATION MATCH - System is accurate!')
} else {
  console.log('✗ CLASSIFICATION MISMATCH')
}

console.log('\n' + '='.repeat(80))
console.log('FORMULA USED')
console.log('='.repeat(80))
console.log('USA GPA = (CWA / 100) × 4.0')
console.log('USA GPA = (' + weightedAverage + ' / 100) × 4.0')
console.log('USA GPA = ' + conversion.usaGpa)
console.log('\nUK Percentage = CWA (direct mapping)')
console.log('UK Percentage = ' + conversion.ukPercentage + '%')

console.log('\n' + '='.repeat(80))
console.log('COMPETITIVE ANALYSIS')
console.log('='.repeat(80))
console.log('With USA GPA of ' + conversion.usaGpa + ':')
if (conversion.usaGpa >= 3.7) {
  console.log('✓ Highly competitive for top US graduate programs')
} else if (conversion.usaGpa >= 3.5) {
  console.log('✓ Competitive for most US graduate programs')
} else if (conversion.usaGpa >= 3.0) {
  console.log('✓ Meets minimum requirements for most US graduate programs')
} else {
  console.log('• May need additional qualifications for competitive programs')
}

console.log('\n' + '='.repeat(80))
