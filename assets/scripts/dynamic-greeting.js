/**
 * Dynamic Greeting
 * Updates greeting based on time of day
 */

(function() {
  'use strict';

  /**
   * Get appropriate greeting based on current time
   * @returns {string} The greeting message
   */
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 17) return "Good afternoon!";
    return "Good evening!";
  }

  /**
   * Update greeting in the DOM
   */
  function updateGreeting() {
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
      greetingElement.textContent = getGreeting() + " I'm";
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateGreeting);
  } else {
    updateGreeting();
  }
})();
