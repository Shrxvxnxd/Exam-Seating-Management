const http = require('http');

const events = [
    {
        type: 'maintenance',
        title: 'EMERGENCY LOCKDOWN',
        description: 'Critical security update in progress. System access is restricted until further notice.',
        status: 'In Progress',
        scheduled_start: new Date().toISOString(),
        scheduled_end: new Date(Date.now() + 3600000).toISOString() // +1 hour
    },
    {
        type: 'incident',
        title: 'Login Service Degraded',
        description: 'Intermittent errors reported during OTP verification.',
        status: 'Investigating',
        created_at: new Date(Date.now() - 1800000).toISOString() // -30 mins
    },
    {
        type: 'info',
        title: 'New Feature: Dark Mode',
        description: 'Dark mode is now available for all students!',
        status: 'Released',
        created_at: new Date(Date.now() - 86400000).toISOString() // -1 day
    }
];

const postEvent = (event) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(event);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/system-events',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

const seed = async () => {

    for (const event of events) {
        try {
            const data = await postEvent(event);
            // Created: data.title
        } catch (err) {
            console.error('Failed:', err.message);
        }
    }

};

seed();
