// ===== API CONFIG =====
const API_BASE_URL = window.API_BASE_URL || '';
const apiUrl = (path) => `${API_BASE_URL}${path}`;
const resolveMediaUrl = (url) => (url && url.startsWith('/uploads') ? `${API_BASE_URL}${url}` : url);

// ===== LOAD CONTENT FROM CMS =====
async function loadContentFromCMS() {
    try {
        const response = await fetch(apiUrl('/api/content'));
        const data = await response.json();
        
        if (data.success && data.data) {
            const content = data.data;
            
            // Update Hero Section
            if (content.hero) {
                const heroTitle = document.querySelector('.hero-title');
                const heroSubtitle = document.querySelector('.hero-subtitle');
                const heroBtn = document.querySelector('.hero .btn-primary span');
                
                if (heroTitle) heroTitle.textContent = content.hero.title;
                if (heroSubtitle) heroSubtitle.textContent = content.hero.subtitle;
                if (heroBtn) heroBtn.textContent = content.hero.buttonText;
            }
            
            // Update About Section
            if (content.about) {
                const aboutTitle = document.querySelector('#about .section-header h2');
                const aboutWhoTitle = document.querySelector('#about h3');
                const aboutParagraphs = document.querySelectorAll('#about .about-text p');
                
                if (aboutTitle) aboutTitle.textContent = content.about.title;
                if (aboutWhoTitle) aboutWhoTitle.textContent = content.about.whoWeAreTitle;
                if (aboutParagraphs[0]) aboutParagraphs[0].textContent = content.about.paragraph1;
                if (aboutParagraphs[1]) aboutParagraphs[1].textContent = content.about.paragraph2;
            }
            
            // Update Vision/Mission/Values
            if (content.vision) {
                const visionCards = document.querySelectorAll('#vision .vision-card');
                
                if (visionCards[0] && content.vision.mission) {
                    visionCards[0].querySelector('i').className = content.vision.mission.icon;
                    visionCards[0].querySelector('h3').textContent = content.vision.mission.title;
                    visionCards[0].querySelector('p').textContent = content.vision.mission.text;
                }
                
                if (visionCards[1] && content.vision.vision) {
                    visionCards[1].querySelector('i').className = content.vision.vision.icon;
                    visionCards[1].querySelector('h3').textContent = content.vision.vision.title;
                    visionCards[1].querySelector('p').textContent = content.vision.vision.text;
                }
                
                if (visionCards[2] && content.vision.values) {
                    visionCards[2].querySelector('i').className = content.vision.values.icon;
                    visionCards[2].querySelector('h3').textContent = content.vision.values.title;
                    visionCards[2].querySelector('p').textContent = content.vision.values.text;
                }
            }
            
            // Update Why Choose Us
            if (content.whyChooseUs) {
                const whyTitle = document.querySelector('.why-us .section-header h2');
                if (whyTitle) whyTitle.textContent = content.whyChooseUs.title;
                
                const featureItems = document.querySelectorAll('.why-us .feature-item');
                if (content.whyChooseUs.features) {
                    content.whyChooseUs.features.forEach((feature, index) => {
                        if (featureItems[index]) {
                            featureItems[index].querySelector('i').className = feature.icon;
                            featureItems[index].querySelector('h4').textContent = feature.title;
                            featureItems[index].querySelector('p').textContent = feature.text;
                        }
                    });
                }
            }
            
            // Update Contact Section
            if (content.contact) {
                const contactTitle = document.querySelector('#contact .section-header h2');
                if (contactTitle) contactTitle.textContent = content.contact.title;
                
                // Update phone numbers
                const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
                phoneLinks.forEach(link => {
                    link.href = 'tel:' + content.contact.phone.replace(/\s/g, '');
                    link.textContent = content.contact.phone;
                });
                
                // Update WhatsApp
                const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
                whatsappLinks.forEach(link => {
                    link.href = 'https://wa.me/' + content.contact.whatsapp.replace(/[\s+]/g, '');
                });
                
                // Update address
                const addressElements = document.querySelectorAll('.contact-details p');
                addressElements.forEach(elem => {
                    if (elem.textContent.includes('گولایی') || elem.parentElement.querySelector('h4')?.textContent.includes('آدرس')) {
                        elem.textContent = content.contact.address;
                    }
                });
                
                // Update working hours
                const hoursElements = document.querySelectorAll('.contact-item');
                hoursElements.forEach(item => {
                    const h4 = item.querySelector('h4');
                    if (h4 && h4.textContent.includes('ساعات کاری')) {
                        const pElements = item.querySelectorAll('p');
                        if (pElements[0]) pElements[0].textContent = content.contact.workingHours;
                        if (pElements[1]) pElements[1].textContent = content.contact.closedDays;
                    }
                });
                
                // Update map embed
                const mapIframe = document.querySelector('.map-container iframe');
                if (mapIframe && content.contact.mapEmbed) {
                    mapIframe.src = content.contact.mapEmbed;
                }
            }
            
            // Update Footer
            if (content.footer) {
                const footerCompanyName = document.querySelector('.footer-logo h3');
                const footerSubtitle = document.querySelector('.footer-subtitle');
                const footerTagline = document.querySelectorAll('.footer-section p')[0];
                const footerAbout = document.querySelectorAll('.footer-section p')[3];
                const footerCopyright = document.querySelector('.footer-bottom p');
                
                if (footerCompanyName) footerCompanyName.textContent = content.footer.companyName;
                if (footerSubtitle) footerSubtitle.textContent = content.footer.subtitle;
                if (footerTagline) footerTagline.textContent = content.footer.tagline;
                if (footerAbout) footerAbout.textContent = content.footer.aboutText;
                if (footerCopyright) footerCopyright.innerHTML = '&copy; ' + content.footer.copyright;
            }
            
            console.log('Content loaded from CMS successfully');
        }
    } catch (error) {
        console.error('Error loading content from CMS:', error);
        // If content fails to load, the hardcoded content will remain
    }
}

