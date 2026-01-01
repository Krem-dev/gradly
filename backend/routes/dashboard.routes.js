const express = require('express')
const router = express.Router()
const DashboardController = require('../controllers/dashboardController')

router.get('/stats/:userId', DashboardController.getStats)
router.get('/conversions/:userId', DashboardController.getRecentConversions)
router.delete('/conversion/:conversionId', DashboardController.deleteConversion)

module.exports = router
