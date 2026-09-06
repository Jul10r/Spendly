const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: 'Too many attempts. Try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const codeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: 'Too many attempts. Try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 140,
    message: {
        message: 'Too many attempts. Try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});


module.exports = { authLimiter, codeLimiter, generalLimiter };