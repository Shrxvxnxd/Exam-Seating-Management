const rateLimit = require('express-rate-limit');

// Global Rate Limiter: 100 requests per 15 minutes per IP
// Enough for normal usage, but stops aggressive scraping
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // Limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too Many Requests',
        message: 'You have exceeded the request limit. Please try again later.'
    }
});

// Strict Login Limiter: 5 attempts per minute per IP
// Prevents brute force attacks
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too Many Login Attempts',
        message: 'Please try again after 1 minute.'
    }
});

// OTP Request Limiter: 3 requests per 5 minutes
const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: {
        error: 'Too Many OTP Requests',
        message: 'Please wait before requesting another OTP.'
    }
});

module.exports = {
    globalLimiter,
    authLimiter,
    otpLimiter
};
