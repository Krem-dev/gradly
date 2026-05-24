const express = require('express')
const router = express.Router()
const paystack = require('../services/paystack.service')

/**
 * Public pricing — frontend pulls this to render the buy modal.
 */
router.get('/pricing', (_req, res) => {
  try {
    res.json({ success: true, data: paystack.getPricing() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * Initialize a Paystack transaction. Body: { userId, email, callbackUrl }.
 */
router.post('/init', async (req, res) => {
  try {
    const { userId, email, callbackUrl } = req.body
    if (!userId || !email) {
      return res.status(400).json({ success: false, error: 'userId and email are required' })
    }
    const cb =
      callbackUrl ||
      `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment/success`
    const result = await paystack.initializePurchase({ userId, email, callbackUrl: cb })
    res.json({ success: true, data: result })
  } catch (err) {
    console.error('[payments/init]', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * Verify a transaction (frontend calls this from the callback page).
 */
router.get('/verify/:reference', async (req, res) => {
  try {
    const result = await paystack.verifyPurchase(req.params.reference)
    res.json({ success: result.success, data: result })
  } catch (err) {
    console.error('[payments/verify]', err.message)
    res.status(400).json({ success: false, error: err.message })
  }
})

/**
 * Webhook — Paystack posts here on every event. Must be exposed publicly
 * (use ngrok in dev). Body parsing uses raw to preserve HMAC.
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const sig = req.headers['x-paystack-signature']
      const result = await paystack.handleWebhook(req.body, sig)
      res.status(200).json(result)
    } catch (err) {
      console.error('[payments/webhook]', err.message)
      res.status(err.statusCode || 500).json({ ok: false, error: err.message })
    }
  }
)

module.exports = router
