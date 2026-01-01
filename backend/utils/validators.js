function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password && password.length >= 6
}

function validateGrades(grades) {
  const validGrades = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9']
  return Array.isArray(grades) && grades.every(g => validGrades.includes(g))
}

module.exports = {
  validateEmail,
  validatePassword,
  validateGrades
}
