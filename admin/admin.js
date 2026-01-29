// DERMASAN Admin Panel JavaScript

// Global state
let currentSection = 'dashboard';
let productsData = [];
let galleryData = [];
let testimonialsData = [];
let settingsData = {};
let contentData = {};
const API_BASE_URL = window.API_BASE_URL || '';
const apiUrl = (path) => `${API_BASE_URL}${path}`;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    await checkAuth();
    
    // Initialize event listeners
    initializeSidebar();
    initializeForms();
    initializeFileInputs();
    
    // Load initial data
    await loadAllData();
    
    // Set up logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// ==================== Authentication ====================

async function checkAuth() {
    try {
           const response = await fetch(apiUrl('/api/auth/status'), {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/admin/login';
            return;
        }
        
        // Set username
        document.getElementById('adminUsername').textContent = data.username || 'Admin';
        document.getElementById('dashboardUsername').textContent = data.username || 'Admin';
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/admin/login';
    }
}

async function handleLogout() {
    try {
           const response = await fetch(apiUrl('/api/auth/logout'), {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Logout failed', 'error');
    }
}

// ==================== Sidebar Navigation ====================

function initializeSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            
            // Update active state
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            // Show section
            showSection(section);
        });
    });
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(section).classList.add('active');
    currentSection = section;
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        hero: 'Hero Section',
        about: 'About Section',
        vision: 'Vision & Mission',
        whychooseus: 'Why Choose Us',
        products: 'Products Management',
        gallery: 'Gallery Management',
        testimonials: 'Testimonials Management',
        contact: 'Contact Information',
        footer: 'Footer Content',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
    
    // Load content data if needed
    if (['hero', 'about', 'vision', 'whychooseus', 'contact', 'footer'].includes(section)) {
        loadContentData();
    }
}

