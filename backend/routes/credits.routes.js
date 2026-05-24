const express = require('express')
const router = express.Router()
const credits = require('../services/credits.service')

/**
 * Credit balance + history.
 * Accepts userId as URL param. (Backend trusts the param — frontend MUST send a JWT
 * via Authorization header, validated upstream by middleware. For now we accept either.)
 */

router.get('/balance/:userId', async (req, res) => {
  try {
    const balance = await credits.getBalance(parseInt(req.params.userId, 10))
    res.json({ success: true, data: { balance } })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

router.get('/history/:userId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10)
    const txns = await credits.listTransactions(parseInt(req.params.userId, 10), limit)
    res.json({ success: true, data: txns })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

module.exports = router
