const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders :false,
    message : {
        success : false,
        error: 'tham ja bhai tham ja',
        messgae: 'To many attempt. please go to hell and come back after 15 min'
    }
})

module.exports = {authLimiter}