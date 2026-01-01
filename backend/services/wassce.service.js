const GRADE_POINTS = {
  'A1': 1, 'B2': 2, 'B3': 3, 'C4': 4,
  'C5': 5, 'C6': 6, 'D7': 7, 'E8': 8, 'F9': 9
}

function calculateWASSCEAggregate(grades) {
  if (!Array.isArray(grades) || grades.length < 6) {
    throw new Error('Must have at least 6 subjects')
  }

  const points = grades.map(grade => {
    if (!GRADE_POINTS[grade]) {
      throw new Error(`Invalid grade: ${grade}`)
    }
    return GRADE_POINTS[grade]
  })

  points.sort((a, b) => a - b)
  const best6 = points.slice(0, 6)
  const aggregate = best6.reduce((sum, point) => sum + point, 0)

  return {
    aggregate,
    best6Grades: best6,
    totalSubjects: grades.length
  }
}

function gradeToPoints(grade) {
  if (!GRADE_POINTS[grade]) {
    throw new Error(`Invalid grade: ${grade}`)
  }
  return GRADE_POINTS[grade]
}

module.exports = {
  calculateWASSCEAggregate,
  gradeToPoints,
  GRADE_POINTS
}
