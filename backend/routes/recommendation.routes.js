const express = require('express')
const RecommendationController = require('../controllers/recommendationController')

const router = express.Router()

router.post('/universities', RecommendationController.getUniversityRecommendations)
router.get('/programs', RecommendationController.getProgramsByUniversity)
router.post('/eligible-universities', RecommendationController.getEligibleUniversities)

module.exports = router