// ===== LOGO LOADER ANIMATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - starting loader');
    
    // Load content and gallery from CMS first
    loadContentFromCMS();
    loadGalleryFromCMS();
    
    const loader = document.getElementById('logoLoader');
    const header = document.getElementById('mainHeader');
    const body = document.body;
    
    // Force scroll to top on page load
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Ensure scroll is locked during intro (body.loading class handles this)
    // Prevent any scroll events
    const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    
    // Add scroll prevention
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    
    // Force hide loader after 3 seconds
    setTimeout(() => {
        console.log('Hiding loader');
        if (loader) {
            loader.classList.add('fade-out');
        }
        
        setTimeout(() => {
            if (loader) {
                loader.style.display = 'none';
                console.log('Loader hidden');
            }
            if (body) {
                body.classList.remove('loading');
            }
            
            // Remove scroll prevention
            window.removeEventListener('scroll', preventScroll);
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            
            // Ensure we're at the top after unlocking
            window.scrollTo(0, 0);
            
            // Start hero animations
            startHeroAnimations();
            
            // Show header on scroll
            window.addEventListener('scroll', showHeaderOnScroll, { once: false });
        }, 800);
    }, 3000);
});

// Start hero animations
function startHeroAnimations() {
    console.log('Starting hero animations');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero .btn');
    
    if (heroTitle) heroTitle.classList.add('animate-in');
    if (heroSubtitle) heroSubtitle.classList.add('animate-in');
    if (heroBtn) heroBtn.classList.add('animate-in');
}

// ===== HEADER ANIMATION ON SCROLL =====
let hasScrolled = false;

