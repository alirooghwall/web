const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
const config = require('./server/config');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const sessionTimeoutMs = parseInt(process.env.SESSION_TIMEOUT) || 1800000; // 30 minutes
const sessionTimeoutSeconds = Math.floor(sessionTimeoutMs / 1000);

if (isProduction) {
    app.set('trust proxy', 1);
}

app.disable('x-powered-by');

// Security & performance
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(compression());

// Middleware
const corsOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: corsOrigins.length
        ? (origin, callback) => {
            if (!origin || corsOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        }
        : true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
let sessionStore;
if (process.env.SESSION_STORE === 'file') {
    const sessionDir = path.join(__dirname, 'cms', 'sessions');
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }
    const FileStore = require('session-file-store')(session);
    sessionStore = new FileStore({
        path: sessionDir,
        retries: 0,
        ttl: sessionTimeoutSeconds
    });
}

app.use(session({
    name: 'dermasan.sid',
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'dermasan-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: sessionTimeoutMs
    }
}));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
});

// Static files
app.use(express.static(path.join(__dirname), {
    maxAge: isProduction ? '7d' : 0
}));
app.use('/uploads', express.static(config.paths.uploadDir));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', apiLimiter, apiRoutes);

// Serve admin pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Route not found' 
    });
});

// Start server (skip in Vercel serverless runtime)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════╗
║     DERMASAN Admin Server Running        ║
╠══════════════════════════════════════════╣
║  Port: ${PORT}                              ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Admin Panel: http://localhost:${PORT}/admin  ║
╚══════════════════════════════════════════╝
    `);
    });
}

module.exports = app;
