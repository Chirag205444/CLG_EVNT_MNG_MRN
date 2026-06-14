const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const token = req.cookies.EVNT_token || 
            (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                ? req.headers.authorization.split(' ')[1] 
                : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Fetch user from DB, excluding password
        const user = await userModel.findById(decoded.id).select('-password').lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not found"
            });
        }

        // Attach user info to request object
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in authMiddleware:", err.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