function showHeaderOnScroll() {
    const header = document.getElementById('mainHeader');
    
    if (window.scrollY > 100 && !hasScrolled) {
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
        hasScrolled = true;
    } else if (window.scrollY <= 100 && hasScrolled) {
        header.classList.remove('header-visible');
        header.classList.add('header-hidden');
        hasScrolled = false;
    }
}

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function activateNavLink() {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.right = '0';
            navMenu.style.background = 'white';
            navMenu.style.width = '100%';
            navMenu.style.padding = '1rem';
            navMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navMenu.style.animation = 'slideDown 0.3s ease';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            navMenu.style.display = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navMenu.style.display = 'none';
            
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Create WhatsApp message
        const whatsappMessage = `سلام، من ${name} هستم.\n\nشماره تماس: ${phone}\n\nپیام:\n${message}\n\n---\nارسال شده از وبسایت DERMASAN`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // WhatsApp number (without + or spaces)
        const whatsappNumber = '93796582690';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Show success animation
        const btn = contactForm.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fab fa-whatsapp"></i> در حال باز کردن واتساپ...';
        btn.style.background = '#25D366';
        
        // Open WhatsApp
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            
            // Reset form and button after a moment
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }, 500);
    });
}

// ===== SCROLL ANIMATIONS (AOS - Animate On Scroll) =====
const isMobile = window.innerWidth <= 768;

// Different observer options for mobile and desktop
const observerOptions = {
    threshold: isMobile ? 0.05 : 0.15,
    rootMargin: isMobile ? '0px 0px 0px 0px' : '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Apply observer to all elements (mobile and desktop)
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add auto-trigger for card hover animations when they come into view
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Check if animation has already been triggered for this card
                if (card.dataset.animated) return;
                card.dataset.animated = 'true';
                
                // Trigger the 3D hover effect automatically
                setTimeout(() => {
                    // Simulate the hover 3D tilt effect
                    card.style.transition = 'transform 0.6s ease, box-shadow 0.6s ease';
                    card.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg) translateY(-10px) scale(1.02)';
                    card.style.boxShadow = '0 15px 40px rgba(30, 126, 52, 0.3)';
                    
                    // Hold for a moment
                    setTimeout(() => {
                        card.style.transform = 'perspective(1000px) rotateX(-3deg) rotateY(3deg) translateY(-10px) scale(1.02)';
                        
                        // Return to normal
                        setTimeout(() => {
                            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
                            card.style.boxShadow = '';
                        }, 400);
                    }, 400);
                }, 200);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all interactive cards
    const allCards = document.querySelectorAll('.vision-card, .product-card, .feature-item, .gallery-item, .contact-item');
    allCards.forEach(card => cardObserver.observe(card));
});

// ===== HERO SECTION ANIMATIONS =====
// Now handled by startHeroAnimations() function above

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-overlay, .hero-particles');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== CURSOR EFFECT FOR CARDS =====
const cards = document.querySelectorAll('.vision-card, .product-card, .feature-item');

cards.forEach(card => {
    // Desktop: Mouse hover effect
    if (!isMobile) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }
});

// ===== TYPING EFFECT FOR HERO TITLE (Optional Enhancement) =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== GALLERY LIGHTBOX =====
// Gallery data will be loaded from CMS
let galleryData = {
    'products': {
        title: 'محصولات درماسان',
        images: []
    },
    'team': {
        title: 'جلسات تیمی',
        images: []
    },
    'training': {
        title: 'دوره‌های آموزشی',
        images: []
    },
    'success': {
        title: 'داستان‌های موفقیت',
        images: []
    },
    'events': {
        title: 'رویدادها',
        images: []
    },
    'community': {
        title: 'جامعه درماسان',
        images: []
    }
};

// Load gallery images from CMS
async function loadGalleryFromCMS() {
    try {
        const response = await fetch(apiUrl('/api/gallery'));
        const data = await response.json();
        
        if (data.success && data.gallery) {
            // Reset all categories
            Object.keys(galleryData).forEach(key => {
                galleryData[key].images = [];
            });
            
            // Organize images by category
            data.gallery.forEach(item => {
                const category = item.category || 'products';
                if (galleryData[category]) {
                    const resolvedUrl = resolveMediaUrl(item.url);
                    // Determine if it's a video or image
                    const fileExtension = resolvedUrl.split('.').pop().toLowerCase();
                    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension);
                    
                    galleryData[category].images.push({
                        type: isVideo ? 'video' : 'image',
                        src: resolvedUrl,
                        title: item.title,
                        id: item.id
                    });
                }
            });
            
            console.log('Gallery loaded from CMS:', galleryData);
            
            // Display gallery images on the page
            displayGalleryImages(data.gallery);
        }
    } catch (error) {
        console.error('Error loading gallery from CMS:', error);
    }
}

