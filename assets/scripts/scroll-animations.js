/**
 * Scroll-Triggered Animations
 * Implements fade-in-up animations using Intersection Observer
 */

(function() {
  'use strict';

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  /**
   * Initialize scroll animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    if (!animatedElements.length) return;

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing after animation
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      animatedElements.forEach(element => {
        observer.observe(element);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      animatedElements.forEach(element => {
        element.classList.add('visible');
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // Also initialize on window load
  window.addEventListener('load', () => {
    setTimeout(initScrollAnimations, 100);
  });
})();
