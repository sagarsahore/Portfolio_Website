/**
 * Dynamic Stats Counter Animation
 * Animates numbers from 0 to target value
 */

(function() {
  'use strict';

  /**
   * Animate a single counter element
   * @param {HTMLElement} counter - The counter element to animate
   */
  function animateCounter(counter) {
    const target = parseInt(counter.textContent);
    const duration = 1500; // 1.5 seconds
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    const increment = target / totalFrames;
    let current = 0;
    let frame = 0;

    const updateCounter = () => {
      if (frame < totalFrames) {
        current += increment;
        counter.textContent = Math.ceil(current);
        frame++;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  }

  /**
   * Initialize counter animation when counters are visible
   */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .counter');
    
    if (!counters.length) return;

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5
      });

      counters.forEach(counter => {
        observer.observe(counter);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      counters.forEach(counter => {
        if (!counter.classList.contains('animated')) {
          counter.classList.add('animated');
          animateCounter(counter);
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounterAnimation);
  } else {
    initCounterAnimation();
  }

  // Also initialize on window load to catch any dynamically added counters
  window.addEventListener('load', () => {
    setTimeout(initCounterAnimation, 100);
  });
})();