// Display gallery images with captions and load more functionality
let allGalleryImages = [];
let displayedImagesCount = 0;
const initialImagesToShow = 6;
const loadMoreIncrement = 6;

function displayGalleryImages(images) {
    allGalleryImages = images.map((item) => ({
        ...item,
        resolvedUrl: resolveMediaUrl(item.url)
    }));
    const galleryGrid = document.getElementById('galleryImagesGrid');
    const loadMoreContainer = document.getElementById('galleryLoadMoreContainer');
    const loadMoreBtn = document.getElementById('galleryLoadMoreBtn');
    
    if (!galleryGrid) return;
    
    // Show initial images
    showMoreImages(true);
    
    // Setup load more button
    if (loadMoreBtn && loadMoreContainer) {
        loadMoreBtn.addEventListener('click', () => showMoreImages(false));
    }
}

function showMoreImages(isInitial = false) {
    const galleryGrid = document.getElementById('galleryImagesGrid');
    const loadMoreContainer = document.getElementById('galleryLoadMoreContainer');
    
    if (!galleryGrid) return;
    
    const startIndex = isInitial ? 0 : displayedImagesCount;
    const endIndex = Math.min(startIndex + (isInitial ? initialImagesToShow : loadMoreIncrement), allGalleryImages.length);
    
    // Add images to the grid
    for (let i = startIndex; i < endIndex; i++) {
        const item = allGalleryImages[i];
        const fileExtension = item.resolvedUrl.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension);
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-image-item';
        galleryItem.setAttribute('data-aos', 'fade-up');
        galleryItem.setAttribute('data-aos-delay', (i % 6) * 100);
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'gallery-image-container';
        
        if (isVideo) {
            const video = document.createElement('video');
            video.src = item.resolvedUrl;
            video.alt = item.title;
            imageContainer.appendChild(video);
            
            const videoIcon = document.createElement('div');
            videoIcon.className = 'gallery-video-badge';
            videoIcon.innerHTML = '<i class="fas fa-play"></i>';
            imageContainer.appendChild(videoIcon);
        } else {
            const img = document.createElement('img');
            img.src = item.resolvedUrl;
            img.alt = item.title;
            imageContainer.appendChild(img);
        }
        
        const caption = document.createElement('div');
        caption.className = 'gallery-image-caption';
        caption.textContent = item.title;
        
        galleryItem.appendChild(imageContainer);
        galleryItem.appendChild(caption);
        
        // Click to open lightbox
        galleryItem.addEventListener('click', () => {
            openImageLightbox(i);
        });
        
        galleryGrid.appendChild(galleryItem);
    }
    
    displayedImagesCount = endIndex;
    
    // Show/hide load more button
    if (loadMoreContainer) {
        if (displayedImagesCount < allGalleryImages.length) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    // Re-observe AOS elements
    if (window.AOS) {
        window.AOS.refresh();
    }
}

// Open lightbox for gallery images
function openImageLightbox(index) {
    currentImageIndex = index;
    updateImageLightbox();
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox) {
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    }
}

function updateImageLightbox() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    if (!allGalleryImages[currentImageIndex]) return;
    
    const currentMedia = allGalleryImages[currentImageIndex];
    const fileExtension = currentMedia.url.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension);
    
    if (lightboxTitle) lightboxTitle.textContent = currentMedia.title;
    
    // Hide both first
    if (lightboxImage) lightboxImage.style.display = 'none';
    if (lightboxVideo) lightboxVideo.style.display = 'none';
    
    // Pause video if playing
    if (lightboxVideo) lightboxVideo.pause();
    
    // Show appropriate media
    if (isVideo) {
        if (lightboxVideo) {
            lightboxVideo.querySelector('source').src = currentMedia.url;
            lightboxVideo.load();
            lightboxVideo.style.display = 'block';
        }
    } else {
        if (lightboxImage) {
            lightboxImage.src = currentMedia.url;
            lightboxImage.style.display = 'block';
        }
    }
    
    // Update counter
    if (lightboxCounter) {
        const currentNum = convertToPersianNumbers(currentImageIndex + 1);
        const totalNum = convertToPersianNumbers(allGalleryImages.length);
        lightboxCounter.textContent = `${currentNum} / ${totalNum}`;
    }
}

