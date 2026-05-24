const { verifyToken } = require('../utils/auth.utils')

/**
 * Auth middleware. Accepts either:
 *   - Authorization: Bearer <jwt>     (preferred)
 *   - x-user-id: <id>                 (legacy fallback, dev only)
 *
 * Sets req.userId on success, or 401s.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization']

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    const payload = verifyToken(token)
    if (!payload || !payload.sub) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' })
    }
    req.userId = payload.sub
    req.user = payload
    return next()
  }

  // Legacy fallback — log a warning so we can remove it later
  const legacyUserId = req.headers['x-user-id']
  if (legacyUserId && process.env.NODE_ENV !== 'production') {
    console.warn('[auth] Falling back to x-user-id header. Use Authorization: Bearer in production.')
    req.userId = legacyUserId
    return next()
  }

  return res.status(401).json({
    success: false,
    error: 'Authentication required. Send Authorization: Bearer <token>.',
  })
}

module.exports = authMiddleware
