// Index.js - Főoldal specifikus JavaScript funkciók

// Globális változók
let currentSlide = 0;
let totalSlides = 0;
let isAutoPlaying = true;
let autoPlayInterval;
let resizeTimeout;
let currentLanguage = "hu";

// DOM betöltés után inicializálás
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Oldal inicializálása
function initializePage() {
    initializeLanguageSelector();
    initializeServicesMenu();
    initializeMobileMenu();
    initializeAnimations();
    initializeTestimonialsCarousel();
    initializeScrollEffects();
    initializeSmoothScrolling();
    initializeResizeHandler();
    
    // Copyright év frissítése
    updateCopyrightYear();
    
    console.log('Index oldal inicializálva');
}

// Nyelvi választó inicializálása
function initializeLanguageSelector() {
    const languageBtn = document.querySelector('.language-selector-btn');
    const languageMenu = document.getElementById('language-menu');
    const languageOptions = document.querySelectorAll('.language-option');
    
    const languageBtnMobile = document.querySelector('.language-selector-mobile-btn');
    const languageMenuMobile = document.getElementById('language-menu-mobile');
    const languageOptionsMobile = document.querySelectorAll('.language-option-mobile');
    
    // Desktop nyelvi választó
    if (languageBtn && languageMenu) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageMenu();
        });
        
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                changeLanguage(lang);
            });
        });
    }
    
    // Mobil nyelvi választó
    if (languageBtnMobile && languageMenuMobile) {
        languageBtnMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageMenuMobile();
        });
        
        languageOptionsMobile.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                changeLanguage(lang);
            });
        });
    }
    
    // Kívülre kattintás esetén bezárás
    document.addEventListener('click', function() {
        if (languageMenu) {
            languageMenu.classList.remove('active');
            languageMenu.classList.add('hidden');
        }
        if (languageMenuMobile) {
            languageMenuMobile.classList.remove('active');
            languageMenuMobile.classList.add('hidden');
        }
    });
    
    // Kezdeti nyelv beállítása
    updateLanguageUI();
}

// Nyelvi menü váltás
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

// Nyelv váltás
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

// Nyelvi UI frissítése
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
}

// Zászló SVG tartalom
function getFlagSvgContent(lang) {
    switch (lang) {
        case "hu":
            return '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.67" y="0" fill="#cd2a3e"/><rect width="3" height="0.67" y="1.33" fill="#436f4d"/></svg>';
        case "en":
            return '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"/></g></svg>';
        case "de":
            return '<svg viewBox="0 0 5 3" width="24" height="16"><rect width="5" height="1" y="0" fill="#000"/><rect width="5" height="1" y="1" fill="#dd0000"/><rect width="5" height="1" y="2" fill="#ffce00"/></svg>';
        default:
            return '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.67" y="0" fill="#cd2a3e"/><rect width="3" height="0.67" y="1.33" fill="#436f4d"/></svg>';
    }
}

// Szolgáltatások menü inicializálása
function initializeServicesMenu() {
    const servicesBtn = document.querySelector('.services-selector-btn');
    const servicesMenu = document.getElementById('services-menu');
    
    const servicesBtnMobile = document.querySelector('.services-selector-mobile-btn');
    const servicesMenuMobile = document.getElementById('services-menu-mobile');
    
    // Desktop szolgáltatások menü
    if (servicesBtn && servicesMenu) {
        servicesBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            servicesMenu.classList.toggle('hidden');
        });
    }
    
    // Mobil szolgáltatások menü
    if (servicesBtnMobile && servicesMenuMobile) {
        servicesBtnMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            servicesMenuMobile.classList.toggle('hidden');
        });
    }
    
    // Kívülre kattintás esetén bezárás
    document.addEventListener('click', function() {
        if (servicesMenu) servicesMenu.classList.add('hidden');
        if (servicesMenuMobile) servicesMenuMobile.classList.add('hidden');
    });
}

// Mobil menü inicializálása
function initializeMobileMenu() {
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

// Mobil szolgáltatások menü váltás
function toggleServicesMenuMobile() {
    const servicesMenuMobile = document.querySelector("#services-menu-mobile");
    const servicesSelectorMobileBtn = document.querySelector(".services-selector-mobile-btn");
    
    if (servicesMenuMobile && servicesSelectorMobileBtn) {
        const isHidden = servicesMenuMobile.classList.contains("hidden");
        if (isHidden) {
            servicesMenuMobile.classList.remove("hidden");
            servicesSelectorMobileBtn.setAttribute("aria-expanded", "true");
        } else {
            servicesMenuMobile.classList.add("hidden");
            servicesSelectorMobileBtn.setAttribute("aria-expanded", "false");
        }
    }
}

// Animációk inicializálása
function initializeAnimations() {
    // Intersection Observer a fade-in animációkhoz
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Staggered animáció a gyerek elemekhez
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Animálható elemek megfigyelése
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right');
    animateElements.forEach(el => observer.observe(el));
    
    // Szakértelem kártyák staggered animációja
    const expertiseCards = document.querySelectorAll('#szolgaltatasok .bg-gray-900');
    expertiseCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in-up');
    });
    
    // Miért válassz minket kártyák animációja
    const whyUsCards = document.querySelectorAll('#rolunk .bg-gray-800');
    whyUsCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('slide-in-left');
    });
}

