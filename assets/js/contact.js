// Contact Page JavaScript Functions

// Initialize contact page when DOM is loaded// Globális változók
let currentLanguage = "hu";

// Nyelvi funkciók
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not found in translations`);
        return;
    }
    currentLanguage = lang;
    updateLanguageUI();
    translatePage();
    const languageMenu = document.querySelector("#language-menu");
    const languageMenuMobile = document.querySelector("#language-menu-mobile");
    if (languageMenu) {
        languageMenu.classList.remove("active");
        languageMenu.classList.add("hidden");
    }
    if (languageMenuMobile) {
        languageMenuMobile.classList.remove("active");
        languageMenuMobile.classList.add("hidden");
    }
    localStorage.setItem("preferredLanguage", lang);
}

function updateLanguageUI() {
    let flagSvg = document.getElementById("current-flag-svg");
    const langText = document.getElementById("current-lang");
    let flagSvgMobile = document.getElementById("current-flag-svg-mobile");
    const langTextMobile = document.getElementById("current-lang-mobile");
    if (!flagSvg) {
        const btn = document.querySelector(".language-selector button");
        if (btn) {
            flagSvg = document.createElement("span");
            flagSvg.id = "current-flag-svg";
            flagSvg.className = "w-6 h-4";
            btn.insertBefore(flagSvg, btn.firstChild);
        }
    }
    if (!flagSvgMobile) {
        const btnMobile = document.querySelector(".language-selector-mobile button");
        if (btnMobile) {
            flagSvgMobile = document.createElement("span");
            flagSvgMobile.id = "current-flag-svg-mobile";
            flagSvgMobile.className = "w-6 h-4";
            btnMobile.insertBefore(flagSvgMobile, btnMobile.firstChild);
        }
    }
    const flagSvgContent = getFlagSvgContent(currentLanguage);
    if (flagSvg) {
        flagSvg.innerHTML = flagSvgContent;
    }
    if (flagSvgMobile) {
        flagSvgMobile.innerHTML = flagSvgContent;
    }
    if (langText) {
        langText.textContent = currentLanguage.toUpperCase();
    }
    if (langTextMobile) {
        langTextMobile.textContent = currentLanguage.toUpperCase();
    }
    document.documentElement.lang = currentLanguage;
    translatePage();
}

function getFlagSvgContent(lang) {
    switch (lang) {
        case "hu":
            return '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.67" y="0" fill="#cd2a3e"/><rect width="3" height="0.67" y="1.33" fill="#436f4d"/></svg>';
        case "en":
            return '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"/></g></svg>';
        case "de":
            return '<svg viewBox="0 0 5 3" width="24" height="16"><rect width="5" height="1" y="0" fill="#000"/><rect width="5" height="1" y="1" fill="#dd0000"/><rect width="5" height="1" y="2" fill="#ffce00"/></svg>';
        default:
            return "";
    }
}

function translatePage() {
    if (!translations[currentLanguage]) {
        console.error(`Translations not found for language: ${currentLanguage}`);
        return;
    }
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        try {
            const key = element.getAttribute("data-i18n");
            if (!key) return;
            const keys = key.split(".");
            let translation = translations[currentLanguage];
            for (const k of keys) {
                if (!translation || !translation[k]) {
                    console.warn(`Translation key not found: ${key}`);
                    return;
                }
                translation = translation[k];
            }
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.placeholder = translation;
            } else if (element.tagName === "A" || element.tagName === "BUTTON") {
                const textSpan = element.querySelector("span:not(.w-5):not(.w-6):not(.w-8):not(.w-10)");
                if (textSpan) {
                    textSpan.textContent = translation;
                } else {
                    element.innerHTML = translation;
                }
            } else {
                if (key === "footer.copyright") {
                    const copyrightYearSpan = element.querySelector(".copyright-year");
                    const currentYear = copyrightYearSpan ? copyrightYearSpan.textContent : new Date().getFullYear();
                    element.innerHTML = translation;
                    const newCopyrightYearSpan = element.querySelector(".copyright-year");
                    if (newCopyrightYearSpan) {
                        newCopyrightYearSpan.textContent = currentYear;
                    }
                } else {
                    element.innerHTML = translation;
                }
            }
        } catch (error) {
            console.error(`Error translating element: ${error.message}`);
        }
    });
    updateCopyrightYear();
}

function toggleLanguageMenu() {
    const menu = document.querySelector("#language-menu");
    if (menu) {
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
            menu.classList.add("hidden");
        } else {
            menu.classList.remove("hidden");
            menu.classList.add("active");
        }
    }
}

function toggleLanguageMenuMobile() {
    const menu = document.querySelector("#language-menu-mobile");
    if (menu) {
        if (menu.classList.contains("active")) {
            menu.classList.remove("active");
            menu.classList.add("hidden");
        } else {
            menu.classList.remove("hidden");
            menu.classList.add("active");
        }
    }
}

function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll(".copyright-year");
    const currentYear = new Date().getFullYear();
    copyrightElements.forEach(element => {
        element.textContent = currentYear;
    });
}

function initSmoothScrollbar() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        window.lenis = lenis;
    } else {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
}

function initServicesSelector() {
    const servicesButton = document.querySelector('.services-selector button');
    const servicesMenu = document.getElementById('services-menu');
    const servicesButtonMobile = document.querySelector('.services-selector-mobile button');
    const servicesMenuMobile = document.getElementById('services-menu-mobile');
    
    if (servicesButton && servicesMenu) {
        servicesButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (servicesMenu.classList.contains('active')) {
                servicesMenu.classList.remove('active');
                servicesMenu.classList.add('hidden');
            } else {
                servicesMenu.classList.remove('hidden');
                servicesMenu.classList.add('active');
            }
        });
    }
    
    if (servicesButtonMobile && servicesMenuMobile) {
        servicesButtonMobile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (servicesMenuMobile.classList.contains('active')) {
                servicesMenuMobile.classList.remove('active');
                servicesMenuMobile.classList.add('hidden');
            } else {
                servicesMenuMobile.classList.remove('hidden');
                servicesMenuMobile.classList.add('active');
            }
        });
    }
    
    document.addEventListener('click', function(e) {
        if (servicesMenu && !servicesButton.contains(e.target) && !servicesMenu.contains(e.target)) {
            servicesMenu.classList.remove('active');
            servicesMenu.classList.add('hidden');
        }
        if (servicesMenuMobile && !servicesButtonMobile.contains(e.target) && !servicesMenuMobile.contains(e.target)) {
            servicesMenuMobile.classList.remove('active');
            servicesMenuMobile.classList.add('hidden');
        }
    });
}

// Inicializálás
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Main initialization function
function initializeContactPage() {
    document.body.style.opacity = "1";
    
    const languageMenu = document.querySelector("#language-menu");
    const languageMenuMobile = document.querySelector("#language-menu-mobile");
    
    if (languageMenu) {
        languageMenu.classList.remove("active");
        languageMenu.classList.add("hidden");
    }
    if (languageMenuMobile) {
        languageMenuMobile.classList.remove("active");
        languageMenuMobile.classList.add("hidden");
    }
    
    // Initialize all necessary functions
    initSmoothScrollbar();
    initServicesSelector();
    initializeLanguageSelector();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialsCarousel();
    updateCopyrightYear();
    
    // Contact page specific initializations
    initializeAnimations();
    initializeContactForm();
    initializeServicesMenu();
    initializeScrollEffects();
    initializeMapInteractions();
    initializeSocialLinks();
    
    // Initialize language functionality
    const savedLanguage = localStorage.getItem("preferredLanguage") || "hu";
    changeLanguage(savedLanguage);
    
    // Add smooth scroll behavior to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add event listeners for language options
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    document.querySelectorAll('.language-option-mobile').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Close language menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            const menu = document.querySelector('#language-menu');
            if (menu) {
                menu.classList.add('hidden');
                menu.classList.remove('active');
            }
        }
        if (!e.target.closest('.language-selector-mobile')) {
            const menuMobile = document.querySelector('#language-menu-mobile');
            if (menuMobile) {
                menuMobile.classList.add('hidden');
                menuMobile.classList.remove('active');
            }
        }
    });
    
    console.log('Contact page initialized with full functionality');
}

// Animation initialization
function initializeAnimations() {
    // Fade in animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-contact');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in-up, .contact-card, .contact-form');
    animatedElements.forEach(el => observer.observe(el));

    // Staggered animation for contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in-contact');
        }, index * 200);
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.submit-btn, button[type="submit"]');
    
    if (!form) return;

    // Form validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
        nameInput.addEventListener('input', () => clearValidation(nameInput));
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
        emailInput.addEventListener('input', () => clearValidation(emailInput));
    }

    if (messageInput) {
        messageInput.addEventListener('blur', () => validateField(messageInput, 'message'));
        messageInput.addEventListener('input', () => clearValidation(messageInput));
    }

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

// Field validation
function validateField(field, type) {
    const value = field.value.trim();
    const fieldContainer = field.closest('.form-field') || field.parentElement;
    
    // Remove existing validation classes
    fieldContainer.classList.remove('error', 'success');
    
    // Remove existing messages
    const existingMessage = fieldContainer.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    let isValid = true;
    let message = '';

    switch (type) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                message = 'A név legalább 2 karakter hosszú legyen.';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Kérjük, adjon meg egy érvényes e-mail címet.';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                message = 'Az üzenet legalább 10 karakter hosszú legyen.';
            }
            break;
    }

    // Apply validation state
    if (isValid && value.length > 0) {
        fieldContainer.classList.add('success');
    } else if (!isValid) {
        fieldContainer.classList.add('error');
        const messageElement = document.createElement('div');
        messageElement.className = 'error-message';
        messageElement.textContent = message;
        fieldContainer.appendChild(messageElement);
    }

    return isValid;
}

// Clear validation state
function clearValidation(field) {
    const fieldContainer = field.closest('.form-field') || field.parentElement;
    fieldContainer.classList.remove('error', 'success');
    
    const message = fieldContainer.querySelector('.error-message, .success-message');
    if (message) {
        message.remove();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Validate all fields
    let isFormValid = true;
    if (nameInput) isFormValid &= validateField(nameInput, 'name');
    if (emailInput) isFormValid &= validateField(emailInput, 'email');
    if (messageInput) isFormValid &= validateField(messageInput, 'message');

    if (!isFormValid) {
        showNotification('Kérjük, javítsa ki a hibákat az űrlapban.', 'error');
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
        
        // Reset form
        form.reset();
        
        // Clear validation states
        const fieldContainers = form.querySelectorAll('.form-field, .space-y-4 > div');
        fieldContainers.forEach(container => {
            container.classList.remove('error', 'success');
            const message = container.querySelector('.error-message, .success-message');
            if (message) message.remove();
        });
        
        showNotification('Üzenetét sikeresen elküldtük! Hamarosan válaszolunk.', 'success');
    }, 2000);
}

// Language selector functions from about.js
// Language functions are provided by script.min.js

// Language selector functionality is handled by script.min.js
function initializeLanguageSelector() {
    // Language functionality is provided by script.min.js
}

// Services menu functionality
function initializeServicesMenu() {
    // Desktop services menu
    const servicesBtn = document.querySelector('.services-selector button');
    const servicesMenu = document.getElementById('services-menu');
    
    if (servicesBtn && servicesMenu) {
        servicesBtn.addEventListener('click', () => {
            servicesMenu.classList.toggle('hidden');
        });
    }

    // Mobile services menu
    const mobileServicesBtn = document.querySelector('.services-selector-mobile-btn');
    const mobileServicesMenu = document.getElementById('services-menu-mobile');
    
    if (mobileServicesBtn && mobileServicesMenu) {
        mobileServicesBtn.addEventListener('click', () => {
            mobileServicesMenu.classList.toggle('hidden');
        });
    }

    // Close services menus when clicking outside
    document.addEventListener('click', (e) => {
        if (servicesMenu && !e.target.closest('.services-selector')) {
            servicesMenu.classList.add('hidden');
        }
        if (mobileServicesMenu && !e.target.closest('.services-selector-mobile')) {
            mobileServicesMenu.classList.add('hidden');
        }
    });
}

function initMobileMenu() {
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    const menuOverlay = document.querySelector(".menu-overlay");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (hamburgerIcon && mobileMenu) {
        hamburgerIcon.addEventListener("click", function (e) {
            e.stopPropagation();
            mobileMenu.classList.remove("hidden");
            mobileMenu.classList.toggle("active");
            hamburgerIcon.classList.toggle("active");
            if (menuOverlay) menuOverlay.classList.toggle("active");
        });
    }
    
    if (menuOverlay && mobileMenu && hamburgerIcon) {
        menuOverlay.addEventListener("click", function (e) {
            e.stopPropagation();
            mobileMenu.classList.remove("active");
            mobileMenu.classList.add("hidden");
            hamburgerIcon.classList.remove("active");
            menuOverlay.classList.remove("active");
        });
    }
    
    if (mobileMenu && hamburgerIcon) {
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("active");
                mobileMenu.classList.add("hidden");
                hamburgerIcon.classList.remove("active");
                if (menuOverlay) menuOverlay.classList.remove("active");
            });
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        const header = document.querySelector('header');
        
        // Header background opacity based on scroll
        if (header) {
            header.style.backgroundColor = 'rgb(0, 0, 0)';
        }
        
        // Parallax effect for contact cards
        const contactCards = document.querySelectorAll('.contact-card');
        contactCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const speed = 0.5 + (index * 0.1);
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrollY * speed * 0.1);
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Map interactions
function initializeMapInteractions() {
    const mapContainer = document.querySelector('.map-container');
    const iframe = mapContainer?.querySelector('iframe');
    
    if (mapContainer && iframe) {
        // Prevent scroll hijacking on mobile
        mapContainer.addEventListener('click', () => {
            iframe.style.pointerEvents = 'auto';
        });
        
        mapContainer.addEventListener('mouseleave', () => {
            iframe.style.pointerEvents = 'none';
        });
        
        // Initial state
        iframe.style.pointerEvents = 'none';
    }
}

// Social links functionality
function initializeSocialLinks() {
    const socialLinks = document.querySelectorAll('.contact-social-links a, footer a[href*="facebook"], footer a[href*="instagram"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
        });
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Értesítés bezárása">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Handle window resize
const handleResize = debounce(() => {
    const mobileMenu = document.getElementById("mobile-menu");
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    const menuOverlay = document.querySelector(".menu-overlay");
    
    // Close mobile menu when resizing to desktop view
    if (window.innerWidth >= 768) {
        if (mobileMenu) {
            mobileMenu.classList.remove("active");
            mobileMenu.classList.add("hidden");
        }
        if (hamburgerIcon) {
            hamburgerIcon.classList.remove("active");
        }
        if (menuOverlay) {
            menuOverlay.classList.remove("active");
        }
    }
    
    // Update map size if it exists
    if (window.map && window.map.getViewport) {
        window.map.getViewport().resize();
    }
}, 250);

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll animations
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".fade-in, .fade-in-up");
    if (fadeElements.length === 0) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                }
            });
        },
        { threshold: 0.1 }
    );
    
    fadeElements.forEach((element) => {
        observer.observe(element);
    });
}

// Testimonials carousel
function initTestimonialsCarousel() {
    const track = document.querySelector(".testimonials-track");
    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".testimonials-dot");
    
    if (!track || slides.length === 0 || dots.length === 0) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    const isDesktop = window.innerWidth >= 769;
    const visibleSlides = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const maxSlide = isDesktop ? Math.min(3, slides.length - 1) : Math.max(0, slides.length - visibleSlides);
    const activeDots = isDesktop ? Math.min(4, dots.length) : dots.length;
    
    function updateSlide(slideIndex) {
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
        let translateX;
        
        if (isDesktop) {
            const slideWidth = slides[0].offsetWidth;
            translateX = -(currentSlide * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;
        } else {
            const slideWidth = slides[0].offsetWidth;
            translateX = -(currentSlide * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;
        }
        
        dots.forEach((dot, index) => {
            if (index < activeDots && dot) {
                if (index === currentSlide) {
                    dot.classList.remove("bg-gray-600");
                    dot.classList.add("bg-blue-600", "active");
                } else {
                    dot.classList.remove("bg-blue-600", "active");
                    dot.classList.add("bg-gray-600");
                }
            }
        });
    }
    
    function nextSlide() {
        updateSlide(currentSlide + 1 > maxSlide ? 0 : currentSlide + 1);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    dots.forEach((dot, index) => {
        if (index < activeDots && dot) {
            dot.addEventListener("click", () => {
                stopAutoSlide();
                updateSlide(index);
                startAutoSlide();
            });
        }
    });
    
    const carousel = document.querySelector(".testimonials-carousel");
    if (carousel) {
        carousel.addEventListener("mouseenter", stopAutoSlide);
        carousel.addEventListener("mouseleave", startAutoSlide);
    }
    
    window.addEventListener("resize", () => {
        location.reload();
    });
    
    updateSlide(0);
    startAutoSlide();
}

// Smooth scrollbar initialization
function initSmoothScrollbar() {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }
}

// Services selector
function initServicesSelector() {
    const servicesButton = document.querySelector("#services-button");
    const servicesMenu = document.querySelector("#services-menu");
    const servicesButtonMobile = document.querySelector("#services-button-mobile");
    const servicesMenuMobile = document.querySelector("#services-menu-mobile");
    
    // Desktop services menu
    if (servicesButton && servicesMenu) {
        servicesButton.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = servicesMenu.classList.contains("hidden");
            
            if (isHidden) {
                servicesMenu.classList.remove("hidden");
                servicesMenu.classList.add("active");
            } else {
                servicesMenu.classList.add("closing");
                setTimeout(() => {
                    servicesMenu.classList.remove("active", "closing");
                    servicesMenu.classList.add("hidden");
                }, 300);
            }
        });
        
        document.addEventListener("click", function (e) {
            if (!servicesButton.contains(e.target) && !servicesMenu.contains(e.target)) {
                if (!servicesMenu.classList.contains("hidden")) {
                    servicesMenu.classList.add("closing");
                    setTimeout(() => {
                        servicesMenu.classList.remove("active", "closing");
                        servicesMenu.classList.add("hidden");
                    }, 300);
                }
            }
        });
    }
    
    // Mobile services menu
    if (servicesButtonMobile && servicesMenuMobile) {
        servicesButtonMobile.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = servicesMenuMobile.classList.contains("hidden");
            
            if (isHidden) {
                servicesMenuMobile.classList.remove("hidden");
                servicesMenuMobile.classList.add("active");
            } else {
                servicesMenuMobile.classList.add("closing");
                setTimeout(() => {
                    servicesMenuMobile.classList.remove("active", "closing");
                    servicesMenuMobile.classList.add("hidden");
                }, 300);
            }
        });
    }
}

// Update copyright year
function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll('.copyright-year');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach(element => {
        element.textContent = currentYear;
    });
}

window.addEventListener('resize', handleResize);