const express = require('express')
const router = express.Router()
const CalculatorController = require('../controllers/calculatorController')

router.post('/calculate-aggregate', CalculatorController.calculateAggregate)
router.post('/get-recommendations', CalculatorController.getRecommendations)
router.post('/save-conversion', CalculatorController.saveConversion)

module.exports = router