// Ügyfél vélemények carousel inicializálása
function initializeTestimonialsCarousel() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonials-dot');
    
    if (!track || !slides.length || !dots.length) return;
    
    totalSlides = Math.ceil(slides.length / getSlidesPerView());
    
    // Dots eseménykezelők
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            pauseAutoPlay();
        });
    });
    
    // Kezdeti állapot beállítása
    updateCarousel();
    updateDots();
    
    // Auto-play indítása
    startAutoPlay();
    
    // Touch/swipe támogatás
    initializeTouchSupport(track);
    
    // Keyboard navigáció
    initializeKeyboardNavigation();
}

// Carousel frissítése
function updateCarousel() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;
    
    const slideWidth = 100 / getSlidesPerView();
    const translateX = -currentSlide * 100;
    
    track.style.transform = `translateX(${translateX}%)`;
}

// Dots frissítése
function updateDots() {
    const dots = document.querySelectorAll('.testimonials-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Slide váltás
function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    updateCarousel();
    updateDots();
}

// Következő slide
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// Előző slide
function prevSlide() {
    goToSlide(currentSlide - 1);
}

// Auto-play indítása
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    
    autoPlayInterval = setInterval(() => {
        if (isAutoPlaying) {
            nextSlide();
        }
    }, 5000);
}

// Auto-play szüneteltetése
function pauseAutoPlay() {
    isAutoPlaying = false;
    setTimeout(() => {
        isAutoPlaying = true;
    }, 10000); // 10 másodperc után újraindítás
}

// Képernyőméret alapján slides per view számítása
function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3; // Desktop
    if (window.innerWidth >= 768) return 2;  // Tablet
    return 1; // Mobile
}

// Touch/swipe támogatás
function initializeTouchSupport(track) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        pauseAutoPlay();
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
}

// Keyboard navigáció
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.testimonials-carousel')) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    pauseAutoPlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    pauseAutoPlay();
                    break;
            }
        }
    });
}

// Scroll effektek inicializálása
function initializeScrollEffects() {
    const header = document.querySelector('header');
    
    if (header) {
        // Lenis scroll event használata ha elérhető
        if (window.lenis) {
            window.lenis.on('scroll', debounce((e) => {
                const scrollY = e.scroll;
                
                // Header átlátszóság
                if (scrollY > 100) {
                    header.style.backgroundColor = 'rgb(0, 0, 0)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.backgroundColor = 'rgb(0, 0, 0)';
                    header.style.backdropFilter = 'blur(5px)';
                }
            }, 10));
        } else {
            // Fallback natív scroll event
            window.addEventListener('scroll', debounce(() => {
                const scrollY = window.scrollY;
                
                // Header átlátszóság
                if (scrollY > 100) {
                    header.style.backgroundColor = 'rgb(0, 0, 0)';
                    header.style.backdropFilter = 'blur(10px)';
                } else {
                    header.style.backgroundColor = 'rgb(0, 0, 0)';
                    header.style.backdropFilter = 'blur(5px)';
                }
            }, 10));
        }
    }
}

// Smooth scrolling inicializálása
function initializeSmoothScrolling() {
    // Lenis smooth scroll inicializálása
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Lenis animation loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Smooth scroll anchor linkekhez
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    // Lenis smooth scroll használata
                    lenis.scrollTo(targetPosition, {
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            });
        });

        // Lenis instance globális elérhetősége
        window.lenis = lenis;
        
        console.log('Lenis smooth scroll inicializálva');
    } else {
        // Fallback natív smooth scroll ha Lenis nem elérhető
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        console.log('Fallback smooth scroll inicializálva (Lenis nem elérhető)');
    }
}

// Resize handler inicializálása
function initializeResizeHandler() {
    window.addEventListener('resize', debounce(() => {
        // Carousel újraszámítása
        const newTotalSlides = Math.ceil(document.querySelectorAll('.testimonial-slide').length / getSlidesPerView());
        if (newTotalSlides !== totalSlides) {
            totalSlides = newTotalSlides;
            if (currentSlide >= totalSlides) {
                currentSlide = totalSlides - 1;
            }
            updateCarousel();
            updateDots();
        }
        
        // Mobil menü bezárása desktop nézeten
        if (window.innerWidth >= 768) {
            const mobileMenu = document.getElementById('mobile-menu');
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                if (hamburgerIcon) {
                    hamburgerIcon.setAttribute('aria-expanded', 'false');
                    const icon = hamburgerIcon.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars text-2xl';
                }
            }
        }
    }, 250));
}



// Copyright év frissítése
function updateCopyrightYear() {
    const yearElement = document.querySelector('.copyright-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Debounce utility függvény
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

// Utility függvény - elem láthatóságának ellenőrzése
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Mobil eszköz detektálása
function isMobile() {
    return window.innerWidth <= 768;
}

// Local storage kezelés
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('LocalStorage nem elérhető:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('LocalStorage olvasási hiba:', e);
        return null;
    }
}

// Exportálás globális használatra
window.IndexPage = {
    nextSlide,
    prevSlide,
    goToSlide,
    changeLanguage,
    pauseAutoPlay,
    startAutoPlay
};