const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    // Token comes in the Authorization header as: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user to the request object
        // Now every subsequent middleware and controller can access req.user 
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token.',
        });
    }
}

module.exports = { authenticate };