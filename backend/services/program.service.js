const Program = require('../models/Program')

async function findEligiblePrograms(studentAggregate, studentSubjects, filters = {}) {
  try {
    const allPrograms = await Program.findEligible(studentAggregate)

    const eligiblePrograms = allPrograms.filter(program => {
      const required = program.requiredSubjects || []
      const hasRequired = required.length === 0 || required.every(req =>
        studentSubjects.some(subj =>
          subj.name.toLowerCase().includes(req.toLowerCase())
        )
      )
      return hasRequired
    }).filter(program => {
      if (filters.category && program.category !== filters.category) {
        return false
      }
      if (filters.region && program.region !== filters.region) {
        return false
      }
      return true
    }).map(program => ({
      id: program.id,
      university: program.universityName,
      universityId: program.universityId,
      program: program.name,
      category: program.category,
      location: program.location,
      region: program.region,
      cutoff: program.maxCutoff,
      studentScore: studentAggregate,
      margin: program.maxCutoff - studentAggregate,
      requiredSubjects: program.requiredSubjects,
      tuition: program.tuition,
      scholarshipAvailable: program.scholarshipAvailable
    }))

    return eligiblePrograms.sort((a, b) => a.margin - b.margin)
  } catch (error) {
    throw new Error(`Failed to find eligible programs: ${error.message}`)
  }
}

async function getRecommendedPrograms(eligiblePrograms, userPlan = 'free') {
  const sorted = eligiblePrograms.sort((a, b) => a.margin - b.margin)

  if (userPlan === 'premium') {
    return sorted
  }

  return sorted.slice(0, 2)
}

module.exports = {
  findEligiblePrograms,
  getRecommendedPrograms
}
