const { convertPercentageToCGPA } = require('../services/converter.service')
const Conversion = require('../models/Conversion')

class ConverterController {
  static async convertCWAToCGPA(req, res) {
    try {
      const { percentage } = req.body

      if (percentage === undefined || percentage === null) {
        return res.status(400).json({
          success: false,
          error: 'Percentage is required'
        })
      }

      const cgpa = convertPercentageToCGPA(percentage)

      res.json({
        success: true,
        data: {
          percentage,
          cgpa,
          gradeEquivalent: getGradeEquivalent(cgpa)
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
      const { userId, percentage, cgpa, courses } = req.body

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        })
      }

      const conversionId = await Conversion.create({
        userId,
        type: 'university_converter',
        inputData: { percentage, courses },
        result: { cgpa }
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

function getGradeEquivalent(cgpa) {
  if (cgpa >= 3.7) return 'A'
  if (cgpa >= 3.3) return 'B+'
  if (cgpa >= 3.0) return 'B'
  if (cgpa >= 2.7) return 'B-'
  if (cgpa >= 2.3) return 'C+'
  if (cgpa >= 2.0) return 'C'
  if (cgpa >= 1.7) return 'C-'
  if (cgpa >= 1.3) return 'D+'
  if (cgpa >= 1.0) return 'D'
  return 'F'
}

module.exports = ConverterController
