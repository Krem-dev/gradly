const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const BCRYPT_ROUNDS = 10
const JWT_EXPIRES_IN = '30d'

function getJwtSecret() {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 32) {
    throw new Error('JWT_SECRET must be set in .env and at least 32 characters')
  }
  return s
}

async function hashPassword(plain) {
  if (!plain || typeof plain !== 'string') {
    throw new Error('Password must be a non-empty string')
  }
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

async function verifyPassword(plain, hashed) {
  if (!plain || !hashed) return false
  // Detect legacy plaintext passwords (anything without a bcrypt prefix). We refuse to
  // verify them — forcing the user to reset via OTP, which is safer than silently
  // succeeding on a known-leaked plaintext.
  if (!/^\$2[aby]\$/.test(hashed)) return false
  return bcrypt.compare(plain, hashed)
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret())
  } catch {
    return null
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  BCRYPT_ROUNDS,
  JWT_EXPIRES_IN,
}
