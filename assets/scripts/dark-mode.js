/**
 * Dark Mode Toggle
 * Handles theme switching with localStorage persistence
 */

(function() {
  'use strict';

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Set smooth transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle switch if it exists
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
      themeSwitch.checked = newTheme === 'dark';
    }
    
    // Remove transition after animation completes
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  /**
   * Initialize theme from localStorage
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
      themeSwitch.checked = savedTheme === 'dark';
      themeSwitch.addEventListener('change', toggleTheme);
    }
  }

  /**
   * Create and inject theme toggle if it doesn't exist
   * DISABLED: Theme toggle is hidden for consistent visual experience
   */
  function createThemeToggle() {
    // Theme toggle creation disabled - keeping light theme only
    return;
    
    // Update slider position based on theme
    const updateSlider = () => {
      const slider = document.querySelector('.toggle-slider > div');
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (slider) {
        slider.style.left = isDark ? '22px' : '2px';
      }
    };
    
    updateSlider();
    document.getElementById('theme-switch').addEventListener('change', updateSlider);
  }

  // Initialize theme immediately to prevent flash
  // Force light theme only - dark mode toggle disabled
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light');

  // Initialize when DOM is ready
  // Theme toggle creation disabled for consistent visual experience
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // createThemeToggle(); // Disabled
      // initTheme(); // Disabled
    });
  } else {
    // createThemeToggle(); // Disabled
    // initTheme(); // Disabled
  }
})();
