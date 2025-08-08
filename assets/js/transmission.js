// Transmission page gallery functionality

// Gallery configuration
const galleryConfig = {
  transmission: {
    containerId: 'transmission-gallery',
    imagePath: '../assets/images/services/valto_olaj_csere/',
    images: [],
    currentIndex: 0,
    interval: null
  },
  timing: {
    containerId: 'timing-gallery',
    imagePath: '../assets/images/services/vezerles_csapagy_csere/',
    images: [],
    currentIndex: 0,
    interval: null
  }
};

// Auto-slide interval (5 seconds)
const SLIDE_INTERVAL = 5000;

// Initialize galleries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGalleries();
});

// Initialize both galleries
function initializeGalleries() {
  loadGalleryImages('transmission');
  loadGalleryImages('timing');
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

// Create image elements in the gallery container
function createGalleryImages(galleryType) {
  const config = galleryConfig[galleryType];
  const container = document.getElementById(config.containerId);
  
  // Clear container
  container.innerHTML = '';
  
  // Create image elements
  config.images.forEach((imageName, index) => {
    const img = document.createElement('img');
    img.src = config.imagePath + imageName;
    img.alt = `${galleryType} galéria kép ${index + 1}`;
    img.loading = 'lazy';
    img.style.opacity = '0';
    
    // Handle image load errors
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
  const images = container.querySelectorAll('img');
  
  // Hide all images
  images.forEach(img => {
    img.classList.remove('active', 'fade-in');
    img.style.opacity = '0';
  });
  
  // Show current image
  if (images[index]) {
    images[index].classList.add('active', 'fade-in');
    images[index].style.opacity = '1';
  }
}

// Start auto-slide for gallery
function startAutoSlide(galleryType) {
  const config = galleryConfig[galleryType];
  
  // Clear existing interval
  if (config.interval) {
    clearInterval(config.interval);
  }
  
  // Start new interval
  config.interval = setInterval(() => {
    nextRandomImage(galleryType);
  }, SLIDE_INTERVAL);
}

// Move to next random image
function nextRandomImage(galleryType) {
  const config = galleryConfig[galleryType];
  
  if (config.images.length <= 1) return;
  
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * config.images.length);
  } while (newIndex === config.currentIndex);
  
  config.currentIndex = newIndex;
  showImage(galleryType, config.currentIndex);
}

// Pause auto-slide when user hovers over gallery
function pauseAutoSlide(galleryType) {
  const config = galleryConfig[galleryType];
  if (config.interval) {
    clearInterval(config.interval);
    config.interval = null;
  }
}

// Resume auto-slide when user stops hovering
function resumeAutoSlide(galleryType) {
  startAutoSlide(galleryType);
}

// Add hover event listeners to pause/resume auto-slide
document.addEventListener('DOMContentLoaded', function() {
  const transmissionGallery = document.getElementById('transmission-gallery');
  const timingGallery = document.getElementById('timing-gallery');
  
  if (transmissionGallery) {
    transmissionGallery.addEventListener('mouseenter', () => pauseAutoSlide('transmission'));
    transmissionGallery.addEventListener('mouseleave', () => resumeAutoSlide('transmission'));
  }
  
  if (timingGallery) {
    timingGallery.addEventListener('mouseenter', () => pauseAutoSlide('timing'));
    timingGallery.addEventListener('mouseleave', () => resumeAutoSlide('timing'));
  }
});

// Clean up intervals when page is unloaded
window.addEventListener('beforeunload', function() {
  Object.values(galleryConfig).forEach(config => {
    if (config.interval) {
      clearInterval(config.interval);
    }
  });
});

// Handle visibility change (pause when tab is not active)
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pause all galleries
    Object.keys(galleryConfig).forEach(galleryType => {
      pauseAutoSlide(galleryType);
    });
  } else {
    // Resume all galleries
    Object.keys(galleryConfig).forEach(galleryType => {
      resumeAutoSlide(galleryType);
    });
  }
});

// Responsive image handling
function handleResponsiveImages() {
  const galleries = document.querySelectorAll('.gallery-container');
  
  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img');
    images.forEach(img => {
      img.style.objectFit = 'cover';
      img.style.width = '100%';
      img.style.height = '100%';
    });
  });
}

// Initialize responsive handling
document.addEventListener('DOMContentLoaded', handleResponsiveImages);
window.addEventListener('resize', handleResponsiveImages);

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGalleries,
    nextRandomImage,
    pauseAutoSlide,
    resumeAutoSlide
  };
}