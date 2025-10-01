
// Auto-kozmetika page functionality

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  initializeVideoGallery();
  initializeAnimations();
  initializeMobileLanguageSelector(); // Új függvény hozzáadva
});

// Page initialization
function initializePage() {
  // A script.min.js már inicializálja a szolgáltatások menüt az initServicesSelector() függvénnyel
  // Nem kell külön initializeServicesMenu() hívás, mert az ütközne a script.min.js-sel
  // Desktop services menu is handled by script.min.js initServicesSelector()
  // Mobile services menu is also handled by script.min.js initServicesSelector()
  initializeMobileLanguageSelector();
  console.log('Auto-kozmetika page initialized');
}

// Video gallery configuration
const videoGalleryConfig = {
  containerId: 'video-container',
  videoPath: '../assets/images/services/auto_kozmetika/',
  videos: [],
  videoGroups: [],
  currentGroupIndex: 0,
  interval: null,
  autoSlideEnabled: true
};

// Auto-slide interval for videos (longer than images)
const VIDEO_SLIDE_INTERVAL = 8000; // 8 seconds

// Initialize video gallery
function initializeVideoGallery() {
  loadVideoGallery();
  setupVideoControls();
  
  // Add responsive handling with debounce
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleVideoGalleryResize, 250);
  });
  handleVideoGalleryResize(); // Initial call
  
  // Ensure videos keep playing even when user navigates away
  document.addEventListener('visibilitychange', ensureVideosKeepPlaying);
  window.addEventListener('blur', ensureVideosKeepPlaying);
  window.addEventListener('focus', ensureVideosKeepPlaying);
}

// Ensure videos keep playing
function ensureVideosKeepPlaying() {
  const videos = document.querySelectorAll('#video-container video');
  videos.forEach(video => {
    if (video.paused && !video.ended) {
      // Small delay to ensure the event has fully processed
      setTimeout(() => {
        video.play().catch(e => console.log('Video resume prevented:', e));
      }, 100);
    }
  });
}

// Load video gallery
function loadVideoGallery() {
  const container = document.getElementById(videoGalleryConfig.containerId);
  
  if (!container) {
    console.warn(`Video container ${videoGalleryConfig.containerId} not found`);
    return;
  }

  // Add loading state
  container.classList.add('gallery-loading');
  
  // Define video files
  const videoFiles = getVideoFiles();
  
  if (videoFiles.length === 0) {
    console.warn('No videos found for auto-kozmetika gallery');
    return;
  }

  // Store video files in config
  videoGalleryConfig.videos = videoFiles.map(filename => videoGalleryConfig.videoPath + filename);
  
  // Create video elements
  createVideoElements();
  
  // Video indicators removed to improve performance
  // createVideoIndicators();
  
  // Auto-slide is now handled in createVideoElements() based on device type
  
  // Remove loading state
  setTimeout(() => {
    container.classList.remove('gallery-loading');
  }, 500);
}

// Get video files
function getVideoFiles() {
  return [
    '1.mp4',
    '2.mp4',
    '3.mp4',
    '4.mp4',
    '5.mp4',
    '6.MP4'
  ];
}

// Create video elements
function createVideoElements() {
  const container = document.getElementById(videoGalleryConfig.containerId);
  
  // Clear existing content
  container.innerHTML = '';
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Mobile: create individual video elements in a scrollable list
    createMobileVideoLayout(container);
  } else {
    // Desktop: create video groups (3 videos per group)
    createDesktopVideoLayout(container);
  }
}

