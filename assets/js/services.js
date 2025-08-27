// Services.js - Szolgáltatások oldal specifikus JavaScript funkciók

// Globális változók
let currentLanguage = 'hu';
let isLanguageMenuOpen = false;
let isServicesMenuOpen = false;
let isMobileMenuOpen = false;
let resizeTimeout;

// DOM betöltés után inicializálás
document.addEventListener('DOMContentLoaded', function() {
    initServicesPage();
});

// Szolgáltatások oldal inicializálása
function initServicesPage() {
    setupLanguageSelector();
    setupServicesMenu();
    setupMobileMenu();
    setupAnimations();
    setupScrollEffects();
    setupServiceCards();
    setupResizeHandler();
    
    // Kezdeti nyelv beállítása
    updateCurrentLanguageDisplay();
    
    console.log('Services page initialized successfully');
}

// Nyelvi választó beállítása
function setupLanguageSelector() {
    // Asztali nyelvi választó
    const languageButton = document.querySelector('.language-selector button');
    const languageMenu = document.getElementById('language-menu');
    
    if (languageButton && languageMenu) {
        languageButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageMenu();
        });
    }
    
    // Mobil nyelvi választó
    const mobileLanguageButton = document.querySelector('.language-selector-mobile button');
    const mobileLanguageMenu = document.getElementById('language-menu-mobile');
    
    if (mobileLanguageButton && mobileLanguageMenu) {
        mobileLanguageButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageMenuMobile();
        });
    }
    
    // Kívülre kattintás kezelése
    document.addEventListener('click', function() {
        closeLanguageMenus();
    });
}

// Szolgáltatások menü beállítása
function setupServicesMenu() {
    // Asztali szolgáltatások menü
    const servicesButton = document.querySelector('.services-selector button');
    const servicesMenu = document.getElementById('services-menu');
    
    if (servicesButton && servicesMenu) {
        servicesButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleServicesMenu();
        });
    }
    
    // Mobil szolgáltatások menü
    const mobileServicesButton = document.querySelector('.services-selector-mobile-btn');
    const mobileServicesMenu = document.getElementById('services-menu-mobile');
    
    if (mobileServicesButton && mobileServicesMenu) {
        mobileServicesButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleServicesMenuMobile();
        });
    }
    
    // Kívülre kattintás kezelése
    document.addEventListener('click', function() {
        closeServicesMenus();
    });
}

// Mobil menü beállítása
function setupMobileMenu() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburgerIcon && mobileMenu) {
        hamburgerIcon.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
}

// Animációk beállítása
function setupAnimations() {
    // Fade-in animációk megfigyelése
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Szolgáltatási kártyák animálása
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        observer.observe(card);
    });
    
    // Hero szekció animálása
    const heroSection = document.querySelector('.services-hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
    
    // Kapcsolat szekció animálása
    const contactSection = document.querySelector('.bmw-m-contact');
    if (contactSection) {
        observer.observe(contactSection);
    }
}

// Scroll effektek beállítása
function setupScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Scroll kezelése
function handleScroll() {
    const scrollY = window.scrollY;
    const header = document.querySelector('header');
    
    // Header átlátszóság
    if (header) {
        const opacity = Math.min(scrollY / 100, 0.95);
        header.style.backgroundColor = `rgba(17, 24, 39, ${opacity})`;
    }
    
    // Parallax effekt a hero videóhoz
    const heroVideo = document.querySelector('.hero-bg');
    if (heroVideo) {
        const parallaxSpeed = 0.5;
        const yPos = -(scrollY * parallaxSpeed);
        heroVideo.style.transform = `translateY(${yPos}px)`;
    }
}

// Szolgáltatási kártyák beállítása
function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Hover effektek
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Kattintás kezelése
        card.addEventListener('click', function() {
            const link = this.getAttribute('onclick');
            if (link) {
                // onclick attribútum végrehajtása
                eval(link);
            }
        });
        
        // Billentyűzet navigáció
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Átméretezés kezelése
function setupResizeHandler() {
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleResize();
        }, 250);
    });
}

// Átméretezés kezelése
function handleResize() {
    // Mobil menü bezárása nagyobb képernyőn
    if (window.innerWidth >= 640 && isMobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Menük bezárása
    closeAllMenus();
}

// Nyelvi menü váltása (asztali)
function toggleLanguageMenu() {
    const languageMenu = document.getElementById('language-menu');
    if (languageMenu) {
        isLanguageMenuOpen = !isLanguageMenuOpen;
        languageMenu.classList.toggle('hidden', !isLanguageMenuOpen);
        
        // Más menük bezárása
        if (isLanguageMenuOpen) {
            closeServicesMenus();
        }
    }
}

// Nyelvi menü váltása (mobil)
function toggleLanguageMenuMobile() {
    const mobileLanguageMenu = document.getElementById('language-menu-mobile');
    if (mobileLanguageMenu) {
        mobileLanguageMenu.classList.toggle('hidden');
    }
}

// Szolgáltatások menü váltása (asztali)
function toggleServicesMenu() {
    const servicesMenu = document.getElementById('services-menu');
    if (servicesMenu) {
        isServicesMenuOpen = !isServicesMenuOpen;
        servicesMenu.classList.toggle('hidden', !isServicesMenuOpen);
        
        // Más menük bezárása
        if (isServicesMenuOpen) {
            closeLanguageMenus();
        }
    }
}

// Szolgáltatások menü váltása (mobil)
function toggleServicesMenuMobile() {
    const mobileServicesMenu = document.getElementById('services-menu-mobile');
    if (mobileServicesMenu) {
        mobileServicesMenu.classList.toggle('hidden');
    }
}

// Mobil menü váltása
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    
    if (mobileMenu && hamburgerIcon) {
        isMobileMenuOpen = !isMobileMenuOpen;
        mobileMenu.classList.toggle('hidden', !isMobileMenuOpen);
        
        // Hamburger ikon változtatása
        const icon = hamburgerIcon.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !isMobileMenuOpen);
            icon.classList.toggle('fa-times', isMobileMenuOpen);
        }
        
        // Aria attribútum frissítése
        hamburgerIcon.setAttribute('aria-expanded', isMobileMenuOpen);
    }
}