let currentGalleryCategory = null;
let currentImageIndex = 0;
let scrollPosition = 0;

const lightbox = document.getElementById('galleryLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxOverlay = document.querySelector('.lightbox-overlay');

// Gallery category panels - click to show photo grid
const galleryItems = document.querySelectorAll('.gallery-item');
const categoryGridModal = document.getElementById('categoryGrid');
const categoryGridClose = document.querySelector('.category-grid-close');
const categoryGridOverlay = document.querySelector('.category-grid-overlay');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.dataset.category;
        openCategoryGrid(category);
    });
});

// Close category grid
if (categoryGridClose) {
    categoryGridClose.addEventListener('click', closeCategoryGrid);
}

if (categoryGridOverlay) {
    categoryGridOverlay.addEventListener('click', closeCategoryGrid);
}

function openCategoryGrid(category) {
    const data = galleryData[category];
    if (!data) return;
    
    // Set title
    document.getElementById('categoryGridTitle').textContent = data.title;
    
    // Load photos
    const photosGrid = document.getElementById('categoryPhotosGrid');
    photosGrid.innerHTML = '';
    
    // Check if category has images
    if (!data.images || data.images.length === 0) {
        photosGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #666; font-size: 16px;">هنوز تصویری در این دسته وجود ندارد</p>';
        categoryGridModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }
    
    data.images.forEach((media, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'category-photo-item';
        
        if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.src;
            photoItem.appendChild(video);
            
            const videoIcon = document.createElement('div');
            videoIcon.className = 'category-video-icon';
            videoIcon.innerHTML = '<i class="fas fa-play"></i>';
            photoItem.appendChild(videoIcon);
        } else {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = data.title;
            photoItem.appendChild(img);
        }
        
        // Click photo to open lightbox
        photoItem.addEventListener('click', () => {
            closeCategoryGrid();
            setTimeout(() => {
                openLightbox(category, index);
            }, 300);
        });
        
        photosGrid.appendChild(photoItem);
    });
    
    // Show modal
    categoryGridModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCategoryGrid() {
    categoryGridModal.classList.remove('active');
    document.body.style.overflow = '';
}

function openLightbox(category, startIndex = 0) {
    // Store current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    currentGalleryCategory = category;
    currentImageIndex = startIndex;
    updateLightboxImage();
    generateThumbnails();
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
}

function generateThumbnails() {
    if (!currentGalleryCategory) return;
    
    const data = galleryData[currentGalleryCategory];
    const thumbnailsContainer = document.getElementById('lightboxThumbnails');
    
    // Clear existing thumbnails
    thumbnailsContainer.innerHTML = '';
    
    // Create thumbnails for each media item
    data.images.forEach((media, index) => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'lightbox-thumbnail';
        if (index === currentImageIndex) {
            thumbnailDiv.classList.add('active');
        }
        
        if (media.type === 'video') {
            // For video, show play icon overlay
            const video = document.createElement('video');
            video.src = media.src;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            
            const playIcon = document.createElement('div');
            playIcon.innerHTML = '<i class="fas fa-play"></i>';
            playIcon.style.position = 'absolute';
            playIcon.style.top = '50%';
            playIcon.style.left = '50%';
            playIcon.style.transform = 'translate(-50%, -50%)';
            playIcon.style.color = 'white';
            playIcon.style.fontSize = '24px';
            playIcon.style.textShadow = '0 2px 8px rgba(0,0,0,0.8)';
            playIcon.style.pointerEvents = 'none';
            
            thumbnailDiv.style.position = 'relative';
            thumbnailDiv.appendChild(video);
            thumbnailDiv.appendChild(playIcon);
        } else {
            // For image
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = media.src;
            thumbnailImg.alt = `${data.title} - تصویر ${index + 1}`;
            thumbnailDiv.appendChild(thumbnailImg);
        }
        
        // Add click event to thumbnail
        thumbnailDiv.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightboxImage();
            updateThumbnailsActive();
        });
        
        thumbnailsContainer.appendChild(thumbnailDiv);
    });
}