// Create mobile video layout - videos in a scrollable list
function createMobileVideoLayout(container) {
  // Remove auto-slide functionality for mobile
  videoGalleryConfig.autoSlideEnabled = false;
  
  // Create individual video elements
  videoGalleryConfig.videos.forEach((videoSrc, videoIndex) => {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'video-wrapper mobile-video';
    videoWrapper.style.position = 'relative';
    videoWrapper.style.width = '100%';
    videoWrapper.style.height = 'auto';
    videoWrapper.style.borderRadius = '8px';
    videoWrapper.style.overflow = 'hidden';
    videoWrapper.style.marginBottom = '20px';
    videoWrapper.style.minHeight = '300px';
    videoWrapper.setAttribute('data-video-index', videoIndex);
    
    const video = document.createElement('video');
    video.src = videoSrc;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.style.position = 'relative';
    video.style.width = '100%';
    video.style.height = 'auto';
    video.style.objectFit = 'contain';
    video.style.borderRadius = '8px';
    video.style.minHeight = '300px';
    video.setAttribute('data-video-index', videoIndex);
    
    // Initially pause all videos
    video.pause();
    
    // Play video when it comes into view with Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Play the current video
          video.play().catch(e => console.log('Video play prevented:', e));
          
          // Pause all other videos
          const allVideos = document.querySelectorAll('#video-container video');
          allVideos.forEach(otherVideo => {
            if (otherVideo !== video) {
              otherVideo.pause();
            }
          });
          
          // Add active class to current video wrapper
          const allVideoWrappers = document.querySelectorAll('#video-container .mobile-video');
          allVideoWrappers.forEach(wrapper => {
            wrapper.classList.remove('active-video');
          });
          videoWrapper.classList.add('active-video');
          
        } else {
          // Pause video when it goes out of view
          video.pause();
          videoWrapper.classList.remove('active-video');
        }
      });
    }, { 
      threshold: 0.5, // Video must be 50% visible to start playing
      rootMargin: '0px 0px -100px 0px' // Start playing slightly before fully in view
    });
    
    observer.observe(videoWrapper);
    
    videoWrapper.appendChild(video);
    container.appendChild(videoWrapper);
  });
  
  // Add scroll event listener for better video control
  let scrollTimeout;
  container.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // After scrolling stops, ensure only the most visible video is playing
      optimizeVideoPlaybackAfterScroll();
    }, 150); // Wait 150ms after scrolling stops
  });
}

// Create desktop video layout - 3 videos at a time with individual replacement
function createDesktopVideoLayout(container) {
  // Create initial 3 videos
  const initialVideos = videoGalleryConfig.videos.slice(0, 3);
  
  // Store video state
  videoGalleryConfig.currentVideos = initialVideos;
  videoGalleryConfig.playedVideos = new Set();
  videoGalleryConfig.availableVideos = videoGalleryConfig.videos.slice(3);
  
  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-grid');
  videoContainer.style.display = 'grid';
  videoContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
  videoContainer.style.gap = '30px';
  videoContainer.style.width = '100%';
  
  // Create 3 video elements
  initialVideos.forEach((videoSrc, videoIndex) => {
    const videoWrapper = createVideoElement(videoSrc, videoIndex);
    videoContainer.appendChild(videoWrapper);
  });
  
  container.appendChild(videoContainer);
  
  // Start video monitoring
  startVideoMonitoring();
}

// Create individual video element
function createVideoElement(videoSrc, videoIndex) {
  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'video-wrapper';
  videoWrapper.style.position = 'relative';
  videoWrapper.style.width = '100%';
  videoWrapper.style.height = 'auto';
  videoWrapper.style.borderRadius = '8px';
  videoWrapper.style.overflow = 'hidden';
  
  const video = document.createElement('video');
  video.src = videoSrc;
  video.muted = true;
  video.loop = false;
  video.playsInline = true;
  video.preload = 'metadata';
  video.style.position = 'relative';
  video.style.width = '100%';
  video.style.height = 'auto';
  video.style.objectFit = 'contain';
      video.style.borderRadius = '8px';
      video.setAttribute('data-video-src', videoSrc);
      
      // Add ended event listener
      video.addEventListener('ended', () => handleVideoEnded(video, videoWrapper));
      
      // Start playing immediately and ensure it keeps playing
      video.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.log('Video play prevented:', e);
        }
      });
      
      // Add play event listener to ensure video keeps playing
      video.addEventListener('play', () => {
        // Video is playing, ensure it continues
        video.muted = true;
        video.loop = false;
      });
      
      // Add pause event listener to resume playback
      video.addEventListener('pause', () => {
        // If video gets paused, try to resume it
        setTimeout(() => {
          if (video.paused) {
            video.play().catch(e => console.log('Video resume prevented:', e));
          }
        }, 100);
      });
      
      videoWrapper.appendChild(video);
      return videoWrapper;
}

