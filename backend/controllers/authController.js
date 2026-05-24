const User = require('../models/User')
const { validateEmail, validatePassword } = require('../utils/validators')
const { verifyPassword, signToken } = require('../utils/auth.utils')
const otpService = require('../services/otp.service')

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, fullName } = req.body

      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, and full name are required',
        })
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' })
      }
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters',
        })
      }
      if (await User.exists(email)) {
        return res.status(400).json({ success: false, error: 'Email already registered' })
      }

      const userId = await User.create({ email, password, fullName })
      const user = await User.findById(userId)
      const token = signToken({ sub: String(user.id), email: user.email, plan: user.plan })

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          plan: user.plan,
          credits: user.credits ?? 0,
          token,
        },
      })
    } catch (error) {
      console.error('[register]', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required',
        })
      }

      const user = await User.findByEmailForAuth(email)
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' })
      }

      const ok = await verifyPassword(password, user.password)
      if (!ok) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' })
      }

      const token = signToken({ sub: String(user.id), email: user.email, plan: user.plan })

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          plan: user.plan,
          credits: user.credits ?? 0,
          token,
        },
      })
    } catch (error) {
      console.error('[login]', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.params.id
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async changePassword(req, res) {
    try {
      const { userId, currentPassword, newPassword, confirmPassword } = req.body

      if (!userId || !currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'All fields are required' })
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'New passwords do not match' })
      }
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters',
        })
      }

      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })

      const userWithPassword = await User.findByEmailForAuth(user.email)
      const ok = await verifyPassword(currentPassword, userWithPassword.password)
      if (!ok) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect' })
      }

      await User.updatePassword(userId, newPassword)
      res.json({ success: true, message: 'Password changed successfully' })
    } catch (error) {
      console.error('[changePassword]', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { userId, password } = req.body
      if (!userId || !password) {
        return res.status(400).json({
          success: false,
          error: 'User ID and password are required',
        })
      }

      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })

      const userWithPassword = await User.findByEmailForAuth(user.email)
      const ok = await verifyPassword(password, userWithPassword.password)
      if (!ok) {
        return res.status(401).json({ success: false, error: 'Password is incorrect' })
      }

      await User.delete(userId)
      res.json({ success: true, message: 'Account deleted successfully' })
    } catch (error) {
      console.error('[deleteAccount]', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ success: false, error: 'Email is required' })
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' })
      }
      // Don't leak account existence — always return generic success
      const user = await User.findByEmail(email)
      if (user) {
        await otpService.sendOTP(email)
      }
      res.json({
        success: true,
        message: 'If an account exists for that email, an OTP has been sent.',
      })
    } catch (error) {
      console.error('[forgotPassword]', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email, newPassword, confirmPassword } = req.body
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, error: 'All fields are required' })
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match' })
      }
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters',
        })
      }
      const user = await User.findByEmail(email)
      if (!user) return res.status(404).json({ success: false, error: 'User not found' })

      await User.updatePassword(user.id, newPassword)
      res.json({ success: true, message: 'Password reset successfully' })
    } catch (error) {
      console.error('[resetPassword]', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async sendOTP(req, res) {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ success: false, error: 'Email is required' })
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' })
      }
      const result = await otpService.sendOTP(email)
      return res.status(result.success ? 200 : 400).json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body
      if (!email || !otp) {
        return res.status(400).json({ success: false, error: 'Email and OTP are required' })
      }
      if (otp.length !== 4 || isNaN(otp)) {
        return res.status(400).json({ success: false, error: 'OTP must be a 4-digit number' })
      }
      const result = await otpService.verifyOTP(email, otp)
      return res.status(result.success ? 200 : 400).json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

module.exports = AuthController
