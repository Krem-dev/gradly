const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/profile/:id', AuthController.getProfile)
router.post('/change-password', AuthController.changePassword)
router.post('/delete-account', AuthController.deleteAccount)
router.post('/send-otp', AuthController.sendOTP)
router.post('/verify-otp', AuthController.verifyOTP)
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password', AuthController.resetPassword)

module.exports = router
