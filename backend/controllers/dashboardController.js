const Conversion = require('../models/Conversion')
const User = require('../models/User')
const universityConverterService = require('../services/university.converter.service')

class DashboardController {
  static async getStats(req, res) {
    try {
      const userId = req.params.userId

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      let totalConversions = 0
      try {
        totalConversions = await Conversion.countByUserId(userId)
      } catch (err) {
        totalConversions = 0
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            plan: user.plan,
            createdAt: user.createdAt
          },
          stats: {
            totalConversions
          }
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async getRecentConversions(req, res) {
    try {
      const userId = req.params.userId
      const limit = parseInt(req.query.limit) || 10
      const offset = parseInt(req.query.offset) || 0

      const result = await universityConverterService.getUserConversions(userId, limit, offset)

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        })
      }

      res.json({
        success: true,
        data: result.data || []
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  static async deleteConversion(req, res) {
    try {
      const { conversionId } = req.params

      const conversion = await Conversion.findById(conversionId)
      if (!conversion) {
        return res.status(404).json({
          success: false,
          error: 'Conversion not found'
        })
      }

      await Conversion.delete(conversionId)

      res.json({
        success: true,
        message: 'Conversion deleted successfully'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

module.exports = DashboardController