// Handle video ended event
function handleVideoEnded(video, videoWrapper) {
  // Mark video as played
  videoGalleryConfig.playedVideos.add(video.src);
  
  // Get next available video
  const nextVideo = getNextAvailableVideo();
  
  if (nextVideo && videoWrapper && videoWrapper.parentNode) {
    // Replace the ended video with a new one
    const newVideoWrapper = createVideoElement(nextVideo, Date.now());
    if (newVideoWrapper) {
      videoWrapper.parentNode.replaceChild(newVideoWrapper, videoWrapper);
      
      // Ensure the new video starts playing immediately
      const newVideo = newVideoWrapper.querySelector('video');
      if (newVideo) {
        newVideo.play().catch(e => console.log('Video play prevented:', e));
      }
    }
  }
}

// Get next available video
function getNextAvailableVideo() {
  // Find a video that hasn't been played yet
  for (let videoSrc of videoGalleryConfig.availableVideos) {
    if (!videoGalleryConfig.playedVideos.has(videoSrc)) {
      return videoSrc;
    }
  }
  
  // If all videos have been played, reset and start over
  if (videoGalleryConfig.playedVideos.size >= videoGalleryConfig.videos.length) {
    videoGalleryConfig.playedVideos.clear();
    videoGalleryConfig.availableVideos = [...videoGalleryConfig.videos];
    return videoGalleryConfig.availableVideos[0];
  }
  
  return null;
}

// Start video monitoring
function startVideoMonitoring() {
  // Monitor videos for ended events
  const videos = document.querySelectorAll('#video-container video');
  videos.forEach(video => {
    if (!video.hasAttribute('data-monitored')) {
      video.setAttribute('data-monitored', 'true');
      video.addEventListener('ended', () => handleVideoEnded(video, video.closest('.video-wrapper')));
      
      // Ensure video keeps playing even if interrupted
      video.addEventListener('pause', () => {
        // If video gets paused, try to resume it
        setTimeout(() => {
          if (video.paused && !video.ended) {
            video.play().catch(e => console.log('Video resume prevented:', e));
          }
        }, 200);
      });
      
      // Ensure video is muted and ready to play
      video.addEventListener('loadstart', () => {
        video.muted = true;
        video.playsInline = true;
      });
    }
  });
  
  // Start continuous monitoring
  setInterval(() => {
    const currentVideos = document.querySelectorAll('#video-container video');
    currentVideos.forEach(video => {
      if (video.paused && !video.ended) {
        video.play().catch(e => console.log('Video resume prevented:', e));
      }
    });
  }, 2000); // Check every 2 seconds
}

// Create video indicators
// Video indicators function removed to improve performance
// function createVideoIndicators() {
//   const indicatorsContainer = document.getElementById('video-indicators');
//   
//   if (!indicatorsContainer) {
//     console.warn('Video indicators container not found');
//     return;
//   }
//   
//   // Clear existing indicators
//   indicatorsContainer.innerHTML = '';
//   
//   // Create indicator for each video
//   videoGalleryConfig.videos.forEach((_, index) => {
//     const indicator = document.createElement('button');
//     indicator.className = `video-indicator ${index === 0 ? 'active' : ''}`;
//     indicator.setAttribute('aria-label', `Videó ${index + 1} megtekintése`);
//     indicator.addEventListener('click', () => showVideo(index));
//     
//     indicatorsContainer.appendChild(indicator);
//   });
// }

