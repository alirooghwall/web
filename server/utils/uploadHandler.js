const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config');
const { ensureDir } = require('./fileHandler');

// Configure storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadType = req.body.type || 'products';
        const uploadPath = path.join(config.paths.uploadDir, uploadType);
        
        try {
            await ensureDir(uploadPath);
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = config.upload.allowedTypes;
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = config.upload.allowedExtensions;
    
    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, PNG, GIF & WEBP files are allowed.'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: fileFilter
});

// Upload single file
const uploadSingle = upload.single('image');

// Upload multiple files
const uploadMultiple = upload.array('images', 10);

// Handle upload errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large',
                message: 'File size must be less than 5MB'
            });
        }
        return res.status(400).json({
            success: false,
            error: 'Upload error',
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            error: 'Upload failed',
            message: err.message
        });
    }
    next();
};

// Delete file
async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
}

module.exports = {
    uploadSingle,
    uploadMultiple,
    handleUploadError,
    deleteFile
};
