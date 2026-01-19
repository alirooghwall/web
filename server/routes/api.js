const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { loadData, saveData, sanitize } = require('../utils/fileHandler');
const { uploadSingle, handleUploadError } = require('../utils/uploadHandler');

const router = express.Router();

// ==================== PRODUCTS API ====================

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await loadData('products') || [];
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load products',
            message: error.message
        });
    }
});

// Get single product
router.get('/products/:id', async (req, res) => {
    try {
        const products = await loadData('products') || [];
        const product = products.find(p => p.id === req.params.id);
        
        if (product) {
            res.json({ success: true, data: product });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Product not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load product',
            message: error.message
        });
    }
});

// Create product (protected)
router.post('/products', isAuthenticated, uploadSingle, handleUploadError, async (req, res) => {
    try {
        const products = await loadData('products') || [];
        
        const fileUrl = req.file ? `/uploads/products/${req.file.filename}` : '';
        
        const newProduct = sanitize({
            id: Date.now().toString(),
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price || '',
            image: fileUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        products.push(newProduct);
        const saved = await saveData('products', products);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Product created successfully',
                product: newProduct
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save product' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create product',
            message: error.message
        });
    }
});

// Update product (protected)
router.put('/products/:id', isAuthenticated, async (req, res) => {
    try {
        const products = await loadData('products') || [];
        const index = products.findIndex(p => p.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                error: 'Product not found' 
            });
        }
        
        products[index] = sanitize({
            ...products[index],
            ...req.body,
            id: req.params.id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        });
        
        const saved = await saveData('products', products);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Product updated successfully',
                data: products[index]
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save product' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update product',
            message: error.message
        });
    }
});

// Delete product (protected)
router.delete('/products/:id', isAuthenticated, async (req, res) => {
    try {
        const products = await loadData('products') || [];
        const filteredProducts = products.filter(p => p.id !== req.params.id);
        
        if (filteredProducts.length === products.length) {
            return res.status(404).json({ 
                success: false, 
                error: 'Product not found' 
            });
        }
        
        const saved = await saveData('products', filteredProducts);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Product deleted successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to delete product' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete product',
            message: error.message
        });
    }
});

// ==================== GALLERY API ====================

// Get all gallery items
router.get('/gallery', async (req, res) => {
    try {
        const gallery = await loadData('gallery') || [];
        res.json({ success: true, gallery });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load gallery',
            message: error.message
        });
    }
});

// Add gallery item (protected)
router.post('/gallery', isAuthenticated, uploadSingle, handleUploadError, async (req, res) => {
    try {
        const gallery = await loadData('gallery') || [];
        
        // Use the actual upload type from request body (defaults to 'gallery')
        const uploadType = req.body.type || 'gallery';
        const fileUrl = req.file ? `/uploads/${uploadType}/${req.file.filename}` : '';
        
        const newItem = sanitize({
            id: Date.now().toString(),
            title: req.body.title,
            category: req.body.category || '',
            url: fileUrl,
            filename: req.file ? req.file.filename : '',
            createdAt: new Date().toISOString()
        });
        
        gallery.push(newItem);
        const saved = await saveData('gallery', gallery);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Gallery item added successfully',
                data: newItem
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save gallery item' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to add gallery item',
            message: error.message
        });
    }
});

// Delete gallery item (protected)
router.delete('/gallery/:id', isAuthenticated, async (req, res) => {
    try {
        const gallery = await loadData('gallery') || [];
        const filteredGallery = gallery.filter(item => item.id !== req.params.id);
        
        if (filteredGallery.length === gallery.length) {
            return res.status(404).json({ 
                success: false, 
                error: 'Gallery item not found' 
            });
        }
        
        const saved = await saveData('gallery', filteredGallery);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Gallery item deleted successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to delete gallery item' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete gallery item',
            message: error.message
        });
    }
});

// ==================== TESTIMONIALS API ====================

// Get all testimonials
router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await loadData('testimonials') || [];
        res.json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load testimonials',
            message: error.message
        });
    }
});

// Add testimonial (protected)
router.post('/testimonials', isAuthenticated, async (req, res) => {
    try {
        const testimonials = await loadData('testimonials') || [];
        
        const newTestimonial = sanitize({
            id: Date.now().toString(),
            name: req.body.name,
            role: req.body.role || '',
            text: req.body.text,
            rating: parseInt(req.body.rating) || 5,
            createdAt: new Date().toISOString()
        });
        
        testimonials.push(newTestimonial);
        const saved = await saveData('testimonials', testimonials);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Testimonial added successfully',
                data: newTestimonial
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save testimonial' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to add testimonial',
            message: error.message
        });
    }
});