// Setup video controls
function setupVideoControls() {
  // Navigációs gombok eltávolítva - csak automatikus váltás
}

// Show specific video group
function showVideo(groupIndex) {
  const container = document.getElementById(videoGalleryConfig.containerId);
  const videoGroups = container.querySelectorAll('.video-group');
  
  if (groupIndex < 0 || groupIndex >= videoGroups.length) return;
  
  // Hide current group and pause all videos in it
  const currentGroup = videoGroups[videoGalleryConfig.currentGroupIndex];
  if (currentGroup) {
    currentGroup.style.opacity = '0';
    const currentVideos = currentGroup.querySelectorAll('video');
    currentVideos.forEach(video => {
      video.pause();
    });
  }
  
  // Show new group and play all videos in it
  const newGroup = videoGroups[groupIndex];
  if (newGroup) {
    newGroup.style.opacity = '1';
    const newVideos = newGroup.querySelectorAll('video');
    newVideos.forEach(video => {
      video.play().catch(e => console.log('Video play prevented:', e));
    });
  }
  
  // Update current group index
  videoGalleryConfig.currentGroupIndex = groupIndex;
  
  // Restart auto-slide
  if (videoGalleryConfig.autoSlideEnabled) {
    stopVideoAutoSlide();
    startVideoAutoSlide();
  }
}

// Start auto-slide for videos
function startVideoAutoSlide() {
  if (videoGalleryConfig.interval) {
    clearInterval(videoGalleryConfig.interval);
  }
  
  videoGalleryConfig.interval = setInterval(() => {
    const nextIndex = videoGalleryConfig.currentGroupIndex < videoGalleryConfig.videoGroups.length - 1 
      ? videoGalleryConfig.currentGroupIndex + 1 
      : 0;
    showVideo(nextIndex);
  }, VIDEO_SLIDE_INTERVAL);
}

// Stop auto-slide for videos
function stopVideoAutoSlide() {
  if (videoGalleryConfig.interval) {
    clearInterval(videoGalleryConfig.interval);
    videoGalleryConfig.interval = null;
  }
}

// Pause auto-slide when user interacts
function pauseVideoAutoSlide() {
  videoGalleryConfig.autoSlideEnabled = false;
  stopVideoAutoSlide();
}

// Resume auto-slide
function resumeVideoAutoSlide() {
  videoGalleryConfig.autoSlideEnabled = true;
  startVideoAutoSlide();
}

// Handle video gallery responsive behavior
function handleVideoGalleryResize() {
  const container = document.getElementById(videoGalleryConfig.containerId);
  if (!container) return;
  
  const currentIsMobile = window.innerWidth <= 768;
  const hasMobileVideos = container.querySelector('.mobile-video');
  const hasVideoGroups = container.querySelector('.video-group');
  
  // Check if we need to recreate the layout
  if ((currentIsMobile && !hasMobileVideos) || (!currentIsMobile && !hasVideoGroups)) {
    // Recreate video layout when switching between mobile and desktop
    createVideoElements();
    return;
  }
  
  // Handle responsive behavior for video grid
  const videoGrid = container.querySelector('.video-grid');
  if (videoGrid) {
    if (currentIsMobile) {
      // Mobile: videos stacked vertically
      videoGrid.style.display = 'flex';
      videoGrid.style.flexDirection = 'column';
      videoGrid.style.gap = '15px';
    } else {
      // Desktop: videos in grid
      videoGrid.style.display = 'grid';
      videoGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
      videoGrid.style.gap = '30px';
    }
  }
  
  // Adjust container height
  if (currentIsMobile) {
    container.style.minHeight = 'auto';
    container.style.height = 'auto';
    container.style.overflow = 'visible';
      } else {
      container.style.minHeight = '500px';
      container.style.height = 'auto';
      container.style.overflow = 'visible';
      container.style.maxHeight = 'none';
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Don't pause videos when page is hidden
    // Videos should continue playing in background
    console.log('Page hidden, but videos continue playing');
  } else {
    // When page becomes visible again, ensure all videos are playing
    const videos = document.querySelectorAll('#video-container video');
    videos.forEach(video => {
      if (video.paused && !video.ended) {
        video.play().catch(e => console.log('Video resume prevented:', e));
      }
    });
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
  stopVideoAutoSlide();
});

