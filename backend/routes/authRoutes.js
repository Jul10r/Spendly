const express = require('express');
const router = express.Router();
const { signup,
    login,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');


router.post('/signup', signup)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/resend-code', resendVerificationCode)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router;