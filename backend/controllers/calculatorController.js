const { calculateWASSCEAggregate } = require('../services/wassce.service')
const { findEligiblePrograms } = require('../services/program.service')
const Conversion = require('../models/Conversion')

class CalculatorController {
  static async calculateAggregate(req, res) {
    try {
      const { grades } = req.body

      if (!grades || !Array.isArray(grades)) {
        return res.status(400).json({
          success: false,
          error: 'Grades must be an array'
        })
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
  }

  static async getRecommendations(req, res) {
    try {
      const { grades, subjects, userPlan = 'free', filters = {} } = req.body

      if (!grades || !Array.isArray(grades)) {
        return res.status(400).json({
          success: false,
          error: 'Grades must be an array'
        })
      }

      if (!subjects || !Array.isArray(subjects)) {
        return res.status(400).json({
          success: false,
          error: 'Subjects must be an array'
        })
      }

      const aggregateResult = calculateWASSCEAggregate(grades)
      const eligiblePrograms = await findEligiblePrograms(
        aggregateResult.aggregate,
        subjects,
        filters
      )

      let recommendations = eligiblePrograms
      if (userPlan === 'free') {
        recommendations = eligiblePrograms.slice(0, 2)
      }

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
  }

  static async saveConversion(req, res) {
    try {
      const { userId, grades, subjects, result } = req.body

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        })
      }

      const conversionId = await Conversion.create({
        userId,
        type: 'shs_calculator',
        inputData: { grades, subjects },
        result
      })

      res.status(201).json({
        success: true,
        message: 'Conversion saved successfully',
        data: { id: conversionId }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

module.exports = CalculatorController