// Initialize animations
function initializeAnimations() {
  // Fade in animations for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.fade-in-up, .service-card, .video-gallery-section');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeVideoGallery,
    showVideo,
    pauseVideoAutoSlide,
    resumeVideoAutoSlide
  };
}

// Optimize video playback after scrolling stops
function optimizeVideoPlaybackAfterScroll() {
  const container = document.getElementById(videoGalleryConfig.containerId);
  if (!container) return;
  
  const videos = document.querySelectorAll('#video-container .mobile-video');
  let mostVisibleVideo = null;
  let maxVisibility = 0;
  
  videos.forEach(videoWrapper => {
    const rect = videoWrapper.getBoundingClientRect();
    const video = videoWrapper.querySelector('video');
    
    // Calculate visibility percentage
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const visibility = Math.max(0, visibleHeight / rect.height);
    
    if (visibility > maxVisibility) {
      maxVisibility = visibility;
      mostVisibleVideo = video;
    }
    
    // Pause all videos initially
    if (video) {
      video.pause();
    }
  });
  
  // Play only the most visible video
  if (mostVisibleVideo && maxVisibility > 0.3) {
    mostVisibleVideo.play().catch(e => console.log('Video play prevented:', e));
    
    // Update active state
    const allVideoWrappers = document.querySelectorAll('#video-container .mobile-video');
    allVideoWrappers.forEach(wrapper => {
      wrapper.classList.remove('active-video');
    });
    if (mostVisibleVideo.closest('.mobile-video')) {
      mostVisibleVideo.closest('.mobile-video').classList.add('active-video');
    }
  }
}

// Initialize mobile language selector specifically for this page
function initializeMobileLanguageSelector() {
  const languageBtnMobile = document.querySelector('.language-selector-mobile-btn');
  const languageMenuMobile = document.getElementById('language-menu-mobile');
  const languageOptionsMobile = document.querySelectorAll('.language-option-mobile');
  
  if (languageBtnMobile && languageMenuMobile) {
    console.log('Mobile language selector initialized');
    
    languageBtnMobile.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isHidden = languageMenuMobile.classList.contains('hidden');
      console.log('Mobile language selector clicked, isHidden:', isHidden);
      
      if (isHidden) {
        languageMenuMobile.classList.remove('hidden');
        console.log('Mobile language menu opened');
      } else {
        languageMenuMobile.classList.add('hidden');
        console.log('Mobile language menu closed');
      }
    });
    
    // Language option clicks
    languageOptionsMobile.forEach(option => {
      option.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        if (typeof changeLanguage === 'function') {
          changeLanguage(lang);
        }
        languageMenuMobile.classList.add('hidden');
        console.log('Language changed to:', lang);
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!languageBtnMobile.contains(event.target) && !languageMenuMobile.contains(event.target)) {
        if (!languageMenuMobile.classList.contains('hidden')) {
          languageMenuMobile.classList.add('hidden');
          console.log('Mobile language menu closed (click outside)');
        }
      }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        if (!languageMenuMobile.classList.contains('hidden')) {
          languageMenuMobile.classList.add('hidden');
          console.log('Mobile language menu closed (Escape key)');
        }
      }
    });
  } else {
    console.warn('Mobile language selector elements not found:', {
      btn: !!languageBtnMobile,
      menu: !!languageMenuMobile
    });
  }
}

// Desktop szolgáltatások menü inicializálása