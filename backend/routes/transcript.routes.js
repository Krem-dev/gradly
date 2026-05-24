const express = require('express')
const multer = require('multer')
const extractor = require('../services/transcriptExtractor.service')
const requireCredits = require('../middleware/requireCredits')
const credits = require('../services/credits.service')

const router = express.Router()

// Accept PDFs + common phone-photo image formats. Claude vision handles all three.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)
    if (ok) cb(null, true)
    else cb(new Error('Only PDF, JPG, or PNG files are allowed'))
  },
})

/**
 * POST /api/transcript/parse — charges 1 credit per upload.
 *
 * Charging up-front (rather than at /convert) is a deliberate guardrail against
 * abuse: every parse calls Claude's API and costs us real money (~$0.01-0.05).
 * Without a gate, anonymous users could drain our Claude balance with no revenue.
 * The middleware enforces login + balance ≥ 1 before any extraction runs.
 *
 * If extraction itself fails (network error, bad file, etc.) the credit is
 * refunded so users never pay for genuine system failures.
 */
router.post(
  '/parse',
  upload.single('transcript'),
  requireCredits('use_transcript_parse'),
  async (req, res) => {
    try {
      if (!req.file) {
        // No file — refund the credit we just took.
        await safeRefund(req, 'no_file')
        return res.status(400).json({ success: false, error: 'No file uploaded' })
      }

      const result = await extractor.extractTranscript(req.file.buffer, req.file.mimetype)

      if (!result.success) {
        // Extraction itself failed (Claude down, encrypted PDF, bad mimetype).
        // Refund the credit — user shouldn't pay for our system's failure.
        await safeRefund(req, 'extraction_failed', result.error)
        return res.status(400).json(result)
      }

      // Surface the post-charge balance so the frontend can refresh its widget.
      return res.status(200).json({
        success: true,
        previewId: `prev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        courses: result.courses,
        sourceUniversity: result.sourceUniversity,
        gradingScheme: result.gradingScheme,
        extractionMethod: result.extractionMethod,
        warnings: result.warnings,
        creditsRemaining: req.creditBalanceAfter,
        message:
          result.courses.length === 0
            ? "We couldn't extract any courses. Add them manually below."
            : `Extracted ${result.courses.length} courses via ${result.extractionMethod}.`,
      })
    } catch (err) {
      console.error('[transcript /parse]', err)
      await safeRefund(req, 'parse_threw', err.message)
      return res.status(500).json({
        success: false,
        error: 'Extraction failed — your credit has been refunded. Please try again.',
      })
    }
  }
)

async function safeRefund(req, reason, error) {
  if (!req.creditUserId) return
  try {
    await credits.addCredits(req.creditUserId, 1, 'refund', null, {
      context: 'transcript_parse_failed',
      reason,
      error,
    })
  } catch (e) {
    console.error('[transcript refund]', e.message)
  }
}

// Note: there's no /commit endpoint. The credit is charged by
// /api/university-converter/convert when the user runs the actual conversion.
// /parse is free preview-only — users can upload as many transcripts as they like
// to test parsing; they only pay when they convert.

module.exports = router
