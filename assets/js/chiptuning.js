// Chiptuning oldal specifikus JavaScript funkciók

// Globális változók
let currentLanguage = "hu";
let currentAudio = null;

// Audio lejátszás funkciók (chiptuning-specifikus)
function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    
    // Ha ugyanaz a hang van kiválasztva és éppen játszik, megállítjuk
    if (currentAudio && currentAudio.id === audioId && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        updatePlayButton(audioId, false);
        currentAudio = null;
        return;
    }
    
    // Megállítjuk az aktuálisan lejátszott hangot, ha van és más
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        updatePlayButton(currentAudio.id, false);
    }
    
    // Új hang lejátszása
    currentAudio = audio;
    updatePlayButton(audioId, true);
    
    audio.play().then(() => {
        console.log('Audio playing:', audioId);
    }).catch(error => {
        console.error('Error playing audio:', error);
        updatePlayButton(audioId, false);
        currentAudio = null;
    });
    
    // Eseménykezelők beállítása (csak egyszer)
    if (!audio.hasEventListeners) {
        audio.addEventListener('ended', function() {
            updatePlayButton(audioId, false);
            currentAudio = null;
        });
        
        audio.addEventListener('pause', function() {
            updatePlayButton(audioId, false);
        });
        
        audio.hasEventListeners = true;
    }
}

function updatePlayButton(audioId, isPlaying) {
    const button = document.querySelector(`button[onclick="playAudio('${audioId}')"]`);
    if (button) {
        const icon = button.querySelector('i');
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause text-sm';
                button.classList.add('bg-green-600', 'hover:bg-green-700');
                button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            } else {
                icon.className = 'fas fa-play text-sm';
                button.classList.add('bg-blue-600', 'hover:bg-blue-700');
                button.classList.remove('bg-green-600', 'hover:bg-green-700');
            }
        }
    }
}

// Oldal inicializálása
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Főoldal inicializálása
function initializePage() {
    initializeLanguageSelector();
    initializeServicesMenu();
    initializeMobileMenu();
    initializeAnimations();
    initializeScrollEffects();
    initializeSmoothScrolling();
    initializeResizeHandler();
    updateCopyrightYear();
    console.log('Chiptuning oldal inicializálva');
}

// Nyelvi választó inicializálása
function initializeLanguageSelector() {
    const languageBtn = document.querySelector('.language-selector-btn');
    const languageBtnMobile = document.querySelector('.language-selector-mobile-btn');
    const languageMenu = document.getElementById('language-menu');
    const languageMenuMobile = document.getElementById('language-menu-mobile');
    
    // Desktop nyelvi választó
    if (languageBtn && languageMenu) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageMenu();
        });
    }
    
    // Mobil nyelvi választó
    if (languageBtnMobile && languageMenuMobile) {
        languageBtnMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageMenuMobile();
        });
    }
    
    // Nyelvi opciók eseménykezelői (desktop)
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            if (lang) {
                changeLanguage(lang);
            }
        });
    });
    
    // Mobil nyelvi opciók eseménykezelői
    const languageOptionsMobile = document.querySelectorAll('.language-option-mobile');
    languageOptionsMobile.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            if (lang) {
                changeLanguage(lang);
            }
        });
    });
    
    // Kívülre kattintás esetén bezárás
    document.addEventListener('click', function() {
        if (languageMenu) languageMenu.classList.add('hidden');
        if (languageMenuMobile) languageMenuMobile.classList.add('hidden');
    });
    
    // Kezdeti nyelv beállítása
    updateLanguageUI();
}

// Nyelvi menü váltás
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

// Nyelv váltás funkció
function changeLanguage(lang) {
    currentLanguage = lang;
    updateLanguageUI();
    
    // Menük bezárása
    const languageMenu = document.getElementById('language-menu');
    const languageMenuMobile = document.getElementById('language-menu-mobile');
    if (languageMenu) languageMenu.classList.add('hidden');
    if (languageMenuMobile) languageMenuMobile.classList.add('hidden');
    
    // LocalStorage mentés
    saveToLocalStorage('selectedLanguage', lang);
}

// Nyelvi felület frissítése
function updateLanguageUI() {
    // Desktop zászló frissítése
    const desktopFlag = document.getElementById('current-flag-svg');
    const desktopLang = document.getElementById('current-lang');
    
    if (desktopFlag) {
        desktopFlag.innerHTML = `<svg viewBox="0 0 24 16" width="24" height="16">${getFlagSvgContent(currentLanguage)}</svg>`;
    }
    
    if (desktopLang) {
        const langNames = { 'hu': 'HU', 'en': 'EN', 'de': 'DE' };
        desktopLang.textContent = langNames[currentLanguage] || 'HU';
    }
    
    // Mobil zászló frissítése
    const mobileFlag = document.getElementById('current-flag-svg-mobile');
    const mobileLang = document.getElementById('current-lang-mobile');
    
    if (mobileFlag) {
        mobileFlag.innerHTML = `<svg viewBox="0 0 24 16" width="24" height="16">${getFlagSvgContent(currentLanguage)}</svg>`;
    }
    
    if (mobileLang) {
        const langNames = { 'hu': 'HU', 'en': 'EN', 'de': 'DE' };
        mobileLang.textContent = langNames[currentLanguage] || 'HU';
    }
}

// Zászló SVG tartalom
function getFlagSvgContent(lang) {
    const flags = {
        'hu': '<svg viewBox="0 0 3 2" width="24" height="16"><rect width="3" height="2" fill="#fff"/><rect width="3" height="0.67" y="0" fill="#cd2a3e"/><rect width="3" height="0.67" y="1.33" fill="#436f4d"/></svg>',

        'en': '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6"/></g></svg>',

        'de': '<rect width="24" height="16" fill="#000"/><rect width="24" height="5.33" y="5.33" fill="#DD0000"/><rect width="24" height="5.33" y="10.67" fill="#FFCE00"/>'
    };
    return flags[lang] || flags['hu'];
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
            e.preventDefault();
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

// Scroll effektek inicializálása
function initializeScrollEffects() {
    const header = document.querySelector('header');
    
    if (header) {
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
        
        console.log('Natív smooth scroll inicializálva (Lenis nem elérhető)');
    }
}

// Resize handler inicializálása
function initializeResizeHandler() {
    window.addEventListener('resize', debounce(() => {
        // Mobil menü bezárása resize esetén
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.querySelector('.hamburger-icon');
        const menuOverlay = document.querySelector('.menu-overlay');
        
        if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            if (hamburgerIcon) hamburgerIcon.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
        }
    }, 250));
}

// Copyright év frissítése
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Utility funkciók
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

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('LocalStorage mentési hiba:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('LocalStorage olvasási hiba:', error);
        return null;
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
}

// Globális elérhetőség
window.ChiptuningPage = {
    playAudio,
    updatePlayButton,
    changeLanguage,
    toggleLanguageMenu,
    toggleLanguageMenuMobile
};