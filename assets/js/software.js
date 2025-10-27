// Software.js - Szoftver oldal specifikus JavaScript funkciók

// Globális változók
let currentSlide = 0;
let totalSlides = 0;
let isAutoPlaying = true;
let autoPlayInterval;
let resizeTimeout;
let currentLanguage = "hu";

// Gallery configuration
const galleryConfig = {
  transmission: {
    containerId: 'transmission-gallery',
    imagePath: '../assets/images/services/auto_carplay/',
    images: [],
    currentIndex: 0,
    interval: null
  },
  retrofit: {
    containerId: 'retrofit-gallery',
    imagePath: '../assets/images/services/rejtett_extrak/',
    images: [],
    currentIndex: 0,
    interval: null
  }
};

// Auto-slide interval (different for each gallery)
const SLIDE_INTERVALS = {
  transmission: 4000,
  retrofit: 5000
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











// Initialize all galleries
function initializeGalleries() {
  loadGalleryImages('transmission');
  loadGalleryImages('retrofit');
}

// Load images for a specific gallery
function loadGalleryImages(galleryType) {
  const config = galleryConfig[galleryType];
  const container = document.getElementById(config.containerId);
  
  if (!container) {
    console.warn(`Gallery container ${config.containerId} not found`);
    return;
  }

  // Add loading state
  container.classList.add('gallery-loading');
  
  // Define image lists based on gallery type
  const imageFiles = getImageFiles(galleryType);
  
  if (imageFiles.length === 0) {
    console.warn(`No images found for ${galleryType} gallery`);
    container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Nincsenek elérhető képek</div>';
    return;
  }

  config.images = imageFiles;
  
  // Create image elements
  createGalleryImages(galleryType);
  
  // Start with random image
  const randomStartIndex = Math.floor(Math.random() * config.images.length);
  config.currentIndex = randomStartIndex;
  
  // Show initial image
  showImage(galleryType, config.currentIndex);
  
  // Remove loading state
  container.classList.remove('gallery-loading');
  
  // Start auto-slide
  startAutoSlide(galleryType);
}

// Get image files for specific gallery type
function getImageFiles(galleryType) {
  if (galleryType === 'transmission') {
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
      '4.JPG',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '11.jpg',
      '12.jpg',
      '13.jpg',
      '14.jpg',
      '15.jpg',
      '17.jpg',
      '18.jpg',
      '19.jpg',
      '20.jpg',
      '21.jpg'
    ];
  }
  return [];
}

// Create image elements for gallery
function createGalleryImages(galleryType) {
  const config = galleryConfig[galleryType];
  const container = document.getElementById(config.containerId);
  
  // Check if container already has grid layout (static images)
  if (container.classList.contains('grid')) {
    console.log(`Grid layout detected for ${galleryType}, skipping dynamic image creation`);
    return;
  }
  
  // Clear existing content only for slideshow galleries
  container.innerHTML = '';
  
  // Create images for slideshow
  config.images.forEach((imageName, index) => {
    const img = document.createElement('img');
    img.src = `${config.imagePath}${imageName}`;
    img.alt = `${galleryType} galéria kép ${index + 1}`;
    img.className = `gallery-image ${index === 0 ? 'active' : 'inactive'}`;
    img.loading = 'lazy';
    
    // Add error handling
    img.onerror = function() {
      console.warn(`Failed to load image: ${this.src}`);
      this.style.display = 'none';
    };
    
    container.appendChild(img);
  });
}

// Show specific image in gallery
function showImage(galleryType, index) {
  const config = galleryConfig[galleryType];
  const container = document.getElementById(config.containerId);
  const images = container.querySelectorAll('.gallery-image');
  
  images.forEach((img, i) => {
    if (i === index) {
      img.classList.remove('inactive');
      img.classList.add('active');
    } else {
      img.classList.remove('active');
      img.classList.add('inactive');
    }
  });
  
  config.currentIndex = index;
}

// Start auto-slide for gallery
function startAutoSlide(galleryType) {
  const config = galleryConfig[galleryType];
  const interval = SLIDE_INTERVALS[galleryType] || 5000;
  
  // Clear existing interval
  if (config.interval) {
    clearInterval(config.interval);
  }
  
  config.interval = setInterval(() => {
    nextRandomImage(galleryType);
  }, interval);
}

// Show next random image
function nextRandomImage(galleryType) {
  const config = galleryConfig[galleryType];
  
  if (config.images.length <= 1) return;
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * config.images.length);
  } while (newIndex === config.currentIndex);
  
  showImage(galleryType, newIndex);
}

// Pause auto-slide
function pauseAutoSlide(galleryType) {
  const config = galleryConfig[galleryType];
  if (config.interval) {
    clearInterval(config.interval);
    config.interval = null;
  }
}

// Resume auto-slide
function resumeAutoSlide(galleryType) {
  startAutoSlide(galleryType);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pause all galleries when page is hidden
    Object.keys(galleryConfig).forEach(galleryType => {
      pauseAutoSlide(galleryType);
    });
  } else {
    // Resume all galleries when page is visible
    Object.keys(galleryConfig).forEach(galleryType => {
      resumeAutoSlide(galleryType);
    });
  }
});

// Clean up intervals before page unload
window.addEventListener('beforeunload', function() {
  Object.keys(galleryConfig).forEach(galleryType => {
    pauseAutoSlide(galleryType);
  });
});

// Handle responsive images
function handleResponsiveImages() {
  const galleries = document.querySelectorAll('[id$="-gallery"]');
  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img');
    images.forEach(img => {
      if (window.innerWidth < 768) {
        img.style.objectFit = 'cover';
      } else {
        img.style.objectFit = 'cover';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', handleResponsiveImages);
window.addEventListener('resize', handleResponsiveImages);

// Export functions for global access
window.SoftwarePage = {
    changeLanguage,
    nextRandomImage,
    pauseAutoSlide,
    resumeAutoSlide
};

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGalleries,
    nextRandomImage,
    pauseAutoSlide,
    resumeAutoSlide
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