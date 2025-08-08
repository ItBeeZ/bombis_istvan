// Software page gallery functionality

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

// Initialize galleries when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGalleries();
});

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
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create images
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

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeGalleries,
    nextRandomImage,
    pauseAutoSlide,
    resumeAutoSlide
  };
}