// Nyelvi menük bezárása
function closeLanguageMenus() {
    const languageMenu = document.getElementById('language-menu');
    const mobileLanguageMenu = document.getElementById('language-menu-mobile');
    
    if (languageMenu) {
        languageMenu.classList.add('hidden');
        isLanguageMenuOpen = false;
    }
    
    if (mobileLanguageMenu) {
        mobileLanguageMenu.classList.add('hidden');
    }
}

// Szolgáltatások menük bezárása
function closeServicesMenus() {
    const servicesMenu = document.getElementById('services-menu');
    const mobileServicesMenu = document.getElementById('services-menu-mobile');
    
    if (servicesMenu) {
        servicesMenu.classList.add('hidden');
        isServicesMenuOpen = false;
    }
    
    if (mobileServicesMenu) {
        mobileServicesMenu.classList.add('hidden');
    }
}

// Mobil menü bezárása
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        isMobileMenuOpen = false;
    }
    
    if (hamburgerIcon) {
        const icon = hamburgerIcon.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
        hamburgerIcon.setAttribute('aria-expanded', 'false');
    }
}

// Összes menü bezárása
function closeAllMenus() {
    closeLanguageMenus();
    closeServicesMenus();
}

// Nyelv váltása
function changeLanguage(lang) {
    currentLanguage = lang;
    updateCurrentLanguageDisplay();
    closeLanguageMenus();
    
    // Itt lehet implementálni a tényleges nyelvi váltást
    console.log('Language changed to:', lang);
}

// Aktuális nyelv megjelenítésének frissítése
function updateCurrentLanguageDisplay() {
    // Asztali nézet
    const currentLangSpan = document.getElementById('current-lang');
    const currentFlagSvg = document.getElementById('current-flag-svg');
    
    // Mobil nézet
    const currentLangMobile = document.getElementById('current-lang-mobile');
    const currentFlagSvgMobile = document.getElementById('current-flag-svg-mobile');
    
    const langData = {
        'hu': { name: 'HU', flag: getHungarianFlagSVG() },
        'en': { name: 'EN', flag: getEnglishFlagSVG() },
        'de': { name: 'DE', flag: getGermanFlagSVG() }
    };
    
    const data = langData[currentLanguage] || langData['hu'];
    
    // Asztali frissítése
    if (currentLangSpan) currentLangSpan.textContent = data.name;
    if (currentFlagSvg) currentFlagSvg.innerHTML = data.flag;
    
    // Mobil frissítése
    if (currentLangMobile) currentLangMobile.textContent = data.name;
    if (currentFlagSvgMobile) currentFlagSvgMobile.innerHTML = data.flag;
}

// Zászló SVG-k
function getHungarianFlagSVG() {
    return '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.67" y="0" fill="#cd2a3e"/><rect width="3" height="0.67" y="1.33" fill="#436f4d"/></svg>';
}

function getEnglishFlagSVG() {
    return '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"/></g></svg>';
}

function getGermanFlagSVG() {
    return '<svg viewBox="0 0 5 3" width="24" height="16"><rect width="5" height="1" y="0" fill="#000"/><rect width="5" height="1" y="1" fill="#dd0000"/><rect width="5" height="1" y="2" fill="#ffce00"/></svg>';
}

// Smooth scroll funkció
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Debounce funkció
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

// Utility funkciók
const utils = {
    // Element láthatóságának ellenőrzése
    isElementVisible: function(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    },
    
    // Animáció késleltetése
    staggerAnimation: function(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * delay);
        });
    },
    
    // Képernyő méret ellenőrzése
    isMobile: function() {
        return window.innerWidth < 640;
    },
    
    // Local storage kezelés
    setPreference: function(key, value) {
        try {
            localStorage.setItem(`services_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Could not save preference:', e);
        }
    },
    
    getPreference: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`services_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Could not load preference:', e);
            return defaultValue;
        }
    }
};

// Globális függvények exportálása
window.servicesPage = {
    changeLanguage,
    toggleLanguageMenu,
    toggleLanguageMenuMobile,
    toggleServicesMenu,
    toggleServicesMenuMobile,
    toggleMobileMenu,
    smoothScrollTo,
    utils
};

// Hiba kezelés
window.addEventListener('error', function(e) {
    console.error('Services page error:', e.error);
});

// Teljesítmény monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Services page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}