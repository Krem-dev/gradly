const express = require('express')
const ScraperController = require('../controllers/scraperController')

const router = express.Router()

router.post('/run', ScraperController.runScraper)
router.post('/run-all', ScraperController.runAllScrapers)
router.get('/logs', ScraperController.getScraperLogs)
router.get('/issues', ScraperController.getDataQualityIssues)
router.get('/programs', ScraperController.getUniversityPrograms)

module.exports = router
