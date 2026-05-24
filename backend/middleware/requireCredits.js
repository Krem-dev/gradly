const credits = require('../services/credits.service')

/**
 * Express middleware that atomically consumes ONE credit from the requesting user
 * before the route handler runs. If the user has 0 credits, returns HTTP 402.
 *
 * Resolves the user id from (in order): req.userId (from JWT auth middleware) →
 * req.body.userId → x-user-id header. The first source that yields a positive
 * integer wins.
 *
 * On success, sets req.creditBalanceAfter and adds the response header
 * `x-credits-remaining` so the frontend can refresh its widget without an extra
 * round trip.
 *
 * `context` is a free-form tag (e.g. 'use_university_convert', 'use_transcript_parse')
 * stored in the metadata JSON column for audit trail. The `reason` column itself stays
 * the canonical ENUM value 'use'.
 */
function requireCredits(context = 'use', extractReference = null) {
  return async function (req, res, next) {
    try {
      const userId =
        toPositiveInt(req.userId) ??
        toPositiveInt(req.body && req.body.userId) ??
        toPositiveInt(req.headers['x-user-id'])

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Sign in to use this feature.',
        })
      }

      const reference = typeof extractReference === 'function'
        ? extractReference(req)
        : null

      // 'use' is the canonical ENUM value in credit_transactions.reason.
      // The middleware-supplied `context` (e.g. 'use_university_convert') lives in
      // the metadata column so the audit log still tells us WHICH feature spent it.
      const result = await credits.useCredit(userId, 'use', reference, { context })

      if (!result.ok) {
        return res.status(402).json({
          success: false,
          error: 'Out of credits. Buy a Convert Pack to keep going.',
          code: 'OUT_OF_CREDITS',
          balance: 0,
        })
      }

      req.creditBalanceAfter = result.balanceAfter
      req.creditUserId = userId
      res.setHeader('x-credits-remaining', String(result.balanceAfter))
      next()
    } catch (err) {
      console.error('[requireCredits]', err)
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

function toPositiveInt(v) {
  if (v === undefined || v === null) return null
  const n = parseInt(v, 10)
  return Number.isInteger(n) && n > 0 ? n : null
}

module.exports = requireCredits
