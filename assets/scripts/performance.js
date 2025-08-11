/* Image Optimization Script for Portfolio */

// Utility to create responsive image sources
function createResponsiveImage(img, sizes = {}) {
  const src = img.src;
  const baseName = src.split('.').slice(0, -1).join('.');
  const ext = src.split('.').pop();
  
  // Create srcset for different sizes
  const srcset = [];
  Object.entries(sizes).forEach(([size, width]) => {
    srcset.push(`${baseName}-${size}.webp ${width}w`);
  });
  
  if (srcset.length > 0) {
    img.srcset = srcset.join(', ');
    img.sizes = `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw`;
  }
  
  return img;
}

// Lazy loading implementation with Intersection Observer
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px 0px',
  threshold: 0.01
});

// Initialize lazy loading for images below the fold
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    lazyImages.forEach(img => {
      lazyImageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without Intersection Observer
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
});

// Performance monitoring
function measureLCP() {
  if ('PerformanceObserver' in window) {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`LCP: ${lastEntry.startTime}ms`);
    });
    po.observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

function measureCLS() {
  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    const po = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log(`CLS: ${clsValue}`);
    });
    po.observe({ entryTypes: ['layout-shift'] });
  }
}

function measureINP() {
  if ('PerformanceObserver' in window) {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log(`INP: ${entry.processingStart - entry.startTime}ms`);
      });
    });
    po.observe({ entryTypes: ['event'] });
  }
}

// Initialize performance monitoring
if (window.location.search.includes('debug=performance')) {
  measureLCP();
  measureCLS();
  measureINP();
}

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  document.documentElement.style.setProperty('--transition-duration', '0.01ms');
}

// Network-aware loading
if ('connection' in navigator) {
  const connection = navigator.connection;
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) {
    document.body.classList.add('slow-connection');
    // Disable heavy animations and effects
    const particles = document.querySelectorAll('.vlt-particle');
    particles.forEach(particle => {
      particle.style.display = 'none';
    });
  }
}

// Export for use in other scripts
window.PerformanceUtils = {
  createResponsiveImage,
  measureLCP,
  measureCLS,
  measureINP
};