require('dotenv').config();
const path = require('path');

module.exports = {
    // Server settings
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Session settings
    session: {
        secret: process.env.SESSION_SECRET || 'dermasan-secret-key-change-in-production',
        timeout: parseInt(process.env.SESSION_TIMEOUT) || 1800000 // 30 minutes
    },
    
    // Admin credentials
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$10$rZ5HxnFJQVqE.yJKLVZNfO1nF6HvZ8Qi4ZYXg5cLb4C1LqXC/BqpG'
    },
    
    // Paths
    paths: {
        dataDir: path.join(__dirname, '..', process.env.DATA_DIR || 'cms/data'),
        uploadDir: path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')
    },
    
    // Upload settings
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    
    // Site info
    site: {
        name: 'DERMASAN',
        version: '1.0.0'
    }
};
