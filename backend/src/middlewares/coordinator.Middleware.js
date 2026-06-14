const coordinatorMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'coordinator') {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }
    next();
};

module.exports = coordinatorMiddleware;
