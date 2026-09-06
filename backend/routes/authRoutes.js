const express = require('express');
const router = express.Router();
const { authLimiter, codeLimiter } = require('../middleware/rateLimiter')
const { signup,
    login,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');


router.post('/signup', authLimiter, signup)
router.post('/login', authLimiter, login)
router.post('/verify-email', codeLimiter, verifyEmail)
router.post('/resend-code', authLimiter, resendVerificationCode)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password', codeLimiter, resetPassword)

module.exports = router;