function convertPercentageToCGPA(percentage) {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100')
  }

  const cgpa = (percentage / 100) * 4.0
  return Math.round(cgpa * 100) / 100
}

function convertCGPAToPercentage(cgpa) {
  if (cgpa < 0 || cgpa > 4.0) {
    throw new Error('CGPA must be between 0 and 4.0')
  }

  const percentage = (cgpa / 4.0) * 100
  return Math.round(percentage * 100) / 100
}

module.exports = {
  convertPercentageToCGPA,
  convertCGPAToPercentage
}