function updateThumbnailsActive() {
    const thumbnails = document.querySelectorAll('.lightbox-thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function updateLightboxImage() {
    if (!currentGalleryCategory) return;
    
    const data = galleryData[currentGalleryCategory];
    const currentMedia = data.images[currentImageIndex];
    
    lightboxTitle.textContent = data.title;
    
    // Hide both image and video first
    lightboxImage.style.display = 'none';
    lightboxVideo.style.display = 'none';
    
    // Pause video if it was playing
    if (lightboxVideo) {
        lightboxVideo.pause();
    }
    
    // Show appropriate media type
    if (currentMedia.type === 'video') {
        lightboxVideo.querySelector('source').src = currentMedia.src;
        lightboxVideo.load();
        lightboxVideo.style.display = 'block';
    } else {
        lightboxImage.src = currentMedia.src;
        lightboxImage.style.display = 'block';
    }
    
    // Convert to Persian/Dari numbers
    const currentNum = convertToPersianNumbers(currentImageIndex + 1);
    const totalNum = convertToPersianNumbers(data.images.length);
    lightboxCounter.textContent = `${currentNum} / ${totalNum}`;
    
    updateThumbnailsActive();
}

function convertToPersianNumbers(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().split('').map(digit => persianDigits[parseInt(digit)]).join('');
}

function nextImage() {
    // Check if we're using the new gallery or category gallery
    if (allGalleryImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % allGalleryImages.length;
        updateImageLightbox();
    } else if (currentGalleryCategory) {
        const data = galleryData[currentGalleryCategory];
        currentImageIndex = (currentImageIndex + 1) % data.images.length;
        updateLightboxImage();
    }
}

function prevImage() {
    // Check if we're using the new gallery or category gallery
    if (allGalleryImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
        updateImageLightbox();
    } else if (currentGalleryCategory) {
        const data = galleryData[currentGalleryCategory];
        currentImageIndex = (currentImageIndex - 1 + data.images.length) % data.images.length;
        updateLightboxImage();
    }
}

// Event listeners for lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', nextImage);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', prevImage);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        nextImage(); // In RTL, left arrow goes to next
    } else if (e.key === 'ArrowRight') {
        prevImage(); // In RTL, right arrow goes to previous
    }
});

// ===== SCROLL TO TOP BUTTON (Optional) =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-to-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 999;
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1) translateY(-5px)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1) translateY(0)';
});

// ===== GALLERY SCROLL-BASED NAME DISPLAY =====
function checkGalleryItemsInView() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.45; // 45% from top of viewport
    
    galleryItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + (rect.height / 2);
        
        // Check if item center is near the trigger point (45% of viewport)
        const isInTriggerZone = itemCenter >= triggerPoint - 100 && itemCenter <= triggerPoint + 100;
        
        if (isInTriggerZone) {
            item.classList.add('show-name');
        } else {
            item.classList.remove('show-name');
        }
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(activateNavLink, 10));
window.addEventListener('scroll', debounce(showHeaderOnScroll, 10));
window.addEventListener('scroll', debounce(checkGalleryItemsInView, 10));
window.addEventListener('load', checkGalleryItemsInView);
window.addEventListener('resize', debounce(checkGalleryItemsInView, 10));

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%cDERMASAN International Organization', 'color: #2d7a3e; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to our website! 🌿', 'color: #4caf50; font-size: 16px;');
console.log('%cBuilt with passion and modern web technologies', 'color: #666; font-size: 12px;');
