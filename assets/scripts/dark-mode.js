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
   */
  function createThemeToggle() {
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) return;

    const toggleHTML = `
      <div class="theme-toggle" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
        <input type="checkbox" id="theme-switch" class="theme-switch" style="display: none;">
        <label for="theme-switch" class="theme-label" style="cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <span class="sun-icon" style="font-size: 18px;">☀️</span>
          <div class="toggle-slider" style="width: 40px; height: 20px; background: rgba(255, 255, 255, 0.3); border-radius: 10px; position: relative; transition: all 0.3s;">
            <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.3s;"></div>
          </div>
          <span class="moon-icon" style="font-size: 18px;">🌙</span>
        </label>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toggleHTML);
    
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
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createThemeToggle();
      initTheme();
    });
  } else {
    createThemeToggle();
    initTheme();
  }
})();
