const nodemailer = require('nodemailer')
const { pool } = require('../config/database')

const otpStore = new Map()

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function sendOTPEmail(email, otp) {
  const hostingerEmail = process.env.HOSTINGER_EMAIL
  const hostingerPassword = process.env.HOSTINGER_PASSWORD
  const hostingerSmtp = process.env.HOSTINGER_SMTP || 'smtp.hostinger.com'
  const hostingerPort = process.env.HOSTINGER_PORT || 465

  console.log('📧 [OTP] Sending OTP to:', email)
  console.log('🔐 [OTP] OTP Code:', otp)

  if (!hostingerEmail || !hostingerPassword) {
    console.log('⚠️  [OTP] Hostinger credentials not configured. OTP logged to console instead.')
    return true
  }

  try {
    const transporter = nodemailer.createTransport({
      host: hostingerSmtp,
      port: parseInt(hostingerPort),
      secure: true,
      auth: {
        user: hostingerEmail,
        pass: hostingerPassword
      }
    })

    const mailOptions = {
      from: hostingerEmail,
      to: email,
      subject: 'Your Gradly Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the following 4-digit code to proceed:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #FF6B35; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© Gradly - Your Academic Success Partner</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('✅ [OTP] Email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('❌ [OTP] Failed to send email:', error.message)
    throw error
  }
}

async function sendOTP(email) {
  try {
    const user = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    
    if (user[0].length === 0) {
      return {
        success: false,
        error: 'Email not found'
      }
    }

    const otp = generateOTP()
    const expiresAt = Date.now() + (10 * 60 * 1000)

    otpStore.set(email, { otp, expiresAt })

    await sendOTPEmail(email, otp)

    return {
      success: true,
      message: 'OTP sent to email'
    }
  } catch (error) {
    console.error('❌ [OTP] Error sending OTP:', error)
    return {
      success: false,
      error: error.message || 'Failed to send OTP'
    }
  }
}

async function verifyOTP(email, otp) {
  try {
    const storedData = otpStore.get(email)

    if (!storedData) {
      return {
        success: false,
        error: 'OTP not found. Please request a new one.'
      }
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email)
      return {
        success: false,
        error: 'OTP has expired. Please request a new one.'
      }
    }

    if (storedData.otp !== otp) {
      return {
        success: false,
        error: 'Invalid OTP'
      }
    }

    otpStore.delete(email)

    return {
      success: true,
      message: 'OTP verified successfully'
    }
  } catch (error) {
    console.error('❌ [OTP] Error verifying OTP:', error)
    return {
      success: false,
      error: error.message || 'Failed to verify OTP'
    }
  }
}

module.exports = {
  sendOTP,
  verifyOTP,
  generateOTP,
  sendOTPEmail
}
