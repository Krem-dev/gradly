const express = require('express')
const multer = require('multer')
const TranscriptController = require('../controllers/transcriptController')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

router.post('/parse', upload.single('transcript'), TranscriptController.parseTranscript)

module.exports = router
