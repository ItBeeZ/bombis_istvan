let currentLanguage = 'hu';

function toggleLanguageMenu() {
    const menu = document.querySelector('#language-menu');
    if (menu) {
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            menu.classList.add('hidden');
        } else {
            menu.classList.remove('hidden');
            menu.classList.add('active');
        }
    }
}

function toggleLanguageMenuMobile() {
    const menu = document.querySelector('#language-menu-mobile');
    if (menu) {
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            menu.classList.add('hidden');
        } else {
            menu.classList.remove('hidden');
            menu.classList.add('active');
        }
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
    // Elrejtjük a nyelvi menüt a nyelv kiválasztása után
    const languageMenu = document.querySelector('#language-menu');
    const languageMenuMobile = document.querySelector('#language-menu-mobile');
    if (languageMenu) {
        languageMenu.classList.remove('active');
        languageMenu.classList.add('hidden');
    }
    if (languageMenuMobile) {
        languageMenuMobile.classList.remove('active');
        languageMenuMobile.classList.add('hidden');
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

// Smooth scrollbar initialization with fallback
function initSmoothScrollbar() {
    // Only proceed if Scrollbar is available
    if (typeof Scrollbar === 'undefined') {
        return;
    }

    // Try to find scroll container element
    const scrollContainer = document.querySelector('#scroll-container');
    
    // If container exists, initialize smooth scrollbar
    if (scrollContainer) {
        try {
            const scrollbar = Scrollbar.init(scrollContainer, {
                damping: 0.1,
                delegateTo: document
            });

            // Add smooth scrolling for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            if (anchorLinks.length > 0) {
                anchorLinks.forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        if (targetId === "#") return;
                        
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop;
                            scrollbar.scrollTo(0, offsetTop, 1000);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('Error initializing smooth scrollbar:', error);
        }
    } else {
        // Fallback to native smooth scrolling if container doesn't exist
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === "#") return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Language selector inicializálás
function initLanguageSelector() {
    const languageSelectorBtn = document.querySelector('.language-selector-btn');
    const languageSelectorMobileBtn = document.querySelector('.language-selector-mobile-btn');
    
    if (languageSelectorBtn) {
        languageSelectorBtn.addEventListener('click', toggleLanguageMenu);
    }
    
    if (languageSelectorMobileBtn) {
        languageSelectorMobileBtn.addEventListener('click', toggleLanguageMenuMobile);
    }
    
    document.querySelectorAll('.language-option, .language-option-mobile').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang) {
                changeLanguage(lang);
            }
        });
    });
    
    document.addEventListener('click', function(event) {
        const languageSelector = document.querySelector('.language-selector');
        const languageSelectorMobile = document.querySelector('.language-selector-mobile');
        const languageMenu = document.querySelector('#language-menu');
        const languageMenuMobile = document.querySelector('#language-menu-mobile');
        
        if (languageMenu && languageMenu.classList.contains('active') && 
            languageSelector && !languageSelector.contains(event.target) && 
            !languageMenu.contains(event.target)) {
            languageMenu.classList.remove('active');
            languageMenu.classList.add('hidden');
        }
        
        if (languageMenuMobile && languageMenuMobile.classList.contains('active') && 
            languageSelectorMobile && !languageSelectorMobile.contains(event.target) && 
            !languageMenuMobile.contains(event.target)) {
            languageMenuMobile.classList.remove('active');
            languageMenuMobile.classList.add('hidden');
        }
    });
}

// Mobile menu inicializálás
function initMobileMenu() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburgerIcon && mobileMenu) {
        hamburgerIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            hamburgerIcon.classList.toggle('active');
            if (menuOverlay) menuOverlay.classList.toggle('active');
        });
    }
    
    if (menuOverlay && mobileMenu && hamburgerIcon) {
        menuOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.remove('active');
            hamburgerIcon.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }
    
    // Mobile menü linkekre zárás
    if (mobileMenu && hamburgerIcon) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                hamburgerIcon.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
            });
        });
    }
}

// Scroll animációk inicializálása
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');
    if (fadeElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Testimonials carousel inicializálása
function initTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonials-dot');
    
    if (!track || slides.length === 0 || dots.length === 0) return;
    
    let currentSlide = 0;
    let autoSlideInterval;
    const isDesktop = window.innerWidth >= 769;
    const visibleSlides = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
    const maxSlide = isDesktop ? Math.min(3, slides.length - 1) : Math.max(0, slides.length - visibleSlides);
    const activeDots = isDesktop ? Math.min(4, dots.length) : dots.length;
    
    // Slide frissítése
    function updateSlide(slideIndex) {
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
        
        let translateX;
        if (isDesktop) {
            // Asztali nézeten: egy slide szélességű léptetés
            const slideWidth = slides[0].offsetWidth;
            translateX = -(currentSlide * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;
        } else {
            // Mobil nézeten: slide szélességű léptetés
            const slideWidth = slides[0].offsetWidth;
            translateX = -(currentSlide * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;
        }
        
        // Dots frissítése - csak az aktív dotok számáig
        dots.forEach((dot, index) => {
            if (index < activeDots && dot) {
                if (index === currentSlide) {
                    dot.classList.remove('bg-gray-600');
                    dot.classList.add('bg-blue-600', 'active');
                } else {
                    dot.classList.remove('bg-blue-600', 'active');
                    dot.classList.add('bg-gray-600');
                }
            }
        });
    }
    
    // Következő slide
    function nextSlide() {
        updateSlide(currentSlide + 1 > maxSlide ? 0 : currentSlide + 1);
    }
    
    // Automatikus léptetés indítása
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000); // 4 másodpercenként
    }
    
    // Automatikus léptetés leállítása
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }
    
    // Dots eseménykezelők - csak az aktív dotokra
    dots.forEach((dot, index) => {
        if (index < activeDots && dot) {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                updateSlide(index);
                startAutoSlide();
            });
        }
    });
    
    // Mouse hover események
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Ablak átméretezés kezelése
    window.addEventListener('resize', () => {
        location.reload(); // Egyszerű megoldás az átméretezésre
    });
    
    // Kezdeti beállítások
    updateSlide(0);
    startAutoSlide();
}

// Fő inicializáló függvény
document.addEventListener('DOMContentLoaded', function() {
    // Body opacity beállítása
    document.body.style.opacity = '1';
    
    // Nyelvi menük elrejtése alapértelmezetten
    const languageMenu = document.querySelector('#language-menu');
    const languageMenuMobile = document.querySelector('#language-menu-mobile');
    
    if (languageMenu) {
        languageMenu.classList.remove('active');
        languageMenu.classList.add('hidden');
    }
    
    if (languageMenuMobile) {
        languageMenuMobile.classList.remove('active');
        languageMenuMobile.classList.add('hidden');
    }
    
    // Alapvető inicializálások
    initSmoothScrollbar();
    initLanguageSelector();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialsCarousel();
    
    // Nyelv beállítások
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    updateLanguageUI();
    translatePage();

    // Képkörhinta mobil és asztali interakció
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselTrack = document.querySelector('.carousel-track');
    let isPaused = false;

    // Mobil interakció (kattintásra)
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
    
    // Asztali interakció (hover-re)
    if (window.innerWidth > 640) {
        carouselItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                carouselTrack.style.animationPlayState = 'paused';
            });
            item.addEventListener('mouseleave', () => {
                carouselTrack.style.animationPlayState = 'running';
            });
        });
    }
});

// ... meglévő kód ...