// ==================== Alerts ====================

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type} show`;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

// ==================== Data Loading ====================

async function loadAllData() {
    await Promise.all([
        loadProducts(),
        loadGallery(),
        loadTestimonials(),
        loadSettings(),
        loadContentData()
    ]);
    updateDashboard();
}

async function loadProducts() {
    try {
           const response = await fetch(apiUrl('/api/products'), {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.products) {
            productsData = data.products;
            renderProductsTable();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsData = [];
    }
}

async function loadGallery() {
    try {
           const response = await fetch(apiUrl('/api/gallery'), {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.gallery) {
            galleryData = data.gallery;
            renderGalleryGrid();
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryData = [];
    }
}

async function loadTestimonials() {
    try {
           const response = await fetch(apiUrl('/api/testimonials'), {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.testimonials) {
            testimonialsData = data.testimonials;
            renderTestimonialsTable();
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsData = [];
    }
}

async function loadSettings() {
    try {
           const response = await fetch(apiUrl('/api/settings'), {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.settings) {
            settingsData = data.settings;
            populateSettingsForm();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        settingsData = {};
    }
}

// ==================== Dashboard ====================

function updateDashboard() {
    document.getElementById('totalProducts').textContent = productsData.length;
    document.getElementById('totalGallery').textContent = galleryData.length;
    document.getElementById('totalTestimonials').textContent = testimonialsData.length;
}

// ==================== Products ====================

function initializeForms() {
    // Product Form
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    
    // Gallery Form
    document.getElementById('galleryForm').addEventListener('submit', handleGallerySubmit);
    
    // Testimonial Form
    document.getElementById('testimonialForm').addEventListener('submit', handleTestimonialSubmit);
    
    // Settings Form
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);
    
    // Password Form
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordSubmit);
    
    // Content Management Forms
    document.getElementById('heroForm').addEventListener('submit', handleHeroSubmit);
    document.getElementById('aboutForm').addEventListener('submit', handleAboutSubmit);
    document.getElementById('missionForm').addEventListener('submit', handleMissionSubmit);
    document.getElementById('visionForm').addEventListener('submit', handleVisionFormSubmit);
    document.getElementById('valuesForm').addEventListener('submit', handleValuesSubmit);
    document.getElementById('whyChooseUsForm').addEventListener('submit', handleWhyChooseUsSubmit);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    document.getElementById('footerForm').addEventListener('submit', handleFooterSubmit);
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const payload = {
        category: document.getElementById('productCategory').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value
    };
    
    try {
            const response = await fetch(apiUrl('/api/products'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success || data.product) {
            showAlert('Product added successfully!', 'success');
            e.target.reset();
            await loadProducts();
            updateDashboard();
        } else {
            showAlert(data.error || 'Failed to add product', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showAlert('Failed to add product', 'error');
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    
    if (productsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">No products yet. Add your first product above.</td></tr>';
        return;
    }
    
    tbody.innerHTML = productsData.map(product => `
        <tr>
            <td>${escapeHtml(product.category)}</td>
            <td>${escapeHtml(product.name)}</td>
            <td>${escapeHtml(product.description.substring(0, 100))}${product.description.length > 100 ? '...' : ''}</td>
            <td>${escapeHtml(product.price || 'N/A')}</td>
            <td>
                <button class="btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
            const response = await fetch(apiUrl(`/api/products/${id}`), {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Product deleted successfully!', 'success');
            await loadProducts();
            updateDashboard();
        } else {
            showAlert(data.error || 'Failed to delete product', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Failed to delete product', 'error');
    }
}

// ==================== Gallery ====================

async function handleGallerySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('galleryTitle').value);
    formData.append('category', document.getElementById('galleryCategory').value);
    formData.append('image', document.getElementById('galleryImage').files[0]);
    formData.append('type', 'gallery');
    
    try {
           const response = await fetch(apiUrl('/api/gallery'), {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Image uploaded successfully!', 'success');
            e.target.reset();
            document.getElementById('galleryImagePreview').style.display = 'none';
            await loadGallery();
            updateDashboard();
        } else {
            showAlert(data.error || 'Failed to upload image', 'error');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        showAlert('Failed to upload image', 'error');
    }
}

function renderGalleryGrid() {
    const grid = document.getElementById('galleryGrid');
    
    if (galleryData.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 30px; grid-column: 1/-1;">No images yet. Upload your first image above.</p>';
        return;
    }
    
    const categoryNames = {
        'products': 'محصولات (Products)',
        'team': 'جلسات تیمی (Team)',
        'training': 'دوره‌های آموزشی (Training)',
        'success': 'داستان‌های موفقیت (Success)',
        'events': 'رویدادها (Events)',
        'community': 'جامعه درماسان (Community)'
    };
    
    grid.innerHTML = galleryData.map(item => {
        const isVideo = item.url.match(/\.(mp4|webm|ogg|mov)$/i);
        const mediaDisplay = isVideo 
            ? `<video src="${escapeHtml(item.url)}" style="width: 100%; height: 200px; object-fit: cover;"></video>`
            : `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title)}">`;
        
        return `
            <div class="gallery-item">
                ${mediaDisplay}
                ${isVideo ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 40px; text-shadow: 0 2px 10px rgba(0,0,0,0.8);"><i class="fas fa-play-circle"></i></div>' : ''}
                <div class="gallery-item-actions">
                    <div class="gallery-item-info">
                        <strong>${escapeHtml(item.title)}</strong><br>
                        <small style="background: var(--primary-color); color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
                            ${categoryNames[item.category] || item.category || 'Uncategorized'}
                        </small>
                    </div>
                    <button class="btn-danger" onclick="deleteGalleryItem('${item.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

async function deleteGalleryItem(id) {
    if (!confirm('Are you sure you want to delete this image?')) {
        return;
    }
    
    try {
            const response = await fetch(apiUrl(`/api/gallery/${id}`), {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Image deleted successfully!', 'success');
            await loadGallery();
            updateDashboard();
        } else {
            showAlert(data.error || 'Failed to delete image', 'error');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        showAlert('Failed to delete image', 'error');
    }
}

// ==================== Testimonials ====================

async function handleTestimonialSubmit(e) {
    e.preventDefault();
    
    const testimonialData = {
        name: document.getElementById('testimonialName').value,
        role: document.getElementById('testimonialRole').value,
        text: document.getElementById('testimonialText').value,
        rating: parseInt(document.getElementById('testimonialRating').value)
    };
    
    try {
            const response = await fetch(apiUrl('/api/testimonials'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testimonialData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Testimonial added successfully!', 'success');
            e.target.reset();
            await loadTestimonials();
            updateDashboard();
        } else {
            showAlert(data.error || 'Failed to add testimonial', 'error');
        }
    } catch (error) {
        console.error('Error adding testimonial:', error);
        showAlert('Failed to add testimonial', 'error');
    }
}

function renderTestimonialsTable() {
    const tbody = document.getElementById('testimonialsTableBody');
    
    if (testimonialsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">No testimonials yet. Add your first testimonial above.</td></tr>';
        return;
    }
    
    tbody.innerHTML = testimonialsData.map(testimonial => `
        <tr>
            <td>${escapeHtml(testimonial.name)}</td>
            <td>${escapeHtml(testimonial.role || 'N/A')}</td>
            <td>${escapeHtml(testimonial.text.substring(0, 100))}${testimonial.text.length > 100 ? '...' : ''}</td>
            <td>${'⭐'.repeat(testimonial.rating || 5)}</td>
            <td>
                <button class="btn-danger" onclick="deleteTestimonial('${testimonial.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
        return;
    }
    
    try {
        const response = await fetch(apiUrl(`/api/testimonials/${id}`), {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Testimonial deleted successfully!', 'success');
            await loadTestimonials();
            updateDashboard();
        } else {
            showAlert(data.error || 'Failed to delete testimonial', 'error');
        }
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        showAlert('Failed to delete testimonial', 'error');
    }
}

// ==================== Settings ====================

function populateSettingsForm() {
    if (settingsData.siteName) {
        document.getElementById('siteName').value = settingsData.siteName;
    }
    if (settingsData.siteDescription) {
        document.getElementById('siteDescription').value = settingsData.siteDescription;
    }
    if (settingsData.contactEmail) {
        document.getElementById('contactEmail').value = settingsData.contactEmail;
    }
    if (settingsData.contactPhone) {
        document.getElementById('contactPhone').value = settingsData.contactPhone;
    }
}

async function handleSettingsSubmit(e) {
    e.preventDefault();
    
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value
    };
    
    try {
            const response = await fetch(apiUrl('/api/settings'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Settings saved successfully!', 'success');
            await loadSettings();
        } else {
            showAlert(data.error || 'Failed to save settings', 'error');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showAlert('Failed to save settings', 'error');
    }
}

async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
            const response = await fetch(apiUrl('/api/change-password'), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Password changed successfully!', 'success');
            e.target.reset();
        } else {
            showAlert(data.error || 'Failed to change password', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('Failed to change password', 'error');
    }
}

// ==================== File Input Preview ====================

function initializeFileInputs() {
    // Gallery Image Preview
    document.getElementById('galleryImage').addEventListener('change', (e) => {
        previewImage(e.target, 'galleryImagePreview');
    });
}

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
        preview.innerHTML = '';
    }
}

// ==================== Utilities ====================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Make delete functions global for onclick handlers
window.deleteProduct = deleteProduct;
window.deleteGalleryItem = deleteGalleryItem;
window.deleteTestimonial = deleteTestimonial;

// ==================== CONTENT MANAGEMENT ====================

async function loadContentData() {
    try {
        const response = await fetch(apiUrl('/api/content'), {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.data) {
            contentData = data.data;
            populateContentForms();
        }
    } catch (error) {
        console.error('Error loading content:', error);
        contentData = {};
    }
}

function populateContentForms() {
    // Populate Hero Form
    if (contentData.hero) {
        document.getElementById('heroTitle').value = contentData.hero.title || '';
        document.getElementById('heroSubtitle').value = contentData.hero.subtitle || '';
        document.getElementById('heroButtonText').value = contentData.hero.buttonText || '';
        document.getElementById('heroButtonLink').value = contentData.hero.buttonLink || '';
    }
    
    // Populate About Form
    if (contentData.about) {
        document.getElementById('aboutTitle').value = contentData.about.title || '';
        document.getElementById('aboutWhoWeAreTitle').value = contentData.about.whoWeAreTitle || '';
        document.getElementById('aboutParagraph1').value = contentData.about.paragraph1 || '';
        document.getElementById('aboutParagraph2').value = contentData.about.paragraph2 || '';
    }
    
    // Populate Vision/Mission/Values Forms
    if (contentData.vision) {
        if (contentData.vision.mission) {
            document.getElementById('missionIcon').value = contentData.vision.mission.icon || '';
            document.getElementById('missionTitle').value = contentData.vision.mission.title || '';
            document.getElementById('missionText').value = contentData.vision.mission.text || '';
        }
        if (contentData.vision.vision) {
            document.getElementById('visionIcon').value = contentData.vision.vision.icon || '';
            document.getElementById('visionTitle').value = contentData.vision.vision.title || '';
            document.getElementById('visionText').value = contentData.vision.vision.text || '';
        }
        if (contentData.vision.values) {
            document.getElementById('valuesIcon').value = contentData.vision.values.icon || '';
            document.getElementById('valuesTitle').value = contentData.vision.values.title || '';
            document.getElementById('valuesText').value = contentData.vision.values.text || '';
        }
    }
    
    // Populate Why Choose Us Form
    if (contentData.whyChooseUs) {
        document.getElementById('whyTitle').value = contentData.whyChooseUs.title || '';
        if (contentData.whyChooseUs.features && contentData.whyChooseUs.features.length >= 4) {
            document.getElementById('feature1Icon').value = contentData.whyChooseUs.features[0].icon || '';
            document.getElementById('feature1Title').value = contentData.whyChooseUs.features[0].title || '';
            document.getElementById('feature1Text').value = contentData.whyChooseUs.features[0].text || '';
            
            document.getElementById('feature2Icon').value = contentData.whyChooseUs.features[1].icon || '';
            document.getElementById('feature2Title').value = contentData.whyChooseUs.features[1].title || '';
            document.getElementById('feature2Text').value = contentData.whyChooseUs.features[1].text || '';
            
            document.getElementById('feature3Icon').value = contentData.whyChooseUs.features[2].icon || '';
            document.getElementById('feature3Title').value = contentData.whyChooseUs.features[2].title || '';
            document.getElementById('feature3Text').value = contentData.whyChooseUs.features[2].text || '';
            
            document.getElementById('feature4Icon').value = contentData.whyChooseUs.features[3].icon || '';
            document.getElementById('feature4Title').value = contentData.whyChooseUs.features[3].title || '';
            document.getElementById('feature4Text').value = contentData.whyChooseUs.features[3].text || '';
        }
    }
    
    // Populate Contact Form
    if (contentData.contact) {
        document.getElementById('contactTitle').value = contentData.contact.title || '';
        document.getElementById('contactPhone').value = contentData.contact.phone || '';
        document.getElementById('contactWhatsapp').value = contentData.contact.whatsapp || '';
        document.getElementById('contactAddress').value = contentData.contact.address || '';
        document.getElementById('contactWorkingHours').value = contentData.contact.workingHours || '';
        document.getElementById('contactClosedDays').value = contentData.contact.closedDays || '';
        document.getElementById('contactMapEmbed').value = contentData.contact.mapEmbed || '';
    }
    
    // Populate Footer Form
    if (contentData.footer) {
        document.getElementById('footerCompanyName').value = contentData.footer.companyName || '';
        document.getElementById('footerSubtitle').value = contentData.footer.subtitle || '';
        document.getElementById('footerTagline').value = contentData.footer.tagline || '';
        document.getElementById('footerAboutText').value = contentData.footer.aboutText || '';
        document.getElementById('footerCopyright').value = contentData.footer.copyright || '';
    }
}

// Hero Section Handler
async function handleHeroSubmit(e) {
    e.preventDefault();
    
    const heroData = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        buttonText: document.getElementById('heroButtonText').value,
        buttonLink: document.getElementById('heroButtonLink').value,
        logoImage: contentData.hero?.logoImage || 'Adobe ds- file۱.png'
    };
    
    try {
            const response = await fetch(apiUrl('/api/content/hero'), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(heroData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Hero section updated successfully!', 'success');
            contentData.hero = heroData;
        } else {
            showAlert('Failed to update hero section: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating hero section:', error);
        showAlert('Error updating hero section', 'error');
    }
}

// About Section Handler
async function handleAboutSubmit(e) {
    e.preventDefault();
    
    const aboutData = {
        title: document.getElementById('aboutTitle').value,
        whoWeAreTitle: document.getElementById('aboutWhoWeAreTitle').value,
        paragraph1: document.getElementById('aboutParagraph1').value,
        paragraph2: document.getElementById('aboutParagraph2').value
    };
    
    try {
            const response = await fetch(apiUrl('/api/content/about'), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aboutData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('About section updated successfully!', 'success');
            contentData.about = aboutData;
        } else {
            showAlert('Failed to update about section: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating about section:', error);
        showAlert('Error updating about section', 'error');
    }
}

// Mission Handler
async function handleMissionSubmit(e) {
    e.preventDefault();
    
    if (!contentData.vision) contentData.vision = {};
    
    contentData.vision.mission = {
        icon: document.getElementById('missionIcon').value,
        title: document.getElementById('missionTitle').value,
        text: document.getElementById('missionText').value
    };
    
    await saveVisionSection();
}

// Vision Handler
async function handleVisionFormSubmit(e) {
    e.preventDefault();
    
    if (!contentData.vision) contentData.vision = {};
    
    contentData.vision.vision = {
        icon: document.getElementById('visionIcon').value,
        title: document.getElementById('visionTitle').value,
        text: document.getElementById('visionText').value
    };
    
    await saveVisionSection();
}

// Values Handler
async function handleValuesSubmit(e) {
    e.preventDefault();
    
    if (!contentData.vision) contentData.vision = {};
    
    contentData.vision.values = {
        icon: document.getElementById('valuesIcon').value,
        title: document.getElementById('valuesTitle').value,
        text: document.getElementById('valuesText').value
    };
    
    await saveVisionSection();
}

// Save Vision Section
async function saveVisionSection() {
    try {
        const response = await fetch(apiUrl('/api/content/vision'), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentData.vision)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Vision section updated successfully!', 'success');
        } else {
            showAlert('Failed to update vision section: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating vision section:', error);
        showAlert('Error updating vision section', 'error');
    }
}

// Why Choose Us Handler
async function handleWhyChooseUsSubmit(e) {
    e.preventDefault();
    
    const whyChooseUsData = {
        title: document.getElementById('whyTitle').value,
        features: [
            {
                icon: document.getElementById('feature1Icon').value,
                title: document.getElementById('feature1Title').value,
                text: document.getElementById('feature1Text').value
            },
            {
                icon: document.getElementById('feature2Icon').value,
                title: document.getElementById('feature2Title').value,
                text: document.getElementById('feature2Text').value
            },
            {
                icon: document.getElementById('feature3Icon').value,
                title: document.getElementById('feature3Title').value,
                text: document.getElementById('feature3Text').value
            },
            {
                icon: document.getElementById('feature4Icon').value,
                title: document.getElementById('feature4Title').value,
                text: document.getElementById('feature4Text').value
            }
        ]
    };
    
    try {
            const response = await fetch(apiUrl('/api/content/whyChooseUs'), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(whyChooseUsData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Why Choose Us section updated successfully!', 'success');
            contentData.whyChooseUs = whyChooseUsData;
        } else {
            showAlert('Failed to update Why Choose Us section: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating Why Choose Us section:', error);
        showAlert('Error updating Why Choose Us section', 'error');
    }
}

// Contact Handler
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const contactData = {
        title: document.getElementById('contactTitle').value,
        phone: document.getElementById('contactPhone').value,
        whatsapp: document.getElementById('contactWhatsapp').value,
        address: document.getElementById('contactAddress').value,
        workingHours: document.getElementById('contactWorkingHours').value,
        closedDays: document.getElementById('contactClosedDays').value,
        mapEmbed: document.getElementById('contactMapEmbed').value
    };
    
    try {
            const response = await fetch(apiUrl('/api/content/contact'), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Contact section updated successfully!', 'success');
            contentData.contact = contactData;
        } else {
            showAlert('Failed to update contact section: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating contact section:', error);
        showAlert('Error updating contact section', 'error');
    }
}

// Footer Handler
async function handleFooterSubmit(e) {
    e.preventDefault();
    
    const footerData = {
        companyName: document.getElementById('footerCompanyName').value,
        subtitle: document.getElementById('footerSubtitle').value,
        tagline: document.getElementById('footerTagline').value,
        aboutText: document.getElementById('footerAboutText').value,
        copyright: document.getElementById('footerCopyright').value,
        quickLinks: contentData.footer?.quickLinks || [
            {"text": "خانه", "url": "#home"},
            {"text": "درباره ما", "url": "#about"},
            {"text": "چشم‌انداز", "url": "#vision"},
            {"text": "محصولات", "url": "#products"},
            {"text": "گالری", "url": "#gallery"}
        ]
    };
    
    try {
            const response = await fetch(apiUrl('/api/content/footer'), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(footerData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Footer section updated successfully!', 'success');
            contentData.footer = footerData;
        } else {
            showAlert('Failed to update footer section: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error updating footer section:', error);
        showAlert('Error updating footer section', 'error');
    }
}