// Delete testimonial (protected)
router.delete('/testimonials/:id', isAuthenticated, async (req, res) => {
    try {
        const testimonials = await loadData('testimonials') || [];
        const filteredTestimonials = testimonials.filter(item => item.id !== req.params.id);
        
        if (filteredTestimonials.length === testimonials.length) {
            return res.status(404).json({ 
                success: false, 
                error: 'Testimonial not found' 
            });
        }
        
        const saved = await saveData('testimonials', filteredTestimonials);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Testimonial deleted successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to delete testimonial' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete testimonial',
            message: error.message
        });
    }
});

// ==================== SETTINGS API ====================

// Get settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await loadData('settings') || {};
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load settings',
            message: error.message
        });
    }
});

// Update settings (protected)
router.put('/settings', isAuthenticated, async (req, res) => {
    try {
        const settings = sanitize(req.body);
        const saved = await saveData('settings', settings);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Settings updated successfully',
                data: settings
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save settings' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update settings',
            message: error.message
        });
    }
});

// Update settings via POST (protected) - for admin.js compatibility
router.post('/settings', isAuthenticated, async (req, res) => {
    try {
        const currentSettings = await loadData('settings') || {};
        const settings = sanitize({ ...currentSettings, ...req.body });
        const saved = await saveData('settings', settings);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Settings updated successfully',
                settings
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save settings' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update settings',
            message: error.message
        });
    }
});

// Change password (protected)
router.post('/change-password', isAuthenticated, async (req, res) => {
    const bcrypt = require('bcryptjs');
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            error: 'Current password and new password are required'
        });
    }
    
    try {
        const adminPassword = process.env.ADMIN_PASSWORD_HASH;
        const isMatch = await bcrypt.compare(currentPassword, adminPassword);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }
        
        // In a real application, you would update the password in the database
        // For now, we'll return success but note that .env needs manual update
        const newHash = await bcrypt.hash(newPassword, 10);
        
        res.json({
            success: true,
            message: 'Password changed successfully. Please update ADMIN_PASSWORD_HASH in .env with: ' + newHash,
            newHash
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to change password',
            message: error.message
        });
    }
});

// ==================== UPLOAD API ====================

// Upload image (protected)
router.post('/upload', isAuthenticated, uploadSingle, handleUploadError, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            error: 'No file uploaded' 
        });
    }
    
    const fileUrl = `/uploads/${req.body.type || 'products'}/${req.file.filename}`;
    
    res.json({ 
        success: true, 
        message: 'File uploaded successfully',
        data: {
            filename: req.file.filename,
            path: req.file.path,
            url: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        }
    });
});

// ==================== CONTENT API ====================

// Get all content
router.get('/content', async (req, res) => {
    try {
        const content = await loadData('content') || {};
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load content',
            message: error.message
        });
    }
});

// Get specific content section
router.get('/content/:section', async (req, res) => {
    try {
        const content = await loadData('content') || {};
        const section = content[req.params.section];
        
        if (section) {
            res.json({ success: true, data: section });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Content section not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load content section',
            message: error.message
        });
    }
});

// Update specific content section (protected)
router.put('/content/:section', isAuthenticated, async (req, res) => {
    try {
        const content = await loadData('content') || {};
        content[req.params.section] = sanitize(req.body);
        
        const saved = await saveData('content', content);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Content section updated successfully',
                data: content[req.params.section]
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save content' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update content section',
            message: error.message
        });
    }
});

// Update entire content (protected)
router.put('/content', isAuthenticated, async (req, res) => {
    try {
        const content = sanitize(req.body);
        const saved = await saveData('content', content);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Content updated successfully',
                data: content
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save content' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update content',
            message: error.message
        });
    }
});

// ==================== GENERIC DATA API ====================

// Get any data file
router.get('/data/:filename', async (req, res) => {
    try {
        const data = await loadData(req.params.filename);
        if (data !== null) {
            res.json({ success: true, data });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Data file not found' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load data',
            message: error.message
        });
    }
});

// Save any data file (protected)
router.post('/data/:filename', isAuthenticated, async (req, res) => {
    try {
        const data = sanitize(req.body);
        const saved = await saveData(req.params.filename, data);
        
        if (saved) {
            res.json({ 
                success: true, 
                message: 'Data saved successfully',
                data
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save data' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save data',
            message: error.message
        });
    }
});

module.exports = router;
