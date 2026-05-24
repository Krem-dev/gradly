const express = require('express')
const router = express.Router()
const universityConverterService = require('../services/university.converter.service')

// IMPORTANT: /convert is FREE. The 1-credit charge happens at /transcript/parse
// (which is where the actual Claude API cost lives). The conversion math here
// has no per-request cost, so charging again would be double-billing transcript
// users. Manual-typers get a free conversion — that's intentional: they did the
// work of typing every course in by hand.
router.post('/convert', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body'
      })
    }

    const { sourceSystem, courses } = req.body

    if (!sourceSystem || !courses) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sourceSystem and courses'
      })
    }

    const result = await universityConverterService.convertUniversityGrades(req.body)
    return res.status(result.success ? 200 : 400).json(result)
  } catch (error) {
    console.error('Error in /convert:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

router.post('/save', async (req, res) => {
  console.log(' [API] Save conversion request received:', {
    userId: req.body.userId,
    sourceSystem: req.body.conversionData?.sourceSystem,
    targetSystem: req.body.conversionData?.targetSystem
  })

  try {
    const { userId, conversionData } = req.body
    
    if (!userId || !conversionData) {
      console.log(' [API] Missing required fields')
      return res.status(400).json({
        success: false,
        error: 'User ID and conversion data are required'
      })
    }
    
    const result = await universityConverterService.saveConversion(userId, conversionData)
    
    console.log(' [API] Save conversion response:', {
      success: result.success,
      conversionId: result.data?.conversionId,
      error: result.error
    })
    
    if (result.success) {
      return res.status(201).json(result)
    }
    
    return res.status(400).json(result)
  } catch (error) {
    console.error('Error in /save:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required'
      })
    }
    
    const result = await universityConverterService.getUserConversions(userId)
    
    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error in /history:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

router.get('/grading-systems', (req, res) => {
  res.json({
    success: true,
    data: universityConverterService.GRADING_SYSTEMS
  })
})

module.exports = router
