// Referenciak.js - Referencia oldal specifikus JavaScript funkciók

// Globális változók
let isScrolling = false;
let scrollTimeout;

// DOM betöltés után inicializálás
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Oldal inicializálása
function initializePage() {
    initializeLanguageSelector();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeImageLazyLoading();
    initializeReferenceCards();
    initializeSmoothScrolling();
    initializeContactAnimations();
    initializeCounters();
    initializeProgressBars();
    
    // Copyright év frissítése
    updateCopyrightYear();
    
    console.log('Referenciák oldal inicializálva');
}

// Nyelvi választó inicializálása
function initializeLanguageSelector() {
    const languageBtn = document.querySelector('.language-selector-btn');
    const languageMenu = document.getElementById('language-menu');
    const languageOptions = document.querySelectorAll('.language-option');
    
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
    
    // Kívülre kattintás esetén bezárás
    document.addEventListener('click', function() {
        if (languageMenu) {
            languageMenu.classList.remove('active');
            languageMenu.classList.add('hidden');
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

// Nyelv váltás
function changeLanguage(lang) {
    if (lang === currentLanguage) return;
    
    currentLanguage = lang;
    
    // Nyelvi elemek frissítése
    updateLanguageUI();
    
    // Nyelv mentése localStorage-ba
    saveToLocalStorage('selectedLanguage', lang);
    
    console.log(`Nyelv váltva: ${lang}`);
}

// Nyelvi UI frissítése
function updateLanguageUI() {
    const currentLangElement = document.getElementById('current-lang');
    const currentFlagElement = document.getElementById('current-flag-svg');
    
    if (currentLangElement) {
        currentLangElement.textContent = currentLanguage.toUpperCase();
    }
    
    if (currentFlagElement) {
        currentFlagElement.innerHTML = getFlagSvgContent(currentLanguage);
    }
}

// Zászló SVG tartalom
function getFlagSvgContent(lang) {
    const flags = {
        'hu': '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="0.67" y="0" fill="#cd2a3e" /><rect width="3" height="0.67" y="0.67" fill="#fff" /><rect width="3" height="0.67" y="1.33" fill="#436f4d" /></svg>',
        'en': '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z" /></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169" /><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6" /><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" stroke-width="4" /><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" /><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" /></g></svg>',
        'de': '<svg viewBox="0 0 5 3" width="24" height="16"><rect width="5" height="1" y="0" fill="#000" /><rect width="5" height="1" y="1" fill="#dd0000" /><rect width="5" height="1" y="2" fill="#ffce00" /></svg>'
    };
    return flags[lang] || flags['hu'];
}

// Mobil menü inicializálása
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            openMobileMenu();
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // ESC billentyű lenyomására bezárás
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// Mobil menü megnyitása
function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (mobileMenu) {
        mobileMenu.style.display = 'flex';
        setTimeout(() => {
            mobileMenu.classList.add('active');
        }, 10);
    }
    
    if (menuOverlay) {
        menuOverlay.classList.add('active');
    }
    
    // Body scroll letiltása
    document.body.style.overflow = 'hidden';
}

// Mobil menü bezárása
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        setTimeout(() => {
            mobileMenu.style.display = 'none';
        }, 300);
    }
    
    if (menuOverlay) {
        menuOverlay.classList.remove('active');
    }
    
    // Body scroll engedélyezése
    document.body.style.overflow = '';
}

// Scroll animációk inicializálása
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Staggered animáció a lista elemekhez
                if (entry.target.classList.contains('services-list')) {
                    const listItems = entry.target.querySelectorAll('li');
                    listItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Animálandó elemek megfigyelése
    const animateElements = document.querySelectorAll('.fade-in-up, .reference-card, .service-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Képek lazy loading inicializálása
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('.reference-image');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Kép betöltése
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Loading animáció eltávolítása
                img.addEventListener('load', function() {
                    img.classList.add('loaded');
                });
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Referencia kártyák interaktivitása
function initializeReferenceCards() {
    const referenceCards = document.querySelectorAll('.reference-card');
    
    referenceCards.forEach(card => {
        // Hover effektek
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Kattintás animáció
        card.addEventListener('click', function(e) {
            // Ripple effekt
            createRippleEffect(e, this);
        });
        
        // Teljesítmény számláló animáció
        const performanceNumbers = card.querySelectorAll('.performance-after .font-bold');
        performanceNumbers.forEach(number => {
            animateNumber(number);
        });
    });
}

// Ripple effekt létrehozása
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Szám animáció
function animateNumber(element) {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const numbers = text.match(/\d+/g);
                
                if (numbers) {
                    numbers.forEach(num => {
                        const targetValue = parseInt(num);
                        animateCountUp(entry.target, targetValue, text);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(element);
}

// Számláló animáció
function animateCountUp(element, targetValue, originalText) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        // Szöveg frissítése
        element.textContent = originalText.replace(/\d+/g, currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = originalText;
        }
    }
    
    requestAnimationFrame(updateCount);
}

// Smooth scrolling inicializálása
function initializeSmoothScrolling() {
    // Lenis smooth scroll inicializálása
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
    
    // Anchor linkek smooth scroll
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Számláló animációk inicializálása
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    // Intersection Observer a számláló animációkhoz
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Számláló animáció
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100; // 100 lépésben számol
    const duration = 2000; // 2 másodperc
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
            
            // Speciális formázás a különböző típusokhoz
            if (target === 5000) {
                element.textContent = '5000+';
            } else if (target === 8) {
                element.textContent = '8+';
            } else {
                element.textContent = Math.floor(current);
            }
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Progress bar animációk inicializálása
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill[data-target]');
    
    // Intersection Observer a progress bar animációkhoz
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const target = parseInt(progressBar.getAttribute('data-target'));
                animateProgressBar(progressBar, target);
                progressObserver.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.3
    });
    
    progressBars.forEach(progressBar => {
        progressObserver.observe(progressBar);
    });
}

// Progress bar animáció
function animateProgressBar(element, targetWidth) {
    let currentWidth = 0;
    const increment = targetWidth / 100; // 100 lépésben animál
    const duration = 2000; // 2 másodperc
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        currentWidth += increment;
        
        if (currentWidth >= targetWidth) {
            currentWidth = targetWidth;
            clearInterval(timer);
        }
        
        element.style.width = currentWidth + '%';
    }, stepTime);
}

// Kapcsolat animációk
function initializeContactAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach((item, index) => {
        // Staggered animáció
        item.style.animationDelay = `${index * 0.2}s`;
        
        // Hover effektek
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Copyright év frissítése
function updateCopyrightYear() {
    const copyrightElement = document.querySelector('footer p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace(/\d{4}/, currentYear);
    }
}

// Utility funkciók
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

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// CSS animáció hozzáadása
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .services-list li {
        opacity: 1 !important;
        transform: translateX(0) !important;
        transition: all 0.3s ease;
    }
    
    .reference-image.loaded {
        animation: none;
        background: none;
    }
`;
document.head.appendChild(style);

// Globális függvények exportálása
window.ReferencePage = {
    changeLanguage,
    openMobileMenu,
    closeMobileMenu,
    createRippleEffect
};

console.log('Referenciak.js betöltve');