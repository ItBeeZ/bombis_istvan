let currentLanguage = 'hu';

function toggleLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function toggleLanguageMenuMobile() {
    const menu = document.getElementById('language-menu-mobile');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not found in translations`);
        return;
    }
    
    currentLanguage = lang;
    updateLanguageUI();
    translatePage();
    
    if (window.innerWidth >= 640) {
        toggleLanguageMenu();
    } else {
        toggleLanguageMenuMobile();
    }
    
    localStorage.setItem('preferredLanguage', lang);
}

function updateLanguageUI() {
    let flagSvg = document.getElementById('current-flag-svg');
    const langText = document.getElementById('current-lang');
    let flagSvgMobile = document.getElementById('current-flag-svg-mobile');
    const langTextMobile = document.getElementById('current-lang-mobile');
    
    if (!flagSvg) {
        const btn = document.querySelector('.language-selector button');
        if (btn) {
            flagSvg = document.createElement('span');
            flagSvg.id = 'current-flag-svg';
            flagSvg.className = 'w-6 h-4';
            btn.insertBefore(flagSvg, btn.firstChild);
        }
    }
    
    if (!flagSvgMobile) {
        const btnMobile = document.querySelector('.language-selector-mobile button');
        if (btnMobile) {
            flagSvgMobile = document.createElement('span');
            flagSvgMobile.id = 'current-flag-svg-mobile';
            flagSvgMobile.className = 'w-6 h-4';
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
        case 'hu':
            return '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.67" y="0" fill="#cd2a3e"/><rect width="3" height="0.67" y="1.33" fill="#436f4d"/></svg>';
        case 'en':
            return '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"/></g></svg>';
        case 'de':
            return '<svg viewBox="0 0 5 3" width="24" height="16"><rect width="5" height="1" y="0" fill="#000"/><rect width="5" height="1" y="1" fill="#dd0000"/><rect width="5" height="1" y="2" fill="#ffce00"/></svg>';
        default:
            return '';
    }
}

function translatePage() {
    if (!translations[currentLanguage]) {
        console.error(`Translations not found for language: ${currentLanguage}`);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        try {
            const key = element.getAttribute('data-i18n');
            if (!key) return;

            const keys = key.split('.');
            let translation = translations[currentLanguage];
            
            for (const k of keys) {
                if (!translation || !translation[k]) {
                    console.warn(`Translation key not found: ${key}`);
                    return;
                }
                translation = translation[k];
            }

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                const textSpan = element.querySelector('span:not(.w-5):not(.w-6):not(.w-8):not(.w-10)');
                if (textSpan) {
                    textSpan.textContent = translation;
                } else {
                    element.innerHTML = translation;
                }
            } else {
                element.innerHTML = translation;
            }
        } catch (error) {
            console.error(`Error translating element: ${error.message}`);
        }
    });
}

let scrollbar;
if (window.Scrollbar && window.innerWidth > 640) {
    scrollbar = Scrollbar.init(document.querySelector('#scroll-container'), {
        damping: 0.08,
        alwaysShowTracks: true,
        delegateTo: document,
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const rect = targetElement.getBoundingClientRect();
                const scrollTop = rect.top + scrollbar.scrollTop;
                scrollbar.scrollTo(0, scrollTop, 1200);
            }
        });
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth <= 640 && window.Scrollbar && scrollbar) {
        scrollbar.destroy();
        scrollbar = null;
    }
});

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.querySelector('.hamburger-icon');
    const overlay = document.querySelector('.menu-overlay');
    
    if (menu && hamburger) {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'menu-overlay';
            document.body.appendChild(newOverlay);
            newOverlay.classList.toggle('active');
        } else {
            overlay.classList.toggle('active');
        }
    }
}

// Javított eseménykezelés a menü bezárásához
document.addEventListener('click', (event) => {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.querySelector('.hamburger-icon');
    const overlay = document.querySelector('.menu-overlay');
    const languageSelectorMobile = document.querySelector('.language-selector-mobile');
    const languageMenuMobile = document.getElementById('language-menu-mobile');
    
    // Ellenőrizzük, hogy a kattintás a menü elemein belül történt-e
    const isClickInsideMenu = menu && (menu.contains(event.target) || event.target.closest('#mobile-menu'));
    const isClickOnHamburger = hamburger && hamburger.contains(event.target);
    const isClickInsideLanguageMenu = languageMenuMobile && languageMenuMobile.contains(event.target);
    const isClickOnLanguageSelector = languageSelectorMobile && languageSelectorMobile.contains(event.target);
    
    if (menu && hamburger && overlay && window.innerWidth < 640 && menu.classList.contains('active')) {
        if (!isClickInsideMenu && !isClickOnHamburger && !isClickInsideLanguageMenu && !isClickOnLanguageSelector) {
            menu.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            if (languageMenuMobile) {
                languageMenuMobile.classList.add('hidden');
            }
        }
    }
});

// Javított menü link kezelés
document.querySelectorAll('#mobile-menu a:not(.language-selector-mobile a)').forEach(link => {
    link.addEventListener('click', function(e) {
        e.stopImmediatePropagation();
        
        const menu = document.getElementById('mobile-menu');
        const hamburger = document.querySelector('.hamburger-icon');
        const overlay = document.querySelector('.menu-overlay');
        
        if (menu && hamburger && overlay) {
            menu.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
        }

        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            if (window.Scrollbar && window.innerWidth > 640 && typeof scrollbar !== 'undefined' && scrollbar) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const scrollTop = rect.top + scrollbar.scrollTop;
                    scrollbar.scrollTo(0, scrollTop, 1200);
                }
            } else {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
});

document.querySelectorAll('#language-menu-mobile button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('click', (event) => {
    const languageSelector = document.querySelector('.language-selector');
    const languageMenu = document.getElementById('language-menu');
    const languageSelectorMobile = document.querySelector('.language-selector-mobile');
    const languageMenuMobile = document.getElementById('language-menu-mobile');
    
    if (window.innerWidth >= 640) {
        if (languageSelector && languageMenu && !languageSelector.contains(event.target) && !languageMenu.contains(event.target)) {
            languageMenu.classList.add('hidden');
        }
    } else {
        if (languageSelectorMobile && languageMenuMobile && !languageSelectorMobile.contains(event.target) && !languageMenuMobile.contains(event.target)) {
            languageMenuMobile.classList.add('hidden');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    updateLanguageUI();
    translatePage();

    // Képkörhinta mobil interakció
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselTrack = document.querySelector('.carousel-track');
    let isPaused = false;

    carouselItems.forEach((item, index) => {
        if (window.innerWidth <= 640) {
            item.addEventListener('click', () => {
                if (!isPaused) {
                    carouselTrack.style.animationPlayState = 'paused';
                    item.querySelector('img').style.filter = 'blur(4px)';
                    item.querySelector('.overlay').style.opacity = '1';
                    isPaused = true;
                } else {
                    carouselTrack.style.animationPlayState = 'running';
                    item.querySelector('img').style.filter = '';
                    item.querySelector('.overlay').style.opacity = '0';
                    isPaused = false;
                }
            });
        }
    });
    // HAMBURGER MENÜ ESEMÉNYKEZELŐ
    const hamburger = document.querySelector('.hamburger-icon');
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
});
(function() {
    const animatedEls = document.querySelectorAll('.fade-in, .fade-in-up');
    if (animatedEls.length === 0) return;
    const observer = new window.IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedEls.forEach(el => observer.observe(el));
})();

// Copyright év automatikus frissítése
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright-year');
    copyrightElements.forEach((element) => {
        element.textContent = currentYear;
    });
}

// Oldal betöltésekor frissítjük az évet
document.addEventListener('DOMContentLoaded', function() {
    // Kis késleltetés a DOM teljes betöltődéséhez
    setTimeout(updateCopyrightYear, 100);
});

// Ha az oldal már betöltött, késleltetéssel frissítjük
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateCopyrightYear, 100);
    });
} else {
    setTimeout(updateCopyrightYear, 100);
}

// Biztonsági frissítés az oldal teljes betöltése után
window.addEventListener('load', function() {
    setTimeout(updateCopyrightYear, 200);
});

// Testimonials Carousel funkcionalitás
class TestimonialsCarousel {
    constructor() {
        this.track = document.querySelector('.testimonials-track');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.testimonials-dot');
        
        if (!this.track || !this.slides.length) return;
        
        this.currentSlide = 0;
        this.requestedSlide = 0; // Track which slide was actually requested
        this.slidesPerView = this.getSlidesPerView();
        this.maxSlides = Math.max(0, this.slides.length - this.slidesPerView);
        this.totalSlides = this.slides.length;
        this.isMobile = window.innerWidth < 1024; // Track if we're in mobile view
        
        // Touch/swipe variables
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.threshold = 50; // minimum distance for swipe
        
        this.init();
    }
    
    getSlidesPerView() {
        if (window.innerWidth >= 1024) return 3; // lg: 3 slides
        if (window.innerWidth >= 768) return 2;  // md: 2 slides
        return 1; // mobile: 1 slide
    }
    
    getVisibleSlides() {
        // On mobile (< 1024px), show only first 6 slides
        // On desktop (>= 1024px), show all 8 slides
        if (window.innerWidth < 1024) {
            return Array.from(this.slides).slice(0, 6);
        } else {
            return Array.from(this.slides);
        }
    }
    
    getVisibleDots() {
        // On mobile (< 1024px), show only first 6 dots
        // On desktop (>= 1024px), show only first 6 dots (hide last 2)
        return Array.from(this.dots).slice(0, 6);
    }
    
    init() {
        this.updateCarousel();
        this.bindEvents();
        
        // Auto-play carousel
        this.startAutoPlay();
    }
    
    bindEvents() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause auto-play on hover
        if (this.track) {
            this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.track.addEventListener('mouseleave', () => this.startAutoPlay());
            
            // Touch events for mobile swipe
            this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
            
            // Mouse events for desktop drag (optional)
            this.track.addEventListener('mousedown', (e) => this.handleMouseStart(e));
            this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.track.addEventListener('mouseup', (e) => this.handleMouseEnd(e));
            this.track.addEventListener('mouseleave', (e) => this.handleMouseEnd(e));
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slidesPerView = this.getSlidesPerView();
            this.isMobile = window.innerWidth < 1024;
            
            const visibleSlides = this.getVisibleSlides();
            this.maxSlides = Math.max(0, visibleSlides.length - this.slidesPerView);
            
            // Adjust current slide if it's out of bounds after resize
            if (this.currentSlide > this.maxSlides) {
                this.currentSlide = this.maxSlides;
            }
            
            // Reset requested slide if it's no longer visible (only for dots, not slides)
            if (this.requestedSlide !== undefined && this.requestedSlide >= 6) {
                this.requestedSlide = 0;
                this.currentSlide = 0;
            }
            
            // Try to maintain the requested slide if possible
            if (this.requestedSlide !== undefined && this.requestedSlide < visibleSlides.length) {
                this.goToSlide(this.requestedSlide);
            } else {
                this.updateCarousel();
            }
        });
    }
    
    // Touch event handlers
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.stopAutoPlay();
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.touches[0].clientX;
        const diffX = this.startX - this.currentX;
        
        // Prevent default scrolling on horizontal swipe
        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        const diffX = this.startX - this.currentX;
        
        if (Math.abs(diffX) > this.threshold) {
            const visibleSlides = this.getVisibleSlides();
            const maxSlides = Math.max(0, visibleSlides.length - this.slidesPerView);
            
            if (diffX > 0 && this.currentSlide < maxSlides) {
                // Swipe left - next slide
                this.currentSlide++;
                this.requestedSlide = this.currentSlide;
            } else if (diffX < 0 && this.currentSlide > 0) {
                // Swipe right - previous slide
                this.currentSlide--;
                this.requestedSlide = this.currentSlide;
            }
            this.updateCarousel();
        }
        
        this.isDragging = false;
        this.startAutoPlay();
    }
    
    // Mouse event handlers (for desktop drag)
    handleMouseStart(e) {
        if (window.innerWidth > 768) return; // Only enable on mobile/tablet
        
        this.startX = e.clientX;
        this.isDragging = true;
        this.stopAutoPlay();
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging || window.innerWidth > 768) return;
        
        this.currentX = e.clientX;
        e.preventDefault();
    }
    
    handleMouseEnd(e) {
        if (!this.isDragging || window.innerWidth > 768) return;
        
        const diffX = this.startX - this.currentX;
        
        if (Math.abs(diffX) > this.threshold) {
            const visibleSlides = this.getVisibleSlides();
            const maxSlides = Math.max(0, visibleSlides.length - this.slidesPerView);
            
            if (diffX > 0 && this.currentSlide < maxSlides) {
                // Drag left - next slide
                this.currentSlide++;
                this.requestedSlide = this.currentSlide;
            } else if (diffX < 0 && this.currentSlide > 0) {
                // Drag right - previous slide
                this.currentSlide--;
                this.requestedSlide = this.currentSlide;
            }
            this.updateCarousel();
        }
        
        this.isDragging = false;
        this.startAutoPlay();
    }
    
    updateCarousel() {
        const visibleSlides = this.getVisibleSlides();
        const visibleDots = this.getVisibleDots();
        
        // Hide/show slides based on screen size
        this.slides.forEach((slide, index) => {
            if (window.innerWidth < 1024 && index >= 6) {
                slide.style.display = 'none';
            } else {
                slide.style.display = 'block';
            }
        });
        
        // Hide/show dots based on screen size
        this.dots.forEach((dot, index) => {
            if (index >= 6) {
                dot.style.display = 'none';
            } else {
                dot.style.display = 'block';
            }
        });
        
        // Recalculate maxSlides based on visible slides
        const maxSlides = Math.max(0, visibleSlides.length - this.slidesPerView);
        
        // Ensure currentSlide is within bounds
        if (this.currentSlide > maxSlides) {
            this.currentSlide = maxSlides;
        }
        
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentSlide * slideWidth);
        
        if (this.track) {
            this.track.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update dots - first remove all active states, then set the requested one
        visibleDots.forEach((dot, index) => {
            dot.classList.remove('bg-blue-600', 'active');
            dot.classList.add('bg-gray-600');
        });
        
        // Set the requested dot as active (not necessarily the currentSlide)
        const activeDotIndex = this.requestedSlide !== undefined ? this.requestedSlide : this.currentSlide;
        if (activeDotIndex < visibleDots.length && visibleDots[activeDotIndex]) {
            visibleDots[activeDotIndex].classList.remove('bg-gray-600');
            visibleDots[activeDotIndex].classList.add('bg-blue-600', 'active');
        }
    }
    

    
    goToSlide(slideIndex) {
        const visibleSlides = this.getVisibleSlides();
        const maxSlides = Math.max(0, visibleSlides.length - this.slidesPerView);
        
        // Only allow navigation to first 6 dots (even though we have 8 slides)
        if (slideIndex >= 6) {
            return;
        }
        
        this.requestedSlide = slideIndex;
        
        // Calculate the actual slide position based on slides per view
        if (slideIndex <= maxSlides) {
            this.currentSlide = slideIndex;
        } else {
            // For the last few slides, position so they're visible
            this.currentSlide = Math.max(0, visibleSlides.length - this.slidesPerView);
        }
        
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            const visibleSlides = this.getVisibleSlides();
            const maxSlides = Math.max(0, visibleSlides.length - this.slidesPerView);
            
            this.currentSlide = this.currentSlide < maxSlides ? this.currentSlide + 1 : 0;
            this.requestedSlide = this.currentSlide;
            this.updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize testimonials carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
});
