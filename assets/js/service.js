// Service page functionality

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  initializeGalleries();
  initializeAnimations();
});

// Page initialization
function initializePage() {
  // A nyelvi választó, mobil menü és szolgáltatások menü már a script.min.js-ben van inicializálva
  
  // Ellenőrizzük, hogy a szolgáltatások menüpont megfelelően működik-e
  const servicesSelector = document.querySelector(".services-selector");
  const servicesSelectorBtn = document.querySelector(".services-selector-btn");
  const servicesMenu = document.querySelector("#services-menu");
  
  if (servicesSelector && servicesSelectorBtn && servicesMenu) {
    // Eltávolítjuk a script.min.js által hozzáadott event listener-t
    const newBtn = servicesSelectorBtn.cloneNode(true);
    servicesSelectorBtn.parentNode.replaceChild(newBtn, servicesSelectorBtn);
    
    // Service oldalon: saját click handler a pozicionálási problémák elkerülésére
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Töröljük a JavaScript által beállított pozíciókat
      if (servicesMenu.style.left) {
        servicesMenu.style.removeProperty('left');
      }
      if (servicesMenu.style.top) {
        servicesMenu.style.removeProperty('top');
      }
      
      // Toggle a menüpont megjelenítése
      const isHidden = servicesMenu.classList.contains('hidden');
      if (isHidden) {
        servicesMenu.classList.remove('hidden');
        newBtn.setAttribute('aria-expanded', 'true');
      } else {
        servicesMenu.classList.add('hidden');
        newBtn.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Click outside handler a menüpont bezárásához
    document.addEventListener('click', function(event) {
      if (!servicesSelector.contains(event.target)) {
        if (!servicesMenu.classList.contains('hidden')) {
          servicesMenu.classList.add('hidden');
          newBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Escape key handler
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        if (!servicesMenu.classList.contains('hidden')) {
          servicesMenu.classList.add('hidden');
          newBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
}

// Gallery configuration
const galleryConfig = {
  service: {
    containerId: 'service-gallery',
    imagePath: '../assets/images/services/kisebb_szervizek/',
    images: [],
    currentIndex: 0,
    interval: null
  },
  maintenance: {
    containerId: 'maintenance-gallery',
    imagePath: '../assets/images/services/fekek/',
    images: [],
    currentIndex: 0,
    interval: null
  }
};

// Auto-slide intervals (different for each gallery)
const SLIDE_INTERVALS = {
  service: 3500,
  maintenance: 3500
};

// Initialize galleries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGalleries();
});

// Initialize both galleries
function initializeGalleries() {
  ['service', 'maintenance'].forEach(galleryType => {
    const containerId = galleryConfig[galleryType].containerId;
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Gallery container ${containerId} not found`);
      return;
    }
    // Ha grid layout van (statikus képek), ne töltsünk dinamikusan és ne indítsunk slideshow-t
    if (container.classList.contains('grid')) {
      console.log(`Grid layout detected for ${galleryType}, skipping dynamic image creation`);
      return;
    }
    loadGalleryImages(galleryType);
  });
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
    console.warn(`No images found for gallery type: ${galleryType}`);
    return;
  }

  // Store image files in config
  config.images = imageFiles.map(filename => config.imagePath + filename);
  
  // Create gallery images
  createGalleryImages(galleryType);
  
  // Start auto-slide
  startAutoSlide(galleryType);
  
  // Remove loading state
  setTimeout(() => {
    container.classList.remove('gallery-loading');
  }, 500);
}

// Get image files for each gallery type
function getImageFiles(galleryType) {
  if (galleryType === 'service') {
    return [
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '13.jpg'
    ];
  } else if (galleryType === 'maintenance') {
    return [
      '1.jpg',
      '3.jpg',
      '4.JPG',
      '7.jpg',
      '11.jpg',
      '12.jpg'
    ];
  }
  return [];
}

// Create gallery images
function createGalleryImages(galleryType) {
  const config = galleryConfig[galleryType];
  const container = document.getElementById(config.containerId);
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create image elements
  config.images.forEach((imageSrc, index) => {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `${galleryType} galéria kép ${index + 1}`;
    img.loading = 'lazy';
    img.className = `gallery-image ${index === 0 ? 'active' : 'inactive'}`;
    img.onerror = function() { this.style.display = 'none'; };

    container.appendChild(img);
  });
}

// Show specific image
function showImage(galleryType, index) {
  const config = galleryConfig[galleryType];
  const container = document.getElementById(config.containerId);
  const images = container.querySelectorAll('.gallery-image');
  
  images.forEach((img, i) => {
    if (i === index) {
      img.classList.add('active');
      img.classList.remove('inactive');
    } else {
      img.classList.add('inactive');
      img.classList.remove('active');
    }
  });
  
  config.currentIndex = index;
}

// Start auto-slide
function startAutoSlide(galleryType) {
  const config = galleryConfig[galleryType];
  const interval = SLIDE_INTERVALS[galleryType] || 5000;
  
  config.interval = setInterval(() => {
    nextRandomImage(galleryType);
  }, interval);
}

// Show next random image
function nextRandomImage(galleryType) {
  const config = galleryConfig[galleryType];
  if (config.images.length <= 1) return;
  
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * config.images.length);
  } while (nextIndex === config.currentIndex);
  
  showImage(galleryType, nextIndex);
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
  if (!galleryConfig[galleryType].interval) {
    startAutoSlide(galleryType);
  }
}

// Pause galleries when page becomes hidden
document.addEventListener('DOMContentLoaded', function() {
  // Pause on mouse hover
  Object.keys(galleryConfig).forEach(galleryType => {
    const container = document.getElementById(galleryConfig[galleryType].containerId);
    if (container) {
      container.addEventListener('mouseenter', () => pauseAutoSlide(galleryType));
      container.addEventListener('mouseleave', () => resumeAutoSlide(galleryType));
    }
  });
});

// Clean up intervals when page unloads
window.addEventListener('beforeunload', function() {
  Object.keys(galleryConfig).forEach(galleryType => {
    pauseAutoSlide(galleryType);
  });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    Object.keys(galleryConfig).forEach(galleryType => {
      pauseAutoSlide(galleryType);
    });
  } else {
    Object.keys(galleryConfig).forEach(galleryType => {
      resumeAutoSlide(galleryType);
    });
  }
});

// Handle responsive images
function handleResponsiveImages() {
  const galleries = document.querySelectorAll('[id$="-gallery"]');
  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img');
    images.forEach(img => {
      img.style.objectFit = window.innerWidth < 768 ? 'cover' : 'cover';
    });
  });
}

document.addEventListener('DOMContentLoaded', handleResponsiveImages);
window.addEventListener('resize', handleResponsiveImages);

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