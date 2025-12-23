// Software.js - Szoftver oldal specifikus JavaScript funkciók

// Globális változók
(() => {
let currentSlide = 0;
let totalSlides = 0;
let isAutoPlaying = true;
let autoPlayInterval;
let resizeTimeout;
let currentLanguage = "hu";

// Gallery configuration - Futószalag galéria
const galleryConfig = {
  carplay: {
    containerIds: ['carplay-slider-1'],
    imagePath: '../assets/images/services/auto_carplay/',
    images: []
  },
  retrofit: {
    containerIds: ['retrofit-slider-1'],
    imagePath: '../assets/images/services/kodolas/',
    images: []
  }
};

// DOM betöltés után inicializálás
document.addEventListener('DOMContentLoaded', function() {
    // Nyelv betöltése localStorage-ból
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    initializePage();
    initializeGalleries();
    initializeFullSoftwareGallery();
});

// Oldal inicializálása
function initializePage() {
    console.log('Software oldal inicializálása kezdődik...');
    
    // Saját services menü inicializálás a script.min.js helyett
    initializeLanguageSelector();
    initializeServicesMenu();
    initializeMobileMenu();
    
    initializeAnimations();
    initializeSmoothScrolling();
    initializeResizeHandler();
    
    // Copyright év frissítése
    updateCopyrightYear();
    
    console.log('Software oldal inicializálva - saját menü inicializálással');
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
    
    const flagContent = getFlagSvgContent(currentLanguage);
    
    if (flagSvg) flagSvg.innerHTML = flagContent;
    if (langText) langText.textContent = currentLanguage.toUpperCase();
    if (flagSvgMobile) flagSvgMobile.innerHTML = flagContent;
    if (langTextMobile) langTextMobile.textContent = currentLanguage.toUpperCase();
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

// Egyszerű oldal fordítása
function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }
        
        if (value && element.tagName === 'INPUT' && element.type === 'placeholder') {
            element.placeholder = value;
        } else if (value) {
            element.textContent = value;
        }
    });
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
            return '<svg viewBox="0 0 60 30" width="24" height="16"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" stroke-width="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102E" stroke-width="6"/></g></svg>';
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
    const servicesSelector = document.querySelector('.services-selector');
    
    // Desktop: biztosítsuk, hogy a konténer ne legyen hidden
    if (servicesSelector && window.innerWidth >= 640) {
        servicesSelector.classList.remove('hidden');
    }
    
    // Desktop szolgáltatások menü
    if (servicesBtn && servicesMenu) {
        servicesBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isHidden = servicesMenu.classList.contains('hidden');
            if (isHidden) {
                servicesMenu.classList.remove('hidden');
                servicesMenu.style.display = 'block';
                servicesMenu.style.visibility = 'visible';
                servicesMenu.style.opacity = '1';
                servicesMenu.style.position = 'absolute';
                servicesMenu.style.right = '0px';
                servicesMenu.style.top = '100%';
                servicesMenu.style.width = '18rem';
                servicesMenu.style.zIndex = '9999';
                servicesBtn.setAttribute('aria-expanded', 'true');
            } else {
                servicesMenu.classList.add('hidden');
                servicesMenu.style.display = '';
                servicesMenu.style.visibility = '';
                servicesMenu.style.opacity = '';
                servicesMenu.style.position = '';
                servicesMenu.style.right = '';
                servicesMenu.style.top = '';
                servicesMenu.style.width = '';
                servicesMenu.style.zIndex = '';
                servicesBtn.setAttribute('aria-expanded', 'false');
            }
        });
        servicesBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isHidden = servicesMenu.classList.contains('hidden');
                if (isHidden) {
                    servicesMenu.classList.remove('hidden');
                    servicesMenu.style.display = 'block';
                    servicesMenu.style.visibility = 'visible';
                    servicesMenu.style.opacity = '1';
                    servicesBtn.setAttribute('aria-expanded', 'true');
                } else {
                    servicesMenu.classList.add('hidden');
                    servicesMenu.style.display = '';
                    servicesMenu.style.visibility = '';
                    servicesMenu.style.opacity = '';
                    servicesBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
        servicesMenu.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    
    // Mobil szolgáltatások menü
    if (servicesBtnMobile && servicesMenuMobile) {
        servicesBtnMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            const isHidden = servicesMenuMobile.classList.contains('hidden');
            if (isHidden) {
                servicesMenuMobile.classList.remove('hidden');
                servicesMenuMobile.style.display = 'block';
                servicesMenuMobile.style.visibility = 'visible';
                servicesMenuMobile.style.opacity = '1';
                servicesBtnMobile.setAttribute('aria-expanded', 'true');
            } else {
                servicesMenuMobile.classList.add('hidden');
                servicesMenuMobile.style.display = '';
                servicesMenuMobile.style.visibility = '';
                servicesMenuMobile.style.opacity = '';
                servicesBtnMobile.setAttribute('aria-expanded', 'false');
            }
        });
        servicesMenuMobile.addEventListener('click', function(e) { e.stopPropagation(); });
    }
    
    // Kívülre kattintás esetén bezárás
    document.addEventListener('click', function(event) {
        const servicesSelector = document.querySelector('.services-selector');
        const servicesSelectorMobile = document.querySelector('.services-selector-mobile');
        if (servicesSelector && servicesMenu && !servicesSelector.contains(event.target)) {
            servicesMenu.classList.add('hidden');
            servicesBtn && servicesBtn.setAttribute('aria-expanded', 'false');
        }
        if (servicesSelectorMobile && servicesMenuMobile && !servicesSelectorMobile.contains(event.target)) {
            servicesMenuMobile.classList.add('hidden');
            servicesBtnMobile && servicesBtnMobile.setAttribute('aria-expanded', 'false');
        }
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
            const isActive = mobileMenu.classList.contains("active");
            hamburgerIcon.setAttribute("aria-expanded", isActive ? "true" : "false");
            if (menuOverlay) {
                if (isActive) {
                    menuOverlay.classList.add("active");
                } else {
                    menuOverlay.classList.remove("active");
                }
            }
        });
    }
    
    if (menuOverlay && mobileMenu && hamburgerIcon) {
        menuOverlay.addEventListener("click", function (e) {
            e.stopPropagation();
            mobileMenu.classList.remove("active");
            mobileMenu.classList.add("hidden");
            hamburgerIcon.classList.remove("active");
            hamburgerIcon.setAttribute("aria-expanded", "false");
            menuOverlay.classList.remove("active");
        });
    }
    
    if (mobileMenu && hamburgerIcon) {
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("active");
                mobileMenu.classList.add("hidden");
                hamburgerIcon.classList.remove("active");
                hamburgerIcon.setAttribute("aria-expanded", "false");
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
        
        console.log('Fallback smooth scroll inicializálva (Lenis nem elérhető)');
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

// Resize handler inicializálása
function initializeResizeHandler() {
    window.addEventListener('resize', debounce(() => {
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











// Initialize both galleries - Futószalag galéria
function initializeGalleries() {
  console.log('Initializing galleries...');
  
  // Initialize CarPlay Gallery Sliders
  const carplayImages = getImageFiles('carplay');
  console.log('CarPlay images:', carplayImages);
  
  galleryConfig.carplay.containerIds.forEach(id => {
    console.log('Initializing CarPlay slider:', id);
    // Shuffle images for each slider to create variety
    const shuffledImages = [...carplayImages].sort(() => Math.random() - 0.5);
    initSliderGallery({ containerId: id, imagePath: galleryConfig.carplay.imagePath, synchronized: true }, shuffledImages);
  });

  // Initialize Retrofit Gallery Sliders
  const retrofitImages = getImageFiles('retrofit');
  console.log('Retrofit images:', retrofitImages);
  
  galleryConfig.retrofit.containerIds.forEach(id => {
    console.log('Initializing Retrofit slider:', id);
    const shuffledImages = [...retrofitImages].sort(() => Math.random() - 0.5);
    initSliderGallery({ containerId: id, imagePath: galleryConfig.retrofit.imagePath }, shuffledImages);
  });
  
  console.log('Galleries initialized');
}

// Initialize a slider gallery
function initSliderGallery(config, imageFiles) {
  const container = document.getElementById(config.containerId);
  if (!container) return;

  const track = container.querySelector('.gallery-track');
  if (!track) return;

  // Clear existing content
  track.innerHTML = '';

  // Generate full image paths
  const fullPaths = imageFiles.map(filename => config.imagePath + filename);

  // We need to duplicate the images to create a seamless infinite scroll effect
  // Depending on the width, we might need to duplicate them more times
  // For safety, let's create enough duplicates to definitely cover the screen width multiple times
  const displayImages = [...fullPaths, ...fullPaths]; 

  // Calculate animation duration based on number of images to maintain consistent speed
  // Target: roughly 3 seconds per image
  const baseDuration = imageFiles.length * 3;
  
  if (config.synchronized) {
    // Synchronized movement: no randomness
    track.style.animationDuration = `${baseDuration}s`;
    track.style.animationDelay = '0s';
  } else {
    // Add slight randomness to speed so sliders don't move exactly in sync
    const randomFactor = 0.9 + Math.random() * 0.2; 
    track.style.animationDuration = `${baseDuration * randomFactor}s`;
    
    // Start at a random position
    track.style.animationDelay = `-${Math.random() * baseDuration}s`;
  }

  displayImages.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Gallery Image ${index + 1}`;
    img.className = 'gallery-item';
    img.loading = 'lazy';
    
    // Handle error to not break the layout (though empty space might appear)
    img.onerror = function() { 
      this.style.display = 'none'; 
    };

    track.appendChild(img);
  });

  // Optimization: Pause animation when not in viewport (Lazy Load / Performance)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Resume animation (remove inline pause, revert to CSS)
        track.style.animationPlayState = '';
      } else {
        // Pause animation to save resources
        track.style.animationPlayState = 'paused';
      }
    });
  }, { rootMargin: '50px 0px' }); // Start slightly before viewport

  observer.observe(container);
  
  // Set initial state to paused
  track.style.animationPlayState = 'paused';
}

// Get image files for each gallery type
function getImageFiles(galleryType) {
  if (galleryType === 'carplay') {
    return [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.JPG',
      '8.jpg'
    ];
  } else if (galleryType === 'retrofit') {
    return [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg'
    ];
  }
  return [];
}

// Export functions for global access
window.SoftwarePage = {
    changeLanguage,
    initializeGalleries,
    initSliderGallery
};

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGalleries,
    initSliderGallery,
    getImageFiles
  };
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
// Full Gallery Initialization for Software Page
function initializeFullSoftwareGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-gallery');
    
    if (!galleryGrid) return;

    // Image lists
    const carplayImages = [
      '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.JPG', '8.jpg'
    ].map(img => '../assets/images/services/auto_carplay/' + img);

    const codingImages = [
      '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'
    ].map(img => '../assets/images/services/kodolas/' + img);

    const hiddenFeaturesImages = [
      '1.jpg', '2.jpg', '3.jpg', '4.JPG', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', 
      '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg'
    ].map(img => '../assets/images/services/rejtett_extrak/' + img);
    
    // Combine and shuffle
    const allImages = [...carplayImages, ...codingImages, ...hiddenFeaturesImages].sort(() => Math.random() - 0.5);
    
    // Config
    const itemsPerPage = 12;
    let currentPage = 0;
    
    function renderImages() {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const imagesToShow = allImages.slice(start, end);
        
        imagesToShow.forEach(src => {
            const a = document.createElement('a');
            a.href = src;
            a.dataset.fancybox = 'gallery';
            a.className = 'block overflow-hidden rounded-lg shadow-lg hover:opacity-90 transition-opacity h-64';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Szoftver galéria kép';
            img.className = 'w-full h-full object-cover transform hover:scale-105 transition-transform duration-500';
            img.loading = 'lazy';
            
            a.appendChild(img);
            galleryGrid.appendChild(a);
        });
        
        currentPage++;
        
        // Hide button if no more images
        if (currentPage * itemsPerPage >= allImages.length) {
            if(loadMoreBtn) loadMoreBtn.classList.add('hidden');
        } else {
            if(loadMoreBtn) loadMoreBtn.classList.remove('hidden');
        }
    }
    
    // Initial render
    renderImages();
    
    // Button event
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', renderImages);
    }
    
    // Bind Fancybox
  if (typeof Fancybox !== 'undefined') {
      Fancybox.bind('[data-fancybox]', {
          Toolbar: {
              display: {
                  left: ['infobar'],
                  middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
                  right: ['slideshow', 'thumbs', 'close'],
              },
          },
           Images: {
              zoom: true,
           },
      });
  }
}
})();
 

