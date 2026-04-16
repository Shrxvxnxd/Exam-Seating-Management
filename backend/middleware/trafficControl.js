const MAX_CONCURRENT_REQUESTS = 200; // Limit for "Active" users
let activeRequests = 0;

const trafficControl = (req, res, next) => {
    activeRequests++;

    res.on('finish', () => {
        activeRequests--;
        if (activeRequests < 0) activeRequests = 0;
    });

    res.on('close', () => {
        activeRequests--;
        if (activeRequests < 0) activeRequests = 0;
    });

    // Whitelist check: Skip LIMIT check for these, but we still COUNT them above
    if (req.path === '/api/health' || req.path === '/api/status' || req.path === '/api/logs') {
        return next();
    }

    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        console.warn(`[Traffic Control] Server Busy. Active: ${activeRequests}`);
        // If we block, we must decrement immediately since the response finishes differently? 
        // Actually, res.status().json() will trigger 'finish', so decrement logic holds.
        return res.status(503).json({
            error: 'Server Busy',
            message: 'High traffic. Try again later.',
            retryAfter: 60
        });
    }

    next();
};

const getActiveRequests = () => activeRequests;

module.exports = { trafficControl, getActiveRequests };
