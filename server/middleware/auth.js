// Authentication Middleware

// Check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.adminLoggedIn) {
        return res.status(401).json({ 
            success: false, 
            error: 'Not authenticated',
            message: 'Please login to access this resource'
        });
    }
    
    // Check session timeout
    if (req.session.lastActivity) {
        const now = Date.now();
        const timeout = parseInt(process.env.SESSION_TIMEOUT) || 1800000; // 30 minutes
        
        if (now - req.session.lastActivity > timeout) {
            req.session.destroy();
            return res.status(401).json({ 
                success: false, 
                error: 'Session expired',
                message: 'Your session has expired. Please login again.'
            });
        }
    }
    
    // Update last activity
    req.session.lastActivity = Date.now();
    next();
};

// Get current admin username
const getAdminUsername = (req) => {
    return req.session.adminUsername || '';
};

module.exports = {
    isAuthenticated,
    getAdminUsername
};
