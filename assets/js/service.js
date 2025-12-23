// Service page functionality

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  initializeGalleries();
  initializeFullGallery();
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
    containerIds: ['service-slider-1'],
    imagePath: '../assets/images/services/Általános szerviz/Éves szerviz/',
    images: []
  },
  maintenance: {
    containerIds: ['maintenance-slider-1', 'maintenance-slider-2', 'maintenance-slider-3'],
    imagePath: '../assets/images/services/Általános szerviz/Fék futómű/',
    images: []
  }
};

// Initialize both galleries
function initializeGalleries() {
  // Initialize Service Gallery Sliders
  const serviceImages = getImageFiles('service');
  galleryConfig.service.containerIds.forEach(id => {
    // Shuffle images for each slider to create variety
    const shuffledImages = [...serviceImages].sort(() => Math.random() - 0.5);
    initSliderGallery({ containerId: id, imagePath: galleryConfig.service.imagePath, synchronized: true }, shuffledImages);
  });

  // Initialize Maintenance Gallery Sliders
  const maintenanceImages = getImageFiles('maintenance');
  galleryConfig.maintenance.containerIds.forEach(id => {
    const shuffledImages = [...maintenanceImages].sort(() => Math.random() - 0.5);
    initSliderGallery({ containerId: id, imagePath: galleryConfig.maintenance.imagePath }, shuffledImages);
  });
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
  if (galleryType === 'service') {
    return [
      'att.885U7SDgmJ5iXL0-57MkaQ0BUaZ7i5Dv-rsSrqfPddg-1.jpg',
      'att.885U7SDgmJ5iXL0-57MkaQ0BUaZ7i5Dv-rsSrqfPddg.jpg',
      'IMG_0550.jpg',
      'IMG_0557.jpg',
      'IMG_0562.jpg',
      'IMG_0563.jpg',
      'IMG_0567.jpg',
      'IMG_0776.jpg',
      'IMG_1226.jpg',
      'IMG_1391.jpg',
      'IMG_1466.jpg',
      'IMG_1759.jpg',
      'IMG_1762.jpg',
      'IMG_1776.jpg',
      'IMG_2341.jpg',
      'IMG_3299.jpg',
      'IMG_3441.jpg',
      'IMG_3442.jpg',
      'IMG_3638.jpg',
      'IMG_3639.jpg',
      'IMG_3912.jpg',
      'IMG_3913.jpg',
      'IMG_3914.jpg',
      'IMG_4047.jpg',
      'IMG_4934.jpg',
      'IMG_4941.jpg',
      'IMG_4942.jpg',
      'IMG_4944.jpg',
      'IMG_4945.jpg',
      'IMG_5092.jpg',
      'IMG_5093.jpg',
      'IMG_5152.jpg',
      'IMG_5153.jpg',
      'IMG_5190.jpg',
      'IMG_5196.jpg',
      'IMG_5197.jpg',
      'IMG_5202.jpg',
      'IMG_5518.jpg',
      'IMG_5519.jpg',
      'IMG_5521.jpg',
      'IMG_5561.jpg',
      'IMG_5870.jpg',
      'IMG_5915.jpg',
      'IMG_5989.jpg',
      'IMG_6167.jpg',
      'IMG_6325.jpg',
      'IMG_8631.jpg',
      'IMG_8787.jpg',
      'IMG_8836.jpg',
      'IMG_8897.jpg',
      'IMG_9066.jpg',
      'IMG_9067.jpg',
      'IMG_9077.jpg',
      'IMG_9787.jpg',
      'IMG_9934.jpg',
      'IMG_9940.jpg'
    ];
  } else if (galleryType === 'maintenance') {
    return [
      'FullSizeRender.jpg',
      'IMG_0549.jpg',
      'IMG_0556.jpg',
      'IMG_1823.jpg',
      'IMG_2251.jpg',
      'IMG_2276.jpg',
      'IMG_2320.jpg',
      'IMG_3329.jpg',
      'IMG_3330.jpg',
      'IMG_3334.jpg',
      'IMG_3335.jpg',
      'IMG_3336.jpg',
      'IMG_3337.jpg',
      'IMG_3418.jpg',
      'IMG_3422.jpg',
      'IMG_3432.jpg',
      'IMG_3436.jpg',
      'IMG_3437.jpg',
      'IMG_3640.jpg',
      'IMG_3736.jpg',
      'IMG_3737.jpg',
      'IMG_3748.jpg',
      'IMG_3832.jpg',
      'IMG_3834.jpg',
      'IMG_3905.jpg',
      'IMG_3906.jpg',
      'IMG_3907.jpg',
      'IMG_3911.jpg',
      'IMG_4783.jpg',
      'IMG_4941.jpg',
      'IMG_4944.jpg',
      'IMG_5185.jpg',
      'IMG_5186.jpg',
      'IMG_5187.jpg',
      'IMG_5188.jpg',
      'IMG_5552.jpg',
      'IMG_5553.jpg',
      'IMG_5681.jpg',
      'IMG_6171.jpg',
      'IMG_6185.jpg',
      'IMG_6560.jpg',
      'IMG_6561.jpg',
      'IMG_8755.jpg'
    ];
  }
  return [];
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

// Full Gallery Initialization
function initializeFullGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-gallery');
    
    if (!galleryGrid) return;

    // Combine images from different categories for the full gallery
    const serviceImages = getImageFiles('service').map(img => `../assets/images/services/Általános szerviz/Éves szerviz/${img}`);
    const maintenanceImages = getImageFiles('maintenance').map(img => `../assets/images/services/Általános szerviz/Fék futómű/${img}`);
    
    // Combine and shuffle
    const allImages = [...serviceImages, ...maintenanceImages].sort(() => Math.random() - 0.5);
    
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
            a.dataset.fancybox = "gallery";
            a.className = "block overflow-hidden rounded-lg shadow-lg hover:opacity-90 transition-opacity h-64";
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = "Galéria kép";
            img.className = "w-full h-full object-cover transform hover:scale-105 transition-transform duration-500";
            img.loading = "lazy";
            
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
        Fancybox.bind("[data-fancybox]", {
            Toolbar: {
                display: {
                    left: ["infobar"],
                    middle: ["zoomIn", "zoomOut", "toggle1to1", "rotateCCW", "rotateCW", "flipX", "flipY"],
                    right: ["slideshow", "thumbs", "close"],
                },
            },
             Images: {
                zoom: true,
             },
        });
    }
}
