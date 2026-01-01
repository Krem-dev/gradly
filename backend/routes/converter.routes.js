const express = require('express')
const router = express.Router()
const ConverterController = require('../controllers/converterController')

router.post('/convert-cwa-to-cgpa', ConverterController.convertCWAToCGPA)
router.post('/save-conversion', ConverterController.saveConversion)

module.exports = router
