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
    imagePath: '../assets/images/services/Általános szerviz/',
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
  service: 1500,
  maintenance: 3500
};

// Initialize galleries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGalleries();
});

// Initialize both galleries
function initializeGalleries() {
  const serviceContainer = document.getElementById(galleryConfig.service.containerId);
  if (serviceContainer) {
    initServiceGridGallery();
  }
  const maintenanceContainer = document.getElementById(galleryConfig.maintenance.containerId);
  if (maintenanceContainer) {
    initMaintenanceGridGallery();
  }
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
      'IMG_9940.jpg',
      'IMG_9934.jpg',
      'IMG_9829.JPG',
      'IMG_9787.jpg',
      'IMG_9077.jpg',
      'IMG_8897.jpg',
      'IMG_8755.jpg',
      'IMG_8749.JPG',
      'IMG_8836.jpg',
      'IMG_8787.jpg',
      'IMG_8631.jpg',
      'IMG_4945.jpg',
      'IMG_4944.jpg',
      'IMG_4942.jpg',
      'IMG_4941.jpg',
      'IMG_4783.jpg',
      'IMG_3737.jpg',
      'IMG_4047.jpg',
      'IMG_3748.jpg',
      'IMG_3639.jpg',
      'IMG_3638.jpg',
      'IMG_3640.jpg',
      'IMG_3736.jpg',
      'IMG_2341.jpg',
      'IMG_2320.jpg',
      'IMG_3299.jpg',
      'IMG_1823.jpg',
      'IMG_2276.jpg',
      'IMG_2251.jpg',
      'IMG_1759.jpg',
      'IMG_1762.jpg',
      'IMG_1776.jpg',
      'IMG_1391.jpg',
      'IMG_1466.jpg',
      'IMG_0776.jpg',
      'IMG_0567.jpg',
      'IMG_1226.jpg',
      'IMG_0562.jpg',
      'IMG_0563.jpg',
      'IMG_0557.jpg',
      'IMG_0556.jpg',
      'IMG_0550.jpg',
      'IMG_0549.jpg',
      'att.885U7SDgmJ5iXL0-57MkaQ0BUaZ7i5Dv-rsSrqfPddg.JPG',
      'att.885U7SDgmJ5iXL0-57MkaQ0BUaZ7i5Dv-rsSrqfPddg(1).jpg'
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

let serviceGridState = {
  slotEls: [],
  currentIndices: [],
  nextCursor: 0,
  interval: null,
  preloaded: new Map()
};

function initServiceGridGallery() {
  const container = document.getElementById(galleryConfig.service.containerId);
  const slots = container.querySelectorAll('.gallery-image-container img');
  serviceGridState.slotEls = Array.from(slots);
  const files = getImageFiles('service');
  galleryConfig.service.images = files.map(f => galleryConfig.service.imagePath + f);
  const last = sessionStorage.getItem('serviceGalleryLastIndices');
  let lastIndices = null;
  if (last) {
    try { lastIndices = JSON.parse(last); } catch (_) { lastIndices = null; }
  }
  const count = Math.min(3, galleryConfig.service.images.length);
  let indices = getRandomUniqueIndices(count, galleryConfig.service.images.length);
  if (lastIndices && Array.isArray(lastIndices) && lastIndices.length === count) {
    let attempts = 0;
    while (arraysEqual(indices, lastIndices) && attempts < 10) {
      indices = getRandomUniqueIndices(count, galleryConfig.service.images.length);
      attempts++;
    }
  }
  serviceGridState.currentIndices = indices.slice();
  sessionStorage.setItem('serviceGalleryLastIndices', JSON.stringify(indices));
  let nc = Math.floor(Math.random() * galleryConfig.service.images.length);
  const used = new Set(serviceGridState.currentIndices);
  let guard = 0;
  while (used.has(nc) && guard < galleryConfig.service.images.length) { nc = (nc + 1) % galleryConfig.service.images.length; guard++; }
  serviceGridState.nextCursor = nc;
  serviceGridState.slotEls.forEach((imgEl, i) => {
    const src = galleryConfig.service.images[serviceGridState.currentIndices[i]];
    imgEl.src = src;
    imgEl.loading = 'lazy';
    imgEl.onerror = function() { updateServiceSlot(i, true); };
  });
  preloadServiceImages();
  startServiceAuto();
}

function preloadServiceImages() {
  galleryConfig.service.images.forEach(src => {
    if (!serviceGridState.preloaded.has(src)) {
      const img = new Image();
      img.src = src;
      serviceGridState.preloaded.set(src, img);
    }
  });
}

function startServiceAuto() {
  if (serviceGridState.interval) return;
  let slotToUpdate = 0;
  serviceGridState.interval = setInterval(() => {
    updateServiceSlot(slotToUpdate, false);
    slotToUpdate = (slotToUpdate + 1) % serviceGridState.slotEls.length;
  }, SLIDE_INTERVALS.service);
}

function updateServiceSlot(slotIndex, skipError) {
  if (galleryConfig.service.images.length < 3) return;
  const used = new Set(serviceGridState.currentIndices);
  let tries = 0;
  let idx = serviceGridState.nextCursor;
  while ((used.has(idx)) && tries < galleryConfig.service.images.length) {
    idx = (idx + 1) % galleryConfig.service.images.length;
    tries++;
  }
  serviceGridState.nextCursor = (idx + 1) % galleryConfig.service.images.length;
  const imgEl = serviceGridState.slotEls[slotIndex];
  const newSrc = galleryConfig.service.images[idx];
  const interval = SLIDE_INTERVALS.service;
  const swapDelay = Math.max(0, Math.min(150, interval - 10));
  const fadeDuration = Math.max(0, Math.min(200, interval - 50));
  imgEl.classList.add('slot-fade-out');
  setTimeout(() => {
    imgEl.src = newSrc;
    imgEl.classList.remove('slot-fade-out');
    imgEl.classList.add('slot-fade-in');
    setTimeout(() => {
      imgEl.classList.remove('slot-fade-in');
    }, fadeDuration);
  }, swapDelay);
  serviceGridState.currentIndices[slotIndex] = idx;
}

function getRandomUniqueIndices(count, max) {
  const arr = [];
  const used = new Set();
  while (arr.length < count && used.size < max) {
    const r = Math.floor(Math.random() * max);
    if (!used.has(r)) { used.add(r); arr.push(r); }
  }
  return arr;
}

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false; }
  return true;
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
  if (serviceGridState.interval) {
    clearInterval(serviceGridState.interval);
    serviceGridState.interval = null;
  }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    Object.keys(galleryConfig).forEach(galleryType => {
      pauseAutoSlide(galleryType);
    });
    if (serviceGridState.interval) {
      clearInterval(serviceGridState.interval);
      serviceGridState.interval = null;
    }
  } else {
    Object.keys(galleryConfig).forEach(galleryType => {
      resumeAutoSlide(galleryType);
    });
    startServiceAuto();
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
// Maintenance grid slideshow state and init
let maintenanceGridState = {
  slotEls: [],
  currentIndices: [],
  nextCursor: 0,
  interval: null,
  preloaded: new Map()
};

function initMaintenanceGridGallery() {
  const container = document.getElementById(galleryConfig.maintenance.containerId);
  const slots = container.querySelectorAll('.gallery-image-container img');
  maintenanceGridState.slotEls = Array.from(slots);
  const files = getImageFiles('maintenance');
  galleryConfig.maintenance.images = files.map(f => galleryConfig.maintenance.imagePath + f);
  const last = sessionStorage.getItem('maintenanceGalleryLastIndices');
  let lastIndices = null;
  if (last) { try { lastIndices = JSON.parse(last); } catch (_) { lastIndices = null; } }
  const count = Math.min(3, galleryConfig.maintenance.images.length);
  let indices = getRandomUniqueIndices(count, galleryConfig.maintenance.images.length);
  if (lastIndices && Array.isArray(lastIndices) && lastIndices.length === count) {
    let attempts = 0;
    while (arraysEqual(indices, lastIndices) && attempts < 10) {
      indices = getRandomUniqueIndices(count, galleryConfig.maintenance.images.length);
      attempts++;
    }
  }
  maintenanceGridState.currentIndices = indices.slice();
  sessionStorage.setItem('maintenanceGalleryLastIndices', JSON.stringify(indices));
  let nc = Math.floor(Math.random() * galleryConfig.maintenance.images.length);
  const used = new Set(maintenanceGridState.currentIndices);
  let guard = 0;
  while (used.has(nc) && guard < galleryConfig.maintenance.images.length) { nc = (nc + 1) % galleryConfig.maintenance.images.length; guard++; }
  maintenanceGridState.nextCursor = nc;
  maintenanceGridState.slotEls.forEach((imgEl, i) => {
    const src = galleryConfig.maintenance.images[maintenanceGridState.currentIndices[i]];
    imgEl.src = src;
    imgEl.loading = 'lazy';
    imgEl.onerror = function() { updateMaintenanceSlot(i, true); };
  });
  preloadMaintenanceImages();
  startMaintenanceAuto();
}

function preloadMaintenanceImages() {
  galleryConfig.maintenance.images.forEach(src => {
    if (!maintenanceGridState.preloaded.has(src)) {
      const img = new Image();
      img.src = src;
      maintenanceGridState.preloaded.set(src, img);
    }
  });
}

function startMaintenanceAuto() {
  if (maintenanceGridState.interval) return;
  let slotToUpdate = 0;
  const interval = SLIDE_INTERVALS.maintenance || 3500;
  maintenanceGridState.interval = setInterval(() => {
    updateMaintenanceSlot(slotToUpdate, false);
    slotToUpdate = (slotToUpdate + 1) % maintenanceGridState.slotEls.length;
  }, interval);
}

function updateMaintenanceSlot(slotIndex, skipError) {
  if (galleryConfig.maintenance.images.length < 3) return;
  const used = new Set(maintenanceGridState.currentIndices);
  let tries = 0;
  let idx = maintenanceGridState.nextCursor;
  while ((used.has(idx)) && tries < galleryConfig.maintenance.images.length) {
    idx = (idx + 1) % galleryConfig.maintenance.images.length;
    tries++;
  }
  maintenanceGridState.nextCursor = (idx + 1) % galleryConfig.maintenance.images.length;
  const imgEl = maintenanceGridState.slotEls[slotIndex];
  const newSrc = galleryConfig.maintenance.images[idx];
  const interval = SLIDE_INTERVALS.maintenance || 3500;
  const swapDelay = Math.max(0, Math.min(150, interval - 10));
  const fadeDuration = Math.max(0, Math.min(200, interval - 50));
  imgEl.classList.add('slot-fade-out');
  setTimeout(() => {
    imgEl.src = newSrc;
    imgEl.classList.remove('slot-fade-out');
    imgEl.classList.add('slot-fade-in');
    setTimeout(() => {
      imgEl.classList.remove('slot-fade-in');
    }, fadeDuration);
  }, swapDelay);
  maintenanceGridState.currentIndices[slotIndex] = idx;
}
