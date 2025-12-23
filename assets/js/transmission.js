// Transmission.js - Transmission oldal specifikus JavaScript funkciók

// Globális változók
let currentSlide = 0;
let totalSlides = 0;
let isAutoPlaying = true;
let autoPlayInterval;
let resizeTimeout;
let currentLanguage = "hu";

// Gallery configuration - Futószalag galéria
const galleryConfig = {
  transmission: {
    containerIds: ['transmission-slider-1'],
    imagePath: '../assets/images/services/valto_olaj_csere/',
    images: []
  },
  timing: {
    containerIds: ['timing-slider-1'],
    imagePath: '../assets/images/services/vezerles_csapagy_csere/',
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
    initializeFullTransmissionGallery();
});

// Oldal inicializálása
function initializePage() {
    console.log('Transmission oldal inicializálása kezdődik...');
    
    // Saját services menü inicializálás a script.min.js helyett
    initializeLanguageSelector();
    initializeServicesMenu();
    initializeMobileMenu();
    
    initializeAnimations();
    initializeSmoothScrolling();
    initializeResizeHandler();
    
    // Copyright év frissítése
    updateCopyrightYear();
    
    console.log('Transmission oldal inicializálva - saját menü inicializálással');
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
                if (lang) {
                    changeLanguage(lang);
                }
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
                if (lang) {
                    changeLanguage(lang);
                }
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
    
    // Nyelvi választó mobil verzió kattintás eseményei már inicializálva van a fenti kódban
    
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
    
    // Services menü mobil verzió kattintás eseményei
    if (servicesMenuMobile) {
        servicesMenuMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                servicesMenuMobile.classList.add('hidden');
            });
        });
    }
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

// Initialize both galleries
function initializeGalleries() {
  const transmissionImages = getImageFiles('transmission');
  galleryConfig.transmission.containerIds.forEach(id => {
    const shuffledImages = [...transmissionImages].sort(() => Math.random() - 0.5);
    initSliderGallery({ containerId: id, imagePath: galleryConfig.transmission.imagePath, synchronized: true }, shuffledImages);
  });

  const timingImages = getImageFiles('timing');
  galleryConfig.timing.containerIds.forEach(id => {
    const shuffledImages = [...timingImages].sort(() => Math.random() - 0.5);
    initSliderGallery({ containerId: id, imagePath: galleryConfig.timing.imagePath, synchronized: true }, shuffledImages);
  });
}

function initSliderGallery(config, imageFiles) {
  const container = document.getElementById(config.containerId);
  if (!container) return;

  const track = container.querySelector('.gallery-track');
  if (!track) return;

  track.innerHTML = '';

  const fullPaths = imageFiles.map(filename => config.imagePath + filename);
  const displayImages = [...fullPaths, ...fullPaths];

  const baseDuration = Math.max(1, imageFiles.length) * 3;

  if (config.synchronized) {
    track.style.animationDuration = `${baseDuration}s`;
    track.style.animationDelay = '0s';
  } else {
    const randomFactor = 0.9 + Math.random() * 0.2;
    track.style.animationDuration = `${baseDuration * randomFactor}s`;
    track.style.animationDelay = `-${Math.random() * baseDuration}s`;
  }

  displayImages.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Galéria kép ${index + 1}`;
    img.loading = 'lazy';
    img.classList.add('gallery-item');

    img.onerror = function () {
      this.style.display = 'none';
    };

    track.appendChild(img);
  });
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

// Resize handler inicializálása
function initializeResizeHandler() {
    window.addEventListener('resize', debounce(() => {
        // Mobil menü bezárása desktop nézeten
        if (window.innerWidth >= 768) {
            const mobileMenu = document.getElementById('mobile-menu');
            const hamburgerIcon = document.querySelector('.hamburger-icon');
            const menuOverlay = document.querySelector('.menu-overlay');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('active');
                    hamburgerIcon.setAttribute('aria-expanded', 'false');
                    const icon = hamburgerIcon.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars text-2xl';
                }
                if (menuOverlay) menuOverlay.classList.remove('active');
            }
        }
    }, 250));
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
      '8.JPG',
      '9.jpg'
    ];
  } else if (galleryType === 'timing') {
    return [
      '1.JPG',
      '2.JPG',
      '3.JPG',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.JPG',
      '9.jpg',
      '10.jpg'
    ];
  }
  return [];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGalleries,
    initSliderGallery,
    getImageFiles
  };
}
// Full Gallery Initialization for Transmission Page
function initializeFullTransmissionGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-gallery');
    
    if (!galleryGrid) return;

    // Image lists
    const transmissionImages = [
      '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.JPG', '8.JPG', '9.jpg'
    ].map(img => '../assets/images/services/valto_olaj_csere/' + img);

    const timingImages = [
      '1.JPG', '2.JPG', '3.JPG', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.JPG', '9.jpg', '10.jpg'
    ].map(img => '../assets/images/services/vezerles_csapagy_csere/' + img);
    
    // Combine and shuffle
    const allImages = [...transmissionImages, ...timingImages].sort(() => Math.random() - 0.5);
    
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
            img.alt = 'Váltó és hajtás galéria kép';
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

