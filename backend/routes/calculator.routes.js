const express = require('express')
const router = express.Router()
const { calculateWASSCEAggregate } = require('../services/wassce.service')
const { findEligiblePrograms, getRecommendedPrograms } = require('../services/program.service')

router.post('/calculate-aggregate', (req, res) => {
  try {
    const { grades } = req.body

    if (!grades || !Array.isArray(grades)) {
      return res.status(400).json({ error: 'Grades must be an array' })
    }

    const result = calculateWASSCEAggregate(grades)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

router.post('/get-recommendations', async (req, res) => {
  try {
    const { grades, subjects, userPlan = 'free', filters = {} } = req.body

    if (!grades || !Array.isArray(grades)) {
      return res.status(400).json({ error: 'Grades must be an array' })
    }

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ error: 'Subjects must be an array' })
    }

    const aggregateResult = calculateWASSCEAggregate(grades)
    const eligiblePrograms = await findEligiblePrograms(
      aggregateResult.aggregate,
      subjects,
      filters
    )
    const recommendations = await getRecommendedPrograms(eligiblePrograms, userPlan)

    res.json({
      success: true,
      data: {
        aggregate: aggregateResult.aggregate,
        totalEligible: eligiblePrograms.length,
        recommendations: recommendations,
        showUpgradePrompt: userPlan === 'free' && eligiblePrograms.length > 2
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

module.exports = router
