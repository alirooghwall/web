const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                error: 'Username and password are required' 
            });
        }
        
        // Check credentials
        const isValidUsername = username === config.admin.username;
        const isValidPassword = await bcrypt.compare(password, config.admin.passwordHash);
        
        if (isValidUsername && isValidPassword) {
            // Set session
            req.session.adminLoggedIn = true;
            req.session.adminUsername = username;
            req.session.lastActivity = Date.now();
            req.session.loginTime = Date.now();
            
            return res.json({ 
                success: true, 
                message: 'Login successful',
                username: username
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid username or password' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Login failed',
            message: error.message
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: 'Logout failed' 
            });
        }
        res.json({ 
            success: true, 
            message: 'Logout successful' 
        });
    });
});

// Check session status
router.get('/status', (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.json({ 
            success: true,
            authenticated: true,
            username: req.session.adminUsername,
            loginTime: req.session.loginTime
        });
    } else {
        return res.json({ 
            success: true,
            authenticated: false 
        });
    }
});

// Protected route example - verify token
router.get('/verify', isAuthenticated, (req, res) => {
    res.json({ 
        success: true,
        authenticated: true,
        username: req.session.adminUsername
    });
});

module.exports = router;
