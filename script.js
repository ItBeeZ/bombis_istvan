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
                    element.textContent = translation;
                }
            } else {
                element.textContent = translation;
